import { Product, Order } from "@/types";
import { generateId } from "@/lib/utils";

const PRODUCTS_KEY = "mido_store_products";
const ORDERS_KEY = "mido_store_orders";
const AUTH_KEY = "mido_store_admin_auth";

// ─── Default sample products ──────────────────────────────────────────────────
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "بدلة رجالية كلاسيكية فاخرة",
    description: "بدلة رجالية أنيقة من القماش الإيطالي الفاخر، مثالية للمناسبات الرسمية والحفلات. تصميم عصري يجمع بين الأناقة والراحة.",
    price: 2800,
    originalPrice: 3500,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80",
    ],
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "كحلي", hex: "#1B2A4A" },
      { name: "رمادي فاتح", hex: "#8A8F9C" },
      { name: "أسود", hex: "#1A1A1A" },
    ],
    inStock: true,
    featured: true,
    badge: "الأكثر مبيعاً",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_002",
    name: "فستان سهرة ملكي",
    description: "فستان سهرة فاخر مطرز بالخرز، تصميم راقٍ يليق بالمرأة المتميزة. قماش حريري ناعم مع تفاصيل ذهبية مبهرة.",
    price: 3200,
    originalPrice: 4000,
    images: [
      "https://images.unsplash.com/photo-1566479179817-23e2e92de2e3?w=600&h=750&fit=crop&q=80",
    ],
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "أحمر ملكي", hex: "#8B0000" },
      { name: "أسود", hex: "#1A1A1A" },
      { name: "ذهبي", hex: "#D4AF37" },
    ],
    inStock: true,
    featured: true,
    badge: "جديد",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_003",
    name: "حذاء جلد إيطالي للرجال",
    description: "حذاء رجالي من الجلد الطبيعي الإيطالي الأصلي، مريح ومتين. مناسب للمناسبات الرسمية واليومية الراقية.",
    price: 1500,
    originalPrice: 1900,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&q=80",
    ],
    category: "footwear",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "بني", hex: "#5C3A1E" },
      { name: "أسود", hex: "#1A1A1A" },
      { name: "عسلي", hex: "#C68642" },
    ],
    inStock: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_004",
    name: "عباية مطرزة فاخرة",
    description: "عباية سوداء فاخرة مطرزة بخيوط ذهبية ولؤلؤ. تصميم عصري يجمع بين الأصالة والأناقة الحديثة.",
    price: 1800,
    originalPrice: 2200,
    images: [
      "https://images.unsplash.com/photo-1558171813-b29a17f5a0e8?w=600&h=750&fit=crop&q=80",
    ],
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "أسود", hex: "#1A1A1A" },
      { name: "كحلي", hex: "#1B2A4A" },
    ],
    inStock: true,
    featured: true,
    badge: "الأكثر طلباً",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_005",
    name: "شال كشمير فاخر",
    description: "شال نسائي من أجود أنواع الكشمير، ناعم وخفيف مع دفء فائق. متوفر بألوان متعددة تناسب جميع الأذواق.",
    price: 650,
    originalPrice: 850,
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=750&fit=crop&q=80",
    ],
    category: "accessories",
    sizes: ["One Size"],
    colors: [
      { name: "بيج", hex: "#C8A882" },
      { name: "وردي", hex: "#D4A0B0" },
      { name: "رمادي", hex: "#9A9A9A" },
      { name: "أزرق", hex: "#6B8CAE" },
    ],
    inStock: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod_006",
    name: "جاكيت جلد رجالي",
    description: "جاكيت جلد طبيعي 100% للرجال، تصميم عصري أنيق مع بطانة داخلية ناعمة. مثالي لإطلالة كاجوال متميزة.",
    price: 2200,
    originalPrice: 2800,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop&q=80",
    ],
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "أسود", hex: "#1A1A1A" },
      { name: "بني داكن", hex: "#3D1C02" },
    ],
    inStock: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with defaults on first run
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  // Dispatch custom event so all listeners update
  window.dispatchEvent(new CustomEvent("mido_products_updated"));
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const newProduct: Product = {
    ...product,
    id: "prod_" + generateId(),
    createdAt: new Date().toISOString(),
  };
  const products = getProducts();
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getProductById(id: string): Product | null {
  return getProducts().find((p) => p.id === id) || null;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const newOrder: Order = {
    ...order,
    id: "order_" + generateId(),
    createdAt: new Date().toISOString(),
  };
  const orders = getOrders();
  orders.unshift(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
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
