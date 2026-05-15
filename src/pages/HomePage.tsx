import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product, CATEGORIES, ProductCategory } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/features/ProductCard";
import OrderModal from "@/components/features/OrderModal";
import heroBg from "@/assets/hero-bg.jpg";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("cat") as ProductCategory;
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Mido Store Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)" }} />
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px opacity-10" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
          <div className="absolute bottom-1/4 left-0 right-0 h-px opacity-10" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <p className="font-cairo text-gold-600 tracking-[0.4em] text-sm uppercase mb-4 animate-fade-in">
            ✦ الأناقة الحقيقية ✦
          </p>
          <h1 className="font-cormorant text-6xl md:text-8xl lg:text-9xl gold-text mb-4 text-shadow-gold animate-slide-up"
            style={{ fontStyle: "italic", fontWeight: 600 }}>
            Mido Store
          </h1>
          <p className="font-cairo text-cream-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto animate-fade-in opacity-90">
            اكتشف عالماً من الأزياء الراقية والفاشن الفاخر — حيث كل قطعة تحكي قصة تميّز
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-gold text-base px-10 py-3.5"
            >
              تسوق الآن
            </button>
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline-gold text-base px-8"
            >
              استعرض الكولكشن
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-gold-700 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-gold-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-obsidian-800 border-y border-gold-900 border-opacity-30 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
          {[
            { num: "+50", label: "منتج حصري" },
            { num: "3-5", label: "أيام توصيل" },
            { num: "100%", label: "جودة مضمونة" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 border-r border-obsidian-700 last:border-0">
              <div className="font-cormorant text-3xl gold-text font-bold">{stat.num}</div>
              <div className="font-cairo text-obsidian-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Section ── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">المنتجات المميزة</h2>
            <div className="gold-divider" />
            <p className="font-cairo text-obsidian-400 text-sm mt-2">تشكيلة حصرية مختارة بعناية لك</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOrderClick={setSelectedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* ── All Products Section ── */}
      <section id="products" className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">جميع المنتجات</h2>
          <div className="gold-divider" />
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="luxury-input pr-10 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-cream-DEFAULT">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`font-cairo text-sm px-5 py-2 rounded-sm border transition-all duration-200 min-h-[44px] ${
                  category === cat.value
                    ? "bg-gold-600 border-gold-500 text-obsidian-900 font-bold"
                    : "border-obsidian-600 text-obsidian-400 hover:border-gold-700 hover:text-gold-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card aspect-[4/5] shimmer-effect" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">🛍️</div>
            <p className="font-cairo text-obsidian-500 text-lg">لا توجد منتجات في هذا التصنيف</p>
          </div>
        ) : (
          <>
            <p className="font-cairo text-obsidian-500 text-sm mb-4 text-center">
              عرض {filteredProducts.length} منتج
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOrderClick={setSelectedProduct} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Why Mido ── */}
      <section className="py-16 bg-obsidian-800 border-y border-gold-900 border-opacity-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title mb-2">لماذا Mido Store؟</h2>
          <div className="gold-divider mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "👑", title: "جودة فاخرة", desc: "أرقى الخامات والتصاميم العالمية" },
              { icon: "🚚", title: "توصيل سريع", desc: "3-5 أيام عمل لجميع المحافظات" },
              { icon: "💎", title: "أسعار مميزة", desc: "أفضل الأسعار مع ضمان الجودة" },
              { icon: "✅", title: "ضمان الرضا", desc: "خدمة عملاء متميزة على مدار الساعة" },
            ].map((item) => (
              <div key={item.title} className="text-center p-5 glass-card rounded-sm hover:border-gold-600 transition-all duration-300 group"
                style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-cairo font-bold text-gold-500 text-base mb-1">{item.title}</h3>
                <p className="font-cairo text-obsidian-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
