import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { getProducts } from "@/lib/storage";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setProducts(getProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // Listen for storage updates from admin dashboard
    const handleUpdate = () => refresh();
    window.addEventListener("mido_products_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("mido_products_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  return { products, loading, refresh };
}
