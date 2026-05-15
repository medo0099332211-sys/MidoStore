export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: ColorOption[];
  inStock: boolean;
  featured: boolean;
  badge?: string;
  createdAt: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  fullName: string;
  governorate: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  item: OrderItem;
  customer: CustomerInfo;
  createdAt: string;
  status: "pending" | "confirmed" | "delivered";
}

export type ProductCategory =
  | "all"
  | "men"
  | "women"
  | "kids"
  | "accessories"
  | "footwear";

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "men", label: "رجالي" },
  { value: "women", label: "نسائي" },
  { value: "kids", label: "أطفال" },
  { value: "accessories", label: "إكسسوارات" },
  { value: "footwear", label: "أحذية" },
];

export const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];
