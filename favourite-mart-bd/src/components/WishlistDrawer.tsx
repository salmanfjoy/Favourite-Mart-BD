import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onAddToCart,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#00829B] fill-[#00829B]" />
              <h2 className="font-extrabold text-[#083344] text-base sm:text-lg">
                {t('পছন্দের তালিকা', 'Wishlist')}
              </h2>
              <span className="text-xs bg-[#F0FDFA] text-[#00829B] font-black px-2 py-0.5 rounded-full border border-[#00829B]/20">
                {wishlist.length} {t('টি', 'items')}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist"
              className="p-1.5 text-slate-400 hover:text-[#083344] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body / Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#083344]">
                  {t('আপনার পছন্দের তালিকা খালি', 'Your Wishlist is Empty')}
                </h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  {t('পণ্য পছন্দ হলে হার্ট (Heart) আইকনে ট্যাপ করে এখানে সেভ করে রাখতে পারেন।', 'Tap the heart icon on any product card to save it for later.')}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {t('প্রোডাক্ট দেখুন', 'Explore Products')}
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-[#00829B]/30 transition-colors shadow-2xs"
                >
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-slate-50 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#083344] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveWishlist(product)}
                          aria-label="Remove from wishlist"
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#00829B] mt-0.5">
                        {formatBDT(product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="mt-2 w-full py-1.5 px-3 rounded-xl bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('কার্টে যোগ করুন', 'Add to Cart')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
