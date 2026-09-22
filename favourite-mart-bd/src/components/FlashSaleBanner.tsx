import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FlashSaleBannerProps {
  onShopSale: () => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ onShopSale }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 37,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="flash-sale" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Banner Card using our dark theme color (#083344) */}
        <div className="relative rounded-3xl bg-[#083344] text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden border border-[#00829B]/30">
          
          {/* Subtle Background Glow in teal */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00829B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#00A3C4]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
            
            {/* Left Column: Heading & Subtitle */}
            <div className="space-y-2 max-w-xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00829B]/20 text-[#00A3C4] text-xs font-bold uppercase tracking-wider border border-[#00829B]/40">
                <Flame className="w-3.5 h-3.5 text-[#00A3C4]" />
                <span>{t('সীমিত সময়ের অফার', 'Limited Time Offer')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {t('সুপার সেল - ৫০% পর্যন্ত ছাড়!', 'Super Sale Up To 50% Off!')}
              </h3>

              <p className="text-xs sm:text-sm text-cyan-100/70 leading-relaxed">
                {t(
                  'নির্বাচিত প্রিমিয়াম গ্যাজেট ও লাইফস্টাইল পণ্যে বিশেষ মূল্যছাড়। স্টক শেষ হওয়ার আগেই অর্ডার করুন।',
                  'On selected items. Shop now before the deal ends and stock runs out.'
                )}
              </p>
            </div>

            {/* Center & Right: Live Countdown Timer + CTA Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              
              {/* Live Countdown Timer Boxes */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900/60 border border-[#00829B]/30 shadow-inner">
                  <span className="text-lg sm:text-xl font-black text-white">{pad(timeLeft.days)}</span>
                  <span className="text-[10px] text-cyan-200/70 font-medium uppercase tracking-wider">{t('দিন', 'Days')}</span>
                </div>

                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900/60 border border-[#00829B]/30 shadow-inner">
                  <span className="text-lg sm:text-xl font-black text-white">{pad(timeLeft.hours)}</span>
                  <span className="text-[10px] text-cyan-200/70 font-medium uppercase tracking-wider">{t('ঘণ্টা', 'Hours')}</span>
                </div>

                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900/60 border border-[#00829B]/30 shadow-inner">
                  <span className="text-lg sm:text-xl font-black text-white">{pad(timeLeft.minutes)}</span>
                  <span className="text-[10px] text-cyan-200/70 font-medium uppercase tracking-wider">{t('মিনিট', 'Mins')}</span>
                </div>

                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900/60 border border-[#00A3C4]/50 shadow-inner">
                  <span className="text-lg sm:text-xl font-black text-[#00A3C4]">{pad(timeLeft.seconds)}</span>
                  <span className="text-[10px] text-cyan-200/70 font-medium uppercase tracking-wider">{t('সেকেন্ড', 'Secs')}</span>
                </div>
              </div>

              {/* "Shop The Sale" Button */}
              <button
                id="flash-sale-cta-btn"
                onClick={onShopSale}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00829B] hover:bg-[#006D83] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap group active:scale-98"
              >
                <span>{t('সেল থেকে কিনুন', 'Shop The Sale')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
