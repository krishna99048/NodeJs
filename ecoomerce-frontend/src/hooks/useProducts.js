import { useEffect, useState } from "react";
import api from "../Services/api";
import { subscribeTabEvents } from "../utils/tabSync";

const getProductArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/all");
        const backendProducts = getProductArray(response.data);

        if (!ignore) {
          setProducts(backendProducts);
          setError(backendProducts.length > 0 ? "" : "No products found in database.");
        }
      } catch (fetchError) {
        if (!ignore) {
          setProducts([]);
          setError(fetchError.response?.data?.message || fetchError.message || "Unable to fetch products from database.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();

    const cleanup = subscribeTabEvents((message) => {
      if (message?.type === "product-updated") {
        fetchProducts();
      }
    });

    return () => {
      ignore = true;
      cleanup();
    };
  }, []);

  return { products, loading, error };
};
