import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, #0a0a0a 70%)" }}>
      <Crown size={48} className="text-gold-700 mb-6 animate-float" />
      <h1 className="font-cormorant text-8xl gold-text font-bold mb-4" style={{ fontStyle: "italic" }}>404</h1>
      <h2 className="font-cairo font-bold text-cream-DEFAULT text-2xl mb-3">الصفحة غير موجودة</h2>
      <p className="font-cairo text-obsidian-400 text-base mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
      </p>
      <Link to="/" className="btn-gold">العودة للمتجر</Link>
    </div>
  );
}
