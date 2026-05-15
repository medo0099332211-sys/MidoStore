import { Product, Order } from "@/types";
import { generateId } from "@/lib/utils";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAaR8Rk3F3J4AwUG5qOcbxPlf3Q4DCOQjw",
  authDomain: "medo-f718d.firebaseapp.com",
  databaseURL: "https://medo-f718d-default-rtdb.firebaseio.com",
  projectId: "medo-f718d",
  storageBucket: "medo-f718d.firebasestorage.app",
  messagingSenderId: "545380550946",
  appId: "1:545380550946:web:89366eeee2f589efd7bd7b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const AUTH_KEY = "mido_store_admin_auth";

// جلب المنتجات بشكل يضمن ظهورها
export function getProducts(): Product[] {
  const cached = localStorage.getItem("mido_products_cache");
  return cached ? JSON.parse(cached) : [];
}

// تحديث الكاش المحلي عشان يظهر للناس فوراً
async function syncProducts() {
  const snapshot = await get(ref(db, 'products'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    const productsArray = Object.values(data) as Product[];
    localStorage.setItem("mido_products_cache", JSON.stringify(productsArray));
    window.dispatchEvent(new CustomEvent("mido_products_updated"));
  }
}

// تشغيل المزامنة أول ما الموقع يفتح
syncProducts();

export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const id = "prod_" + generateId();
  const newProduct: Product = {
    ...product,
    id: id,
    createdAt: new Date().toISOString(),
  };
  
  await set(ref(db, 'products/' + id), newProduct);
  await syncProducts(); // حدث القائمة بعد الإضافة
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  await set(ref(db, `products/${id}`), { ...(await getProductById(id)), ...updates });
  await syncProducts();
}

export async function deleteProduct(id: string): Promise<void> {
  const productsRef = ref(db, `products/${id}`);
  await set(productsRef, null);
  await syncProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await get(ref(db, `products/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function saveOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const id = "order_" + generateId();
  const newOrder: Order = { ...order, id, createdAt: new Date().toISOString() };
  await set(ref(db, 'orders/' + id), newOrder);
  return newOrder;
}

export function adminLogin(username: string, password: string): boolean {
  if (username === "admin" && password === "55555") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
