import api from "../Services/api";
import { getProductId, toCartItem, getProductImages } from "./storefront";

export const hasAuthToken = () => Boolean(localStorage.getItem("token"));

const getProductRef = (item = {}) =>
  item.productId || item.product || item.item?.productId || item.item?.product || item;

const shouldIgnoreError = (status) => status === 404 || status === 405;

const tryRequestEndpoints = async (urls = [], method = "get", payload = null) => {
  let lastError = null;

  for (const url of urls) {
    try {
      const response =
        method === "get" ? await api.get(url) : await api.post(url, payload || {});
      console.log(`✅ ${method.toUpperCase()} endpoint worked: ${url}`);
      return response;
    } catch (error) {
      if (shouldIgnoreError(error.response?.status)) {
        console.warn(`⚠️ ${method.toUpperCase()} endpoint unavailable: ${url}`);
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error(`No valid endpoint found for ${method.toUpperCase()}: ${urls.join(", ")}`);
};

const tryGetEndpoints = async (urls = []) => {
  try {
    return await tryRequestEndpoints(urls, "get");
  } catch {
    console.warn("⚠️ All GET endpoints failed, trying POST fallback...");
    return await tryRequestEndpoints(urls, "post", {});
  }
};

const getRefId = (ref) => {
  if (!ref) return "";

  if (typeof ref === "object") {
    if (ref.productId) return getProductId(ref.productId);
    if (ref._id) return getProductId(ref._id);
    return getProductId(ref);
  }

  return String(ref);
};

const findProduct = (ref, products = []) => {
  if (ref && typeof ref === "object" && ref.name) return ref;

  const id = getRefId(ref);
  return products.find((product) => getProductId(product) === id);
};

const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch product ${id}:`, error.message);
    return null;
  }
};

export const normalizeLineItem = (item = {}, products = []) => {
  const quantity = Number(item.quantity) || 1;
  const ref = getProductRef(item);
  const id = getRefId(ref);
  const product = findProduct(ref, products);

  const price = Number(item.price ?? product?.price) || 0;
  const discount = Number(product?.discount ?? item.discount) || 0;

  const fallbackProduct = {
    _id: id || item._id,
    name: id ? `Product ${id.slice(-6)}` : "Product",
    brand: item.brand || "Database item",
    category: item.category || product?.category || "Product",
    price,
    discount,
    stock: Number(product?.stock) || 0,
    images: getProductImages({
      images: item.images || product?.images,
      image: item.image || product?.image,
      imageUrl: item.imageUrl || item.image_url || product?.imageUrl || product?.image_url,
    }),
  };

  const displayItem = toCartItem({ ...fallbackProduct, ...product, price, discount }, quantity);
  const unitTotal = Math.round(price - (price * discount) / 100);

  return {
    ...displayItem,
    dbItemId: item._id,
    productId: id || displayItem.id,
    total: Number(item.total) || unitTotal * quantity,
  };
};

export const fetchDatabaseCart = async (products = []) => {
  try {
    const response = await tryGetEndpoints([
      "/cart",
      "/api/cart",
      "/api/v1/cart",
      "/cart/all",
      "/api/cart/all",
      "/api/v1/cart/all",
    ]);

    const items =
      response.data?.items ||
      response.data?.cart?.items ||
      response.data?.data?.items ||
      response.data?.data ||
      response.data ||
      [];

    return Array.isArray(items) ? items.map((item) => normalizeLineItem(item, products)) : [];
  } catch (error) {
    console.error("❌ Cart fetch error:", error.response?.data || error.message);
    throw error;
  }
};

const tryDeleteEndpoints = async (urls = []) => {
  let lastError = null;

  for (const url of urls) {
    try {
      return await api.delete(url);
    } catch (error) {
      if (shouldIgnoreError(error.response?.status)) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error(`No valid delete endpoint found: ${urls.join(", ")}`);
};

export const deleteDatabaseCartItem = async (productId) => {
  try {
    await tryDeleteEndpoints([
      `/cart/product/${productId}`,
      `/api/cart/product/${productId}`,
      `/user/cart/product/${productId}`,
      `/cart/item/${productId}`,
    ]);
  } catch (error) {
    console.error("❌ Delete cart error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchDatabaseWishlist = async (products = []) => {
  try {
    const response = await tryGetEndpoints([
      "/wishlist/get",
      "/api/wishlist/get",
      "/wishlist",
      "/api/wishlist",
    ]);

    const items =
      response.data?.items ||
      response.data?.productIds ||
      response.data?.wishlist?.items ||
      response.data?.wishlist?.productIds ||
      response.data?.data?.items ||
      response.data?.data ||
      response.data ||
      [];

    if (!Array.isArray(items) || items.length === 0) return [];

    const isIdsArray = items.every(
      (item) => typeof item === "string" || (typeof item === "object" && item.productId && !item.name)
    );

    if (isIdsArray) {
      const ids = items.map((item) => (typeof item === "string" ? item : item.productId));
      const productPromises = ids.map((id) => fetchProductById(id));
      const productsData = await Promise.all(productPromises);
      return productsData.filter(Boolean).map((product) => toCartItem(product, 1));
    }

    return items.map((item) => normalizeLineItem({ ...item, quantity: 1 }, products));
  } catch (error) {
    console.error("❌ Wishlist fetch error:", error.response?.data || error.message);
    throw error;
  }
};

const extractOrderResponse = (response) => {
  if (!response?.data) return null;
  return response.data.order || response.data.data?.order || response.data.orderData || response.data.data || response.data;
};

export const submitDatabaseOrder = async (payload) => {
  const response = await tryRequestEndpoints(
    ["/order/add", "/orders/add", "/api/order/add", "/api/orders/add", "/checkout", "/order"],
    "post",
    payload
  );

  return extractOrderResponse(response);
};

export const fetchDatabaseOrders = async () => {
  try {
    const response = await api.get("/admin/all/orders");

    console.log("📦 Admin Orders API Response:", response.data);

    return response.data?.orders || [];
  } catch (error) {
    console.error("❌ Orders fetch error:", error.response?.data || error.message);
    return [];
  }
};

export const getApiErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || fallback;