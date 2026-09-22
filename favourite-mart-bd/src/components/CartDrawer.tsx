import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Tag
} from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const { t } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'FAV100' || code === 'WELCOME100' || code === 'LUCKY100') {
      setDiscountAmount(100);
      setAppliedCode(code);
      setPromoError('');
    } else if (code === 'FAV15' || code === 'PROMO15' || code === 'LUCKY15%') {
      setDiscountAmount(Math.round(subtotal * 0.15));
      setAppliedCode(code);
      setPromoError('');
    } else if (code === 'LUCKY20%') {
      setDiscountAmount(Math.round(subtotal * 0.20));
      setAppliedCode(code);
      setPromoError('');
    } else if (code === 'LUCKY300') {
      setDiscountAmount(300);
      setAppliedCode(code);
      setPromoError('');
    } else {
      setPromoError(t('অকার্যকর কুপন কোড! FAV100 বা FAV15 দিয়ে চেষ্টা করুন।', 'Invalid voucher code! Try FAV100 or FAV15.'));
    }
  };

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
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00829B]" />
              <h2 className="font-extrabold text-[#083344] text-base sm:text-lg">
                {t('শপিং কার্ট', 'Shopping Cart')}
              </h2>
              <span className="text-xs bg-[#00829B] text-white font-black px-2 py-0.5 rounded-full">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="px-4 sm:px-5 py-3 bg-[#F0FDFA] border-b border-[#00829B]/15">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1 text-[#00829B]">
                  <Truck className="w-3.5 h-3.5" />
                  {isFreeShipping ? t('🎉 আপনি ফ্রি ডেলিভারি অফার পেয়েছেন!', '🎉 You unlocked Free Delivery!') : `${t('আর', 'Add')} ${formatBDT(freeShippingThreshold - subtotal)} ${t('শপিং করলেই ফ্রি ডেলিভারি', 'more for Free Shipping')}`}
                </span>
                <span className="text-[#083344] font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#00829B] h-1.5 rounded-full transition-all duration-300 shadow-primary-glow"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Drawer Body / Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#00829B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {t('আপনার কার্ট খালি আছে', 'Your shopping cart is empty')}
                </h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  {t(
                    'আমাদের বেস্ট সেলিং স্মার্টওয়াচ, হেডফোন ও প্রিমিয়াম গ্যাজেটগুলো এক্সপ্লোর করুন।',
                    'Explore our top-selling gadgets, accessories, and audio devices today.'
                  )}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t('শপিং শুরু করুন', 'Start Shopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-[#00829B]/30 transition-colors shadow-2xs"
                >
                  {/* Thumbnail */}
                  <SafeImage
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-slate-50 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          aria-label="Remove item"
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                        <span>{item.product.brand}</span>
                        {item.selectedColor && (
                          <span className="text-[#00829B] font-semibold bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                            {item.selectedColor}
                          </span>
                        )}
                        <span>• {formatBDT(item.product.price)}</span>
                      </p>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-extrabold text-[#00829B]">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
              
              {/* Promo code input */}
              {appliedCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    {t('কুপন', 'Voucher')} <strong>{appliedCode}</strong> {t('যোগ হয়েছে', 'Applied')} (-{formatBDT(discountAmount)})
                  </span>
                  <button
                    onClick={() => {
                      setAppliedCode(null);
                      setDiscountAmount(0);
                    }}
                    className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('কুপন কোড (যেমন: FAV100)', 'Voucher code (e.g. FAV100)')}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-medium placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-[#00829B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {t('প্রয়োগ', 'Apply')}
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>{t('সাবটোটাল', 'Subtotal')}</span>
                  <span className="font-semibold text-slate-900">{formatBDT(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{t('কুপন ডিসকাউন্ট', 'Discount')}</span>
                    <span>-{formatBDT(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('ডেলিভারি চার্জ', 'Delivery Charge')}</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-600">{t('ফ্রি', 'FREE')}</strong> : formatBDT(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('মোট প্রদেয়', 'Total Amount')}</span>
                  <span className="text-[#00829B]">{formatBDT(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#00829B] hover:bg-[#00A3C4] text-white font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-primary-glow cursor-pointer active:scale-98"
              >
                <span>{t('ক্যাশ অন ডেলিভারিতে অর্ডার করুন', 'Proceed to Checkout (COD)')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
