import api from "../Services/api";

const CART_KEY = "lumina_cart";
const WISHLIST_KEY = "lumina_wishlist";
const ORDER_KEY = "lumina_latest_order";

const hasToken = () => Boolean(localStorage.getItem("token"));

const syncSilently = (request) => {
  request.catch(() => undefined);
};

const trySilentPost = async (urls, payload) => {
  for (const url of urls) {
    try {
      return await api.post(url, payload);
    } catch (error) {
      if (error.response?.status === 404) continue;
      throw error;
    }
  }
};

const trySilentDelete = async (urls) => {
  for (const url of urls) {
    try {
      return await api.delete(url);
    } catch (error) {
      if (error.response?.status === 404) continue;
      throw error;
    }
  }
};

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getProductId = (product = {}) => {
  if (product == null) return "";
  if (typeof product === "string" || typeof product === "number") return String(product);
  if (typeof product === "object") {
    if (product._id) return String(product._id);
    if (product.id) return String(product.id);
    if (product.productId) return String(product.productId);
    if (product.slug) return String(product.slug);
    if (product.sku) return String(product.sku);
    if (product.name) return slugify(product.name);

    const objectIdString = typeof product.toString === "function" ? String(product.toString()) : "";
    const match = /ObjectId\(["']?([0-9a-fA-F]{24})["']?\)/.exec(objectIdString);
    if (match) return match[1];
    if (/^[0-9a-fA-F]{24}$/.test(objectIdString)) return objectIdString;
  }

  return "";
};

const normalizeImageValue = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object") {
    return (
      image.url ||
      image.src ||
      image.path ||
      image.image ||
      image.thumbnail ||
      image.publicUrl ||
      image.public_url ||
      image.asset?.url ||
      image.asset?.path ||
      ""
    );
  }
  return "";
};

const normalizeImageArray = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.map(normalizeImageValue).filter(Boolean);
  }
  const normalized = normalizeImageValue(images);
  return normalized ? [normalized] : [];
};

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3005";

const normalizeImageUrl = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  // If it's already an absolute URL or data URI, return it
  if (/^(https?:|data:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  // Handle paths that might already have /public or /uploads
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  
  // Use BASE_URL from env or fallback
  const baseUrl = (import.meta.env.VITE_BASE_URL || "http://localhost:3005").replace(/\/+$/, "");
  return `${baseUrl}${cleanPath}`;
};

export const getProductImage = (product = {}) => {
  const fromImages = normalizeImageArray(product.images);
  if (fromImages.length > 0) return normalizeImageUrl(fromImages[0]);

  const fromImage = normalizeImageValue(product.image);
  if (fromImage) return normalizeImageUrl(fromImage);

  const fromImageUrl = normalizeImageValue(product.imageUrl || product.image_url);
  if (fromImageUrl) return normalizeImageUrl(fromImageUrl);

  return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000";
};

export const getProductImages = (product = {}) => {
  const fromImages = normalizeImageArray(product.images).map(normalizeImageUrl).filter(Boolean);
  if (fromImages.length > 0) return fromImages;

  const fromImageArray = normalizeImageArray(product.image).map(normalizeImageUrl).filter(Boolean);
  if (fromImageArray.length > 0) return fromImageArray;

  const fromImageUrl = normalizeImageValue(product.imageUrl || product.image_url);
  if (fromImageUrl) return [normalizeImageUrl(fromImageUrl)];

  return [getProductImage(product)];
};

export const getDiscountedPrice = (product = {}) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  if (discount <= 0) return price;
  return Math.max(0, Math.round(price - (price * discount) / 100));
};

export const productMatchesSearch = (product, query) => {
  if (!query) return true;
  const searchValue = query.toLowerCase();

  return [product.name, product.brand, product.category, product.description]
    .filter(Boolean)
    .some((item) => item.toLowerCase().includes(searchValue));
};

const safeRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("shop-storage"));
};

export const toCartItem = (product, quantity = 1) => ({
  id: getProductId(product),
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: Number(product.price) || 0,
  discount: Number(product.discount) || 0,
  stock: Number(product.stock) || 0,
  image: getProductImage(product),
  quantity,
});

export const getCartItems = () => safeRead(CART_KEY, []);

export const saveCartItems = (items) => safeWrite(CART_KEY, items);

export const addCartItem = (product, quantity = 1) => {
  const cart = getCartItems();
  const id = getProductId(product);
  const existing = cart.find((item) => item.id === id);

  const nextCart = existing
    ? cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
          : item
      )
    : [...cart, toCartItem(product, quantity)];

  saveCartItems(nextCart);

  if (hasToken()) {
    syncSilently(
      trySilentPost(
        [
          "/cart/add",
          "/api/cart/add",
          "/user/cart/add",
          "/cart/item/add",
        ],
        { item: { productId: id, quantity } }
      )
    );
  }

  return nextCart;
};

export const updateCartQuantity = (id, quantity) => {
  const nextCart = getCartItems()
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item
    )
    .filter((item) => item.quantity > 0);

  saveCartItems(nextCart);

  if (hasToken()) {
    syncSilently(
      trySilentPost(
        [
          "/cart/add",
          "/api/cart/add",
          "/user/cart/add",
          "/cart/item/add",
        ],
        { item: { productId: id, quantity } }
      )
    );
  }

  return nextCart;
};

export const removeCartItem = (id) => {
  const nextCart = getCartItems().filter((item) => item.id !== id);
  saveCartItems(nextCart);

  if (hasToken()) {
    syncSilently(api.delete(`/cart/product/${id}`));
  }

  return nextCart;
};

export const clearCart = () => saveCartItems([]);

export const getCartSummary = (items = getCartItems()) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = items.reduce((total, item) => {
    const itemDiscount = Number(item.discount) || 0;
    return total + Math.round((item.price * item.quantity * itemDiscount) / 100);
  }, 0);
  const shipping = subtotal - discount >= 25000 || subtotal === 0 ? 0 : 499;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;
  const quantity = items.reduce((totalItems, item) => totalItems + item.quantity, 0);

  return { subtotal, discount, shipping, tax, total, quantity };
};

export const getWishlistItems = () => safeRead(WISHLIST_KEY, []);

export const saveWishlistItems = (items) => safeWrite(WISHLIST_KEY, items);

export const isWishlisted = (id) => getWishlistItems().some((item) => item.id === id);

export const toggleWishlistItem = (product) => {
  const wishlist = getWishlistItems();
  const id = getProductId(product);
  const exists = wishlist.some((item) => item.id === id);

  const nextWishlist = exists
    ? wishlist.filter((item) => item.id !== id)
    : [...wishlist, toCartItem(product, 1)];

  saveWishlistItems(nextWishlist);

  if (hasToken()) {
    if (!exists) {
      syncSilently(
        trySilentPost([
          "/wishlist/add",
          "/api/wishlist/add",
          "/user/wishlist/add",
          "/wishlist/item/add",
        ], { item: { productId: id } })
      );
    } else {
      syncSilently(
        trySilentDelete([
          `/wishlist/product/${id}`,
          `/api/wishlist/product/${id}`,
          `/user/wishlist/product/${id}`,
          `/wishlist/item/${id}`,
        ])
      );
    }
  }

  return nextWishlist;
};

export const removeWishlistItem = (id) => {
  const nextWishlist = getWishlistItems().filter((item) => item.id !== id);
  saveWishlistItems(nextWishlist);

  if (hasToken()) {
    syncSilently(
      trySilentDelete([
        `/wishlist/product/${id}`,
        `/api/wishlist/product/${id}`,
        `/user/wishlist/product/${id}`,
        `/wishlist/item/${id}`,
      ])
    );
  }

  return nextWishlist;
};

export const saveLatestOrder = (order) => safeWrite(ORDER_KEY, order);

export const getLatestOrder = () => safeRead(ORDER_KEY, null);
