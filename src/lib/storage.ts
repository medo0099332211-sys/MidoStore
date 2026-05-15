import { Product, Order } from "@/types";
import { generateId } from "@/lib/utils";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";

// 1. إعدادات الفايربيز الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyAaR8Rk3F3J4AwUG5qOcbxPlf3Q4DCOQjw",
  authDomain: "medo-f718d.firebaseapp.com",
  databaseURL: "https://medo-f718d-default-rtdb.firebaseio.com",
  projectId: "medo-f718d",
  storageBucket: "medo-f718d.firebasestorage.app",
  messagingSenderId: "545380550946",
  appId: "1:545380550946:web:89366eeee2f589efd7bd7b"
};

// 2. تشغيل الفايربيز
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const AUTH_KEY = "mido_store_admin_auth";

// ─── الدالات الخاصة بالمنتجات (Firebase) ──────────────────────────────────────

// جلب كل المنتجات - دي اللي بتخلي الناس تشوف الحاجة
export function getProducts(): Product[] {
  let products: Product[] = [];
  const productsRef = ref(db, 'products');
  
  // بنقرأ البيانات من السيرفر
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      products = Object.values(data);
    }
  });
  
  // ملاحظة: الفايربيز يعمل بلحظية، المواقع الحديثة ستحدث الواجهة تلقائياً
  return products;
}

// إضافة منتج جديد للسيرفر
export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const id = "prod_" + generateId();
  const newProduct: Product = {
    ...product,
    id: id,
    createdAt: new Date().toISOString(),
  };
  
  await set(ref(db, 'products/' + id), newProduct);
  return newProduct;
}

// تعديل منتج
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  await update(ref(db, 'products/' + id), updates);
}

// حذف منتج
export async function deleteProduct(id: string): Promise<void> {
  await remove(ref(db, 'products/' + id));
}

export function getProductById(id: string): Product | null {
  // سيتم البحث في القائمة المحملة في المتصفح
  return null; 
}

// ─── الدالات الخاصة بالطلبات (Firebase) ────────────────────────────────────────

export async function saveOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const id = "order_" + generateId();
  const newOrder: Order = {
    ...order,
    id: id,
    createdAt: new Date().toISOString(),
  };
  
  await set(ref(db, 'orders/' + id), newOrder);
  return newOrder;
}

// ─── الدخول للوحة التحكم (تبقى محلياً لسهولتها) ───────────────────────────────
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
