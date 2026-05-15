import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown, LogOut, Package, Plus, Pencil, Trash2, X, Check,
  Image, LayoutDashboard, ShoppingCart, Eye, AlertTriangle
} from "lucide-react";
import { Product, ColorOption } from "@/types";
import { addProduct, updateProduct, deleteProduct, adminLogout, isAdminLoggedIn } from "@/lib/storage";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";
import { formatPrice, generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/features/ImageUpload";

type AdminView = "overview" | "products" | "orders";

const SIZES_PRESETS = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  universal: ["One Size"],
};

const COLOR_PRESETS: ColorOption[] = [
  { name: "أسود", hex: "#1A1A1A" },
  { name: "أبيض", hex: "#F5F0E8" },
  { name: "رمادي", hex: "#7A7A7A" },
  { name: "كحلي", hex: "#1B2A4A" },
  { name: "بني", hex: "#5C3A1E" },
  { name: "أحمر", hex: "#8B0000" },
  { name: "ذهبي", hex: "#D4AF37" },
  { name: "وردي", hex: "#D4A0B0" },
  { name: "أزرق", hex: "#4A90D9" },
  { name: "أخضر", hex: "#3A7A4A" },
  { name: "بيج", hex: "#C8A882" },
  { name: "عسلي", hex: "#C68642" },
];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: ColorOption[];
  inStock: boolean;
  featured: boolean;
  badge: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  images: [],
  category: "men",
  sizes: ["M", "L"],
  colors: [{ name: "أسود", hex: "#1A1A1A" }],
  inStock: true,
  featured: false,
  badge: "",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customColor, setCustomColor] = useState({ name: "", hex: "#ffffff" });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin");
      return;
    }
    // Subscribe to Firebase real-time updates
    const apps = getApps();
    if (apps.length > 0) {
      const db = getDatabase(apps[0]);
      const productsRef = ref(db, "products");
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        setProducts(data ? Object.values(data) : []);
      });
      const ordersRef = ref(db, "orders");
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        setOrders(data ? Object.values(data) : []);
      });
    }
  }, [navigate]);

  const refreshProducts = () => {}; // Firebase real-time listener handles updates

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      images: product.images,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      featured: product.featured,
      badge: product.badge || "",
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) return;

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      images: formData.images,
      category: formData.category,
      sizes: formData.sizes,
      colors: formData.colors,
      inStock: formData.inStock,
      featured: formData.featured,
      badge: formData.badge || undefined,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setShowForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: ColorOption) => {
    setFormData((prev) => {
      const exists = prev.colors.some((c) => c.hex === color.hex);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter((c) => c.hex !== color.hex)
          : [...prev.colors, color],
      };
    });
  };

  const addCustomColor = () => {
    if (customColor.name && customColor.hex) {
      toggleColor(customColor);
      setCustomColor({ name: "", hex: "#ffffff" });
    }
  };

  const sidebarItems: { id: AdminView; icon: React.ReactNode; label: string }[] = [
    { id: "overview", icon: <LayoutDashboard size={18} />, label: "نظرة عامة" },
    { id: "products", icon: <Package size={18} />, label: "المنتجات" },
    { id: "orders", icon: <ShoppingCart size={18} />, label: "الطلبات" },
  ];

  return (
    <div className="min-h-screen bg-obsidian-900 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-60 bg-obsidian-800 border-l border-obsidian-700 flex flex-col fixed top-0 right-0 bottom-0 z-30">
        {/* Logo */}
        <div className="p-5 border-b border-obsidian-700">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-gold-500" />
            <span className="font-cormorant text-xl gold-text tracking-widest" style={{ fontStyle: "italic" }}>MIDO</span>
          </div>
          <p className="font-cairo text-obsidian-500 text-xs mt-0.5">لوحة الإدارة</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn("admin-sidebar-link w-full text-right", view === item.id && "active")}
            >
              {item.icon}
              <span className="font-cairo text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="p-3 border-t border-obsidian-700 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar-link w-full text-right flex items-center gap-3 px-4 py-3 rounded-sm"
          >
            <Eye size={18} />
            <span className="font-cairo text-sm">عرض المتجر</span>
          </a>
          <button
            onClick={handleLogout}
            className="admin-sidebar-link w-full text-right text-red-500 hover:bg-red-950 hover:text-red-400"
          >
            <LogOut size={18} />
            <span className="font-cairo text-sm">خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-60 min-h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-obsidian-800 border-b border-obsidian-700 px-6 py-4 flex items-center justify-between">
          <h1 className="font-cairo font-bold text-cream-DEFAULT text-lg">
            {sidebarItems.find((i) => i.id === view)?.label}
          </h1>
          {view === "products" && (
            <button onClick={openAddForm} className="btn-gold text-sm flex items-center gap-2 py-2 px-5">
              <Plus size={16} />
              إضافة منتج
            </button>
          )}
        </div>

        <div className="p-6">
          {/* ── Overview ── */}
          {view === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "إجمالي المنتجات", value: products.length, icon: <Package size={24} className="text-gold-500" />, color: "gold" },
                  { label: "المنتجات المميزة", value: products.filter((p) => p.featured).length, icon: <Crown size={24} className="text-yellow-400" />, color: "yellow" },
                  { label: "الطلبات المستلمة", value: orders.length, icon: <ShoppingCart size={24} className="text-green-400" />, color: "green" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      {stat.icon}
                      <span className="font-cormorant text-4xl gold-text font-bold">{stat.value}</span>
                    </div>
                    <p className="font-cairo text-obsidian-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-sm p-5">
                <h3 className="font-cairo font-bold text-gold-500 text-base mb-4">آخر المنتجات المضافة</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-obsidian-700 last:border-0">
                      <img
                        src={p.images[0] || ""}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded-sm bg-obsidian-700 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=80&h=100&fit=crop"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-cairo text-cream-DEFAULT text-sm font-semibold truncate">{p.name}</p>
                        <p className="font-cairo text-gold-600 text-xs">{formatPrice(p.price)}</p>
                      </div>
                      <span className={`text-xs font-cairo px-2 py-0.5 rounded-sm ${p.inStock ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                        {p.inStock ? "متاح" : "نفد"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Products ── */}
          {view === "products" && (
            <div>
              {saveSuccess && (
                <div className="flex items-center gap-2 bg-green-950 border border-green-700 rounded-sm p-3 mb-4 animate-fade-in">
                  <Check size={16} className="text-green-400" />
                  <p className="font-cairo text-green-400 text-sm">تم حفظ المنتج بنجاح وظهر على المتجر فوراً</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="glass-card rounded-sm overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.images[0] || ""}
                        alt={product.name}
                        className="w-full h-40 object-cover bg-obsidian-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=200&fit=crop"; }}
                      />
                      {product.badge && (
                        <span className="absolute top-2 right-2 text-xs font-cairo font-bold px-2 py-0.5 rounded-sm"
                          style={{ background: "linear-gradient(135deg, #C9A84C, #F0D060)", color: "#0a0a0a" }}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-cairo font-bold text-cream-DEFAULT text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gold-500 font-bold font-cairo">{formatPrice(product.price)}</span>
                        <span className={`text-xs font-cairo px-2 py-0.5 rounded-sm ${product.inStock ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                          {product.inStock ? "متاح" : "نفد"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="flex-1 btn-outline-gold text-xs py-2 flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <Pencil size={13} />
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="flex-1 border border-red-800 text-red-500 hover:bg-red-950 text-xs py-2 rounded-sm flex items-center justify-center gap-1.5 transition-colors min-h-[44px] font-cairo"
                        >
                          <Trash2 size={13} />
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20">
                  <Package size={48} className="text-obsidian-700 mx-auto mb-4" />
                  <p className="font-cairo text-obsidian-500 text-lg">لا توجد منتجات بعد</p>
                  <button onClick={openAddForm} className="btn-gold mt-4">أضف أول منتج</button>
                </div>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {view === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart size={48} className="text-obsidian-700 mx-auto mb-4" />
                  <p className="font-cairo text-obsidian-500 text-lg">لا توجد طلبات بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="glass-card rounded-sm p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-cairo font-bold text-cream-DEFAULT text-sm">{order.customer.fullName}</p>
                          <p className="font-cairo text-obsidian-400 text-xs">{order.customer.phone} | {order.customer.governorate}</p>
                        </div>
                        <span className="text-xs font-cairo px-3 py-1 rounded-sm bg-yellow-950 text-yellow-400">
                          قيد الانتظار
                        </span>
                      </div>
                      <div className="bg-obsidian-800 rounded-sm p-3 text-sm font-cairo text-obsidian-300">
                        <p>{order.item.productName} | {order.item.size} | {order.item.color} | ×{order.item.quantity}</p>
                        <p className="text-gold-500 font-bold mt-1">{formatPrice(order.item.price * order.item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className="modal-overlay z-50">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-card rounded-sm shadow-luxury animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-obsidian-700 sticky top-0 bg-obsidian-800 z-10">
              <h2 className="font-cairo font-bold text-gold-500 text-lg">
                {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-obsidian-400 hover:text-cream-DEFAULT p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">اسم المنتج *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="اسم المنتج" className="luxury-input" />
                </div>
                <div>
                  <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">السعر (جنيه) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0" className="luxury-input" dir="ltr" />
                </div>
                <div>
                  <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">السعر الأصلي (اختياري)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="0" className="luxury-input" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">وصف المنتج</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3} placeholder="أدخل وصف المنتج..." className="luxury-input resize-none" />
              </div>

              <div>
                <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">صور المنتج (حتى 4 صور)</label>
                <ImageUpload
                  images={formData.images}
                  onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  maxImages={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">التصنيف</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="luxury-select">
                    <option value="men">رجالي</option>
                    <option value="women">نسائي</option>
                    <option value="kids">أطفال</option>
                    <option value="accessories">إكسسوارات</option>
                    <option value="footwear">أحذية</option>
                  </select>
                </div>
                <div>
                  <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">شارة المنتج (اختياري)</label>
                  <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="مثال: جديد، الأكثر مبيعاً" className="luxury-input" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">المقاسات</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {[...SIZES_PRESETS.clothing, ...SIZES_PRESETS.shoes, ...SIZES_PRESETS.universal].filter((v, i, a) => a.indexOf(v) === i).map((size) => (
                      <button key={size} onClick={() => toggleSize(size)}
                        className={cn("size-btn", formData.sizes.includes(size) && "active")}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">الألوان</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLOR_PRESETS.map((color) => (
                    <button key={color.hex} onClick={() => toggleColor(color)} title={color.name}
                      className={cn("w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                        formData.colors.some((c) => c.hex === color.hex) ? "border-gold-500 scale-110" : "border-obsidian-600")}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                {/* Custom color */}
                <div className="flex items-center gap-2 mt-2">
                  <input type="color" value={customColor.hex} onChange={(e) => setCustomColor({ ...customColor, hex: e.target.value })}
                    className="w-10 h-10 rounded-sm border border-obsidian-600 cursor-pointer bg-transparent" />
                  <input type="text" value={customColor.name} onChange={(e) => setCustomColor({ ...customColor, name: e.target.value })}
                    placeholder="اسم اللون" className="luxury-input flex-1 text-sm py-2" />
                  <button onClick={addCustomColor} disabled={!customColor.name}
                    className="btn-outline-gold text-sm py-2 px-4 min-h-[44px] disabled:opacity-40">
                    إضافة
                  </button>
                </div>
                {/* Selected colors */}
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.colors.map((c) => (
                      <span key={c.hex} className="flex items-center gap-1.5 bg-obsidian-700 text-obsidian-300 text-xs font-cairo px-2 py-1 rounded-sm">
                        <span className="w-3 h-3 rounded-full border border-obsidian-500 inline-block" style={{ backgroundColor: c.hex }} />
                        {c.name}
                        <button onClick={() => toggleColor(c)} className="text-obsidian-500 hover:text-red-400 ml-1"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="font-cairo text-cream-300 text-sm">متاح في المخزن</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="font-cairo text-cream-300 text-sm">منتج مميز</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-outline-gold flex-1 text-sm py-2.5">إلغاء</button>
                <button onClick={handleSave} disabled={!formData.name || !formData.price}
                  className="btn-gold flex-1 text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-40">
                  <Check size={16} />
                  {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay z-50">
          <div className="glass-card rounded-sm p-6 max-w-sm w-full mx-4 animate-slide-up shadow-luxury">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-red-500" />
              <h3 className="font-cairo font-bold text-cream-DEFAULT text-lg">حذف المنتج</h3>
            </div>
            <p className="font-cairo text-obsidian-400 text-sm mb-5">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline-gold flex-1 text-sm py-2.5">إلغاء</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-cairo font-bold text-sm py-2.5 rounded-sm transition-colors min-h-[44px]">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
