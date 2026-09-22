import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onDirectOrder?: (product: Product, quantity: number, selectedColor?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onDirectOrder,
}) => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.image;
  const colors = product.colors || ['#00829B', '#083344'];
  const activeColor = selectedColor || colors[0];
  const discountSavings = product.originalPrice ? product.originalPrice - product.price : 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, activeColor);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleDirectOrder = () => {
    if (onDirectOrder) {
      onDirectOrder(product, quantity, activeColor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative transform rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-3xl border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-white/90 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 flex-1">
          
          {/* Left: Product Images */}
          <div className="p-4 sm:p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-3 flex items-center justify-center">
              <SafeImage
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            {product.secondaryImage && (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-white cursor-pointer ${
                    currentImage === product.image ? 'border-[#00829B]' : 'border-transparent opacity-70'
                  }`}
                >
                  <SafeImage src={product.image} alt="Thumb 1" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setSelectedImage(product.secondaryImage!)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-white cursor-pointer ${
                    currentImage === product.secondaryImage ? 'border-[#00829B]' : 'border-transparent opacity-70'
                  }`}
                >
                  <SafeImage src={product.secondaryImage} alt="Thumb 2" className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Info, Price, Color, Quantity, Actions */}
          <div className="p-4 sm:p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00829B]">
                  {product.brand} • {product.categoryLabel}
                </span>
                {product.badge && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#083344] text-white">
                    {product.badge.text}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-2xl font-black text-[#083344] mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} {t('রিভিউ', 'reviews')})</span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
                  {t('স্টকে আছে', 'In Stock')}
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-black text-[#00829B]">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
                {discountSavings > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {t('সাশ্রয়', 'Save')} {formatBDT(discountSavings)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {product.description}
              </p>

              {/* Feature bullets */}
              {product.features && (
                <div className="mt-3 space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                  {product.features.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#083344]">
                      <Check className="w-3.5 h-3.5 text-[#00829B] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Color Swatches */}
              {colors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#083344] mb-1.5">
                    {t('কালার / ফিনিশ সিলেক্ট করুন', 'Select Color / Variant')}
                  </p>
                  <div className="flex items-center gap-2">
                    {colors.map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                          activeColor === hex
                            ? 'border-[#00829B] ring-2 ring-[#00829B]/30 scale-110 shadow-xs'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                      >
                        {activeColor === hex && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              
              <div className="flex items-center gap-2">
                {/* Quantity selector */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-[#F8FAFC]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#083344] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#083344] hover:bg-[#00829B] text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('কার্টে যোগ হয়েছে!', 'Added to Cart!')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('কার্টে যোগ করুন', 'Add to Cart')}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`p-2.5 rounded-xl border border-slate-200 hover:bg-[#F0FDFA] transition-colors cursor-pointer ${
                    isWishlisted ? 'text-[#00829B] bg-[#F0FDFA] border-[#00829B]/30' : 'text-slate-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#00829B]' : ''}`} />
                </button>
              </div>

              {/* Direct Cash on Delivery Order Button */}
              <button
                onClick={handleDirectOrder}
                className="w-full py-3 rounded-xl bg-[#00829B] hover:bg-[#00A3C4] text-white font-black text-xs sm:text-sm shadow-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>{t('সরাসরি ক্যাশ অন ডেলিভারিতে অর্ডার করুন — ', 'Buy Now with Cash on Delivery — ')}{formatBDT(product.price * quantity)}</span>
              </button>

              {/* Trust mini banner */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#00829B]" /> {t('হোম ডেলিভারি', 'Home Delivery')}</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t('১০০% আসল প্রডাক্ট', '100% Original')}</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5 text-[#00829B]" /> {t('৭ দিনের রিটার্ন', '7 Days Return')}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
