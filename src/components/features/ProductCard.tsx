import { useState } from "react";
import { ShoppingBag, Star, Tag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product) => void;
}

export default function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card group cursor-pointer animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={imgError ? "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=750&fit=crop&q=80" : (product.images[0] || "")}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-card-gradient opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold font-cairo rounded-sm"
            style={{ background: "linear-gradient(135deg, #C9A84C, #F0D060)", color: "#0a0a0a" }}>
            {product.badge}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold font-cairo rounded-sm px-2 py-1">
            -{discount}%
          </div>
        )}

        {/* Overlay CTA */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onOrderClick(product); }}
            className="btn-gold w-full text-sm flex items-center justify-center gap-2 py-2.5"
          >
            <ShoppingBag size={16} />
            اطلب الآن
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-cairo font-bold text-cream-DEFAULT text-base leading-snug line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        <p className="text-obsidian-400 text-xs font-cairo line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Color dots */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color.hex}
              className="w-4 h-4 rounded-full border border-obsidian-600"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-obsidian-500 text-xs font-cairo">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gold-500 text-lg font-cairo">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-obsidian-500 text-sm line-through font-cairo">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => onOrderClick(product)}
            className="text-gold-600 hover:text-gold-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="اطلب المنتج"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
