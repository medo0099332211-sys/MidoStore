import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-cream-DEFAULT p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link text-sm">الرئيسية</Link>
            <Link to="/?cat=men" className="nav-link text-sm">رجالي</Link>
            <Link to="/?cat=women" className="nav-link text-sm">نسائي</Link>
            <Link to="/?cat=accessories" className="nav-link text-sm">إكسسوارات</Link>
            <Link to="/?cat=footwear" className="nav-link text-sm">أحذية</Link>
          </nav>

          {/* Logo — centered */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <div className="flex items-center gap-1.5">
              <Crown size={16} className="text-gold-500" />
              <span className="font-cormorant text-2xl md:text-3xl font-semibold gold-text tracking-widest">
                MIDO
              </span>
              <Crown size={16} className="text-gold-500" />
            </div>
            <span className="font-cairo text-[9px] text-gold-600 tracking-[0.3em] uppercase -mt-1">STORE</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              className="text-cream-300 hover:text-gold-500 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => navigate("/")}
              aria-label="بحث"
            >
              <Search size={18} />
            </button>
            <button
              className="hidden md:flex text-cream-300 hover:text-gold-500 transition-colors p-2 min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label="المتجر"
              onClick={() => navigate("/")}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-obsidian-700 pt-4 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {[
                { to: "/", label: "الرئيسية" },
                { to: "/?cat=men", label: "رجالي" },
                { to: "/?cat=women", label: "نسائي" },
                { to: "/?cat=accessories", label: "إكسسوارات" },
                { to: "/?cat=footwear", label: "أحذية" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="nav-link text-base px-2 py-2.5 border-b border-obsidian-800"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
