import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isInCart: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string) => void;
  onQuickView: (product: Product) => void;
  onDirectOrder?: (product: Product, color?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const { t } = useLanguage();
  const [selectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100/90 hover:border-slate-200 p-2.5 sm:p-3.5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
    >
      {/* Product Image Area with soft light background */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F8F9FA] p-3 sm:p-4 mb-3 flex items-center justify-center cursor-pointer"
      >
        <SafeImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Discount Tag) */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                product.badge.type === 'discount'
                  ? 'bg-[#00829B]'
                  : product.badge.type === 'new'
                  ? 'bg-[#083344]'
                  : 'bg-amber-600'
              }`}
            >
              {product.badge.text}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button (Top-Right) */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? t('উইশলিস্ট থেকে সরান', 'Remove from Wishlist') : t('উইশলিস্টে রাখুন', 'Add to Wishlist')}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xs z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white scale-105'
              : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-0 bg-[#083344]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="pointer-events-auto px-3 py-1.5 rounded-lg bg-white/95 text-[#083344] text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#00829B]" />
            <span>{t('কুইক ভিউ', 'Quick View')}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <button
            onClick={() => onQuickView(product)}
            className="text-left w-full focus:outline-none cursor-pointer"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#00829B] transition-colors">
              {product.name}
            </h3>
          </button>

          {/* Star Rating & Review Count (e.g. ★★★★★ (128)) */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price with strikethrough original price */}
          <div className="flex items-baseline gap-2 mt-2 mb-3">
            <span className="text-sm sm:text-base font-black text-[#083344]">
              {formatBDT(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-normal">
                {formatBDT(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Full-Width "Add to Cart" Button at Bottom of Card */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={() => onAddToCart(product, selectedColor)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
            isInCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-[#00829B] hover:bg-[#006D83] text-white'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t('কার্টে যুক্ত আছে', 'Added to Cart')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('কার্টে যোগ করুন', 'Add to Cart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
