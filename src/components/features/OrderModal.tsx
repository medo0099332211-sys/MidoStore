import { useState, useEffect } from "react";
import { X, ChevronDown, Check, ShoppingBag, Minus, Plus } from "lucide-react";
import { Product, CustomerInfo, GOVERNORATES } from "@/types";
import { formatPrice, generateId } from "@/lib/utils";
import { saveOrder } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
}

type ModalStep = "select" | "form" | "success";

const WHATSAPP_NUMBER = "201143304017";

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [step, setStep] = useState<ModalStep>("select");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CustomerInfo>({
    fullName: "",
    governorate: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  useEffect(() => {
    if (product) {
      setStep("select");
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]?.name || "");
      setQuantity(1);
      setImgError(false);
    }
  }, [product]);

  if (!product) return null;

  const validate = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!form.fullName.trim()) newErrors.fullName = "الاسم مطلوب";
    if (!form.governorate) newErrors.governorate = "المحافظة مطلوبة";
    if (!form.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\s\-]{10,15}$/.test(form.phone.trim())) newErrors.phone = "رقم هاتف غير صحيح";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppMessage = (): string => {
    const lines = [
      "🛍️ *طلب جديد من Mido Store*",
      "━━━━━━━━━━━━━━━━━━",
      `📦 *المنتج:* ${product.name}`,
      `💰 *السعر:* ${formatPrice(product.price * quantity)}`,
      `📐 *المقاس:* ${selectedSize}`,
      `🎨 *اللون:* ${selectedColor}`,
      `🔢 *الكمية:* ${quantity}`,
      "━━━━━━━━━━━━━━━━━━",
      `👤 *اسم العميل:* ${form.fullName}`,
      `🏙️ *المحافظة:* ${form.governorate}`,
      `📍 *العنوان:* ${form.address}`,
      `📞 *رقم الهاتف:* ${form.phone}`,
      "━━━━━━━━━━━━━━━━━━",
      `💵 *الإجمالي:* ${formatPrice(product.price * quantity)}`,
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const handleConfirm = () => {
    if (!validate()) return;
    setSubmitting(true);

    // Save order
    saveOrder({
      item: {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] || "",
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: product.price,
      },
      customer: form,
      status: "pending",
    });

    // Open WhatsApp
    const msg = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(waUrl, "_blank");

    setTimeout(() => {
      setSubmitting(false);
      setStep("success");
    }, 800);
  };

  const handleClose = () => {
    setStep("select");
    setForm({ fullName: "", governorate: "", address: "", phone: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-card rounded-sm shadow-luxury animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-obsidian-700">
          <h2 className="font-cairo font-bold text-gold-500 text-lg">
            {step === "select" && "اختر المواصفات"}
            {step === "form" && "بيانات التوصيل"}
            {step === "success" && "تم الطلب!"}
          </h2>
          <button
            onClick={handleClose}
            className="text-obsidian-400 hover:text-cream-DEFAULT transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Step 1: Product Selection ── */}
        {step === "select" && (
          <div className="p-5 space-y-5">
            {/* Product summary */}
            <div className="flex gap-4">
              <img
                src={imgError ? "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=250&fit=crop" : product.images[0]}
                alt={product.name}
                className="w-24 h-30 object-cover rounded-sm flex-shrink-0"
                style={{ height: "120px" }}
                onError={() => setImgError(true)}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-cairo font-bold text-cream-DEFAULT text-base leading-snug mb-1">{product.name}</h3>
                <p className="text-obsidian-400 text-xs font-cairo line-clamp-2 mb-2">{product.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gold-500 font-bold font-cairo text-lg">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-obsidian-500 text-sm line-through font-cairo">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">
                المقاس <span className="text-gold-600 text-xs">({selectedSize})</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn("size-btn", selectedSize === size && "active")}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">
                اللون <span className="text-gold-600 text-xs">({selectedColor})</span>
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn("color-btn", selectedColor === color.name && "active")}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <p className="text-obsidian-500 text-xs font-cairo mt-1">{selectedColor}</p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-2">الكمية</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-obsidian-600 text-cream-DEFAULT hover:border-gold-500 hover:text-gold-500 transition-colors rounded-sm"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-cairo font-bold text-cream-DEFAULT text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-obsidian-600 text-cream-DEFAULT hover:border-gold-500 hover:text-gold-500 transition-colors rounded-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-obsidian-800 border border-obsidian-700 rounded-sm p-3 flex items-center justify-between">
              <span className="font-cairo text-obsidian-400 text-sm">الإجمالي</span>
              <span className="font-cairo font-bold text-gold-500 text-xl">{formatPrice(product.price * quantity)}</span>
            </div>

            <button
              onClick={() => setStep("form")}
              disabled={!selectedSize || !selectedColor}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              متابعة الطلب
            </button>
          </div>
        )}

        {/* ── Step 2: Customer Form ── */}
        {step === "form" && (
          <div className="p-5 space-y-4">
            <div className="glass-card rounded-sm p-3 mb-2">
              <p className="text-obsidian-400 text-xs font-cairo">
                {product.name} | {selectedSize} | {selectedColor} | الكمية: {quantity}
              </p>
              <p className="text-gold-500 font-bold font-cairo">{formatPrice(product.price * quantity)}</p>
            </div>

            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">الاسم الكامل *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
                placeholder="أدخل اسمك الكامل"
                className={cn("luxury-input", errors.fullName && "border-red-600")}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1 font-cairo">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">المحافظة *</label>
              <select
                value={form.governorate}
                onChange={(e) => { setForm({ ...form, governorate: e.target.value }); setErrors({ ...errors, governorate: "" }); }}
                className={cn("luxury-select", errors.governorate && "border-red-600")}
              >
                <option value="">اختر محافظتك</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {errors.governorate && <p className="text-red-500 text-xs mt-1 font-cairo">{errors.governorate}</p>}
            </div>

            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">العنوان التفصيلي *</label>
              <textarea
                value={form.address}
                onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
                placeholder="الشارع، رقم المبنى، الشقة..."
                rows={3}
                className={cn("luxury-input resize-none", errors.address && "border-red-600")}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1 font-cairo">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-cairo font-semibold text-cream-300 text-sm mb-1.5">رقم الهاتف *</label>
              <input
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                placeholder="01XXXXXXXXX"
                className={cn("luxury-input text-left", errors.phone && "border-red-600")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-cairo">{errors.phone}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("select")}
                className="btn-outline-gold flex-1 text-sm"
              >
                رجوع
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-gold flex-2 flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {submitting ? (
                  <span className="font-cairo">جاري الإرسال...</span>
                ) : (
                  <>تأكيد الطلب عبر واتساب</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Success ── */}
        {step === "success" && (
          <div className="p-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-pulse-gold"
              style={{ background: "rgba(212,175,55,0.15)", border: "2px solid #D4AF37" }}>
              <Check size={36} className="text-gold-500" />
            </div>
            <div>
              <h3 className="font-cairo font-bold text-2xl text-gold-500 mb-3">تم تنفيذ طلبك!</h3>
              <p className="font-cairo text-cream-300 text-base leading-relaxed bg-obsidian-800 border border-gold-800 rounded-sm p-4" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
                تم تنفيذ طلبك بنجاح، سيتم التوصيل خلال 3 إلى 5 أيام عمل.
              </p>
            </div>
            <p className="font-cairo text-obsidian-400 text-sm">
              تم فتح واتساب لإرسال تفاصيل طلبك. يرجى إرسال الرسالة لإتمام الطلب.
            </p>
            <button onClick={handleClose} className="btn-gold w-full">
              العودة للمتجر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
