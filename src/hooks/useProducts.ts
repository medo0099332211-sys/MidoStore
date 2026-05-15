import { useState, useEffect } from "react";
import { Product } from "@/types";
import { getDatabase, ref, onValue } from "firebase/database";
import { getApps } from "firebase/app";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apps = getApps();
    if (apps.length === 0) {
      setLoading(false);
      return;
    }

    const db = getDatabase(apps[0]);
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.values(data) : []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading };
}
