import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, Flame, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface DealOfTheDayProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({
  onQuickView,
  onAddToCart,
  onDirectOrder,
}) => {
  const { t, language } = useLanguage();
  const dealProduct = PRODUCTS[7]; // Deep Tissue Muscle Massage Gun 6-Speed (or Ultra Max 2)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#083344] via-[#004F63] to-[#00829B] text-white p-6 sm:p-10 shadow-2xl border border-cyan-500/20">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#00829B]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Product visual preview */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md p-6 border border-white/20 flex items-center justify-center group">
                <SafeImage
                  src={dealProduct.image}
                  alt={dealProduct.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>৩১% অফ</span>
                </div>
              </div>
            </div>

            {/* Right: Deal Details & Timer */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
                <Zap className="w-3.5 h-3.5 fill-cyan-300" />
                <span>{t('আজকের মেগা ডিল অফার', 'Deal of the Day')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {dealProduct.name}
              </h3>

              <p className="text-cyan-100/80 text-xs sm:text-sm leading-relaxed max-w-xl">
                {dealProduct.description}
              </p>

              {/* Real-time Countdown Clocks */}
              <div className="pt-1">
                <span className="text-[11px] text-cyan-200 uppercase font-black tracking-wider block mb-2">
                  {t('অফারের বাকি সময়:', 'Special Offer Ends In:')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="bg-[#083344] border border-cyan-500/30 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-sm">
                    <span className="text-lg sm:text-xl font-black text-cyan-300 block leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-cyan-200 uppercase font-bold">{t('ঘণ্টা', 'Hours')}</span>
                  </div>
                  <span className="text-lg font-bold text-cyan-300">:</span>
                  <div className="bg-[#083344] border border-cyan-500/30 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-sm">
                    <span className="text-lg sm:text-xl font-black text-cyan-300 block leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-cyan-200 uppercase font-bold">{t('মিনিট', 'Mins')}</span>
                  </div>
                  <span className="text-lg font-bold text-cyan-300">:</span>
                  <div className="bg-[#083344] border border-cyan-500/30 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-sm animate-pulse">
                    <span className="text-lg sm:text-xl font-black text-amber-300 block leading-none">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-amber-200 uppercase font-bold">{t('সেকেন্ড', 'Secs')}</span>
                  </div>
                </div>
              </div>

              {/* Scarcity Bar */}
              <div className="space-y-1.5 max-w-md pt-1">
                <div className="flex justify-between text-xs font-bold text-cyan-100">
                  <span>{t('স্টক বাকি আছে:', 'Remaining Stock:')} <strong>{dealProduct.stockCount || 8} {t('টি', 'pcs')}</strong></span>
                  <span className="text-amber-300">{t('৮২% বুকড!', '82% Claimed!')}</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full w-[82%]" />
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ৳{dealProduct.price.toLocaleString()}
                  </span>
                  {dealProduct.originalPrice && (
                    <span className="text-sm sm:text-base text-cyan-200 line-through">
                      ৳{dealProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onDirectOrder(dealProduct)}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-cyan-50 text-[#083344] font-black text-sm shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-[#083344]" />
                  <span>{t('১-ক্লিকে এখনই অর্ডার করুন', 'Buy Now (Cash on Delivery)')}</span>
                </button>

                <button
                  onClick={() => onAddToCart(dealProduct)}
                  className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('কার্টে রাখুন', 'Add to Cart')}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
