import React from 'react';
import { 
  ArrowRight, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onShopCollection: () => void;
  onExploreDeals: () => void;
  onOpenLuckyWheel?: () => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onDirectOrder?: (product: Product) => void;
  onFilterBannerItems?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCollection,
  onExploreDeals,
}) => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#F0FDFA]/60 via-[#F8FAFC] to-white py-8 sm:py-14 lg:py-16 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-Column Grid on Desktop, Single Column (headline+buttons first, image below) on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: small tag label, large bold headline (2 lines), short description text, two buttons, 3 trust icons */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 text-left">
            
            {/* Small Tag Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDFA] border border-[#00829B]/30 text-[#00829B] text-xs font-black uppercase tracking-wider mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('নতুন কালেকশন ২০২৬', 'NEW COLLECTION 2026')}</span>
            </div>

            {/* Large Bold Headline (2 lines) */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#083344] tracking-tight leading-[1.15] mb-4 sm:mb-5">
              {t('অনলাইনে আবিষ্কার করুন', 'Discover The')}{' '}
              <span className="text-[#00829B] block sm:inline">{t('সেরা সব গ্যাজেট ও পণ্য', 'Best Products Online')}</span>
            </h1>

            {/* Short Description Text */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6 sm:mb-8 leading-relaxed">
              {t(
                'সেরা মানের গ্যাজেট, লাইফস্টাইল ও ডেইলি এসেনশিয়াল অবিশ্বাস্য সাশ্রয়ী মূল্যে। সারাদেশের জন্য ক্যাশ অন ডেলিভারি সুবিধা!',
                'Shop top-quality gadgets, lifestyle accessories, and daily essentials at unbeatable prices. Cash on delivery nationwide!'
              )}
            </p>

            {/* Two Buttons: One filled solid using accent color, one outline button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              <button
                id="hero-shop-now-btn"
                onClick={onShopCollection}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#00829B] hover:bg-[#006D83] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>{t('শপ নাও', 'Shop Now')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreDeals}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#00829B] text-slate-800 hover:text-[#00829B] font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>{t('অফার কালেকশন', 'Explore Collection')}</span>
              </button>
            </div>

            {/* Row of 3 Small Trust Icons: Free Shipping / Easy Returns / Secure Payment */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-slate-200/80 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {t('ফ্রি শিপিং', 'Free Shipping')}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t('১৫০০+ অর্ডারে', 'Orders ৳1500+')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {t('সহজ রিটার্ন', 'Easy Returns')}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t('৭ দিনের গ্যারান্টি', '7 Days Guarantee')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {t('নিরাপদ পেমেন্ট', 'Secure Payment')}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t('ক্যাশ অন ডেলিভারি', 'Cash On Delivery')}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: One large featured product image with a discount badge circle on top of it. */}
          {/* On mobile, this sits naturally below the text and buttons without overlapping floating images. */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center p-4">
              
              {/* Subtle Studio Backdrop Pedestal Glow in Teal Tint */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#00829B]/15 via-slate-100 to-white blur-2xl -z-10" />
              <div className="absolute bottom-6 w-4/5 h-16 bg-slate-200/60 rounded-full blur-xl -z-10" />

              {/* Pedestal Base */}
              <div className="absolute bottom-8 w-64 sm:w-72 h-16 rounded-full bg-gradient-to-b from-white to-slate-100 shadow-md border border-slate-200/60 -z-5" />

              {/* Discount Badge Circle on top of it */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#083344] text-white flex flex-col items-center justify-center shadow-xl z-20 border-2 border-[#00A3C4]/40">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">SAVE</span>
                <span className="text-xl sm:text-2xl font-black leading-none text-[#00A3C4]">30%</span>
              </div>

              {/* Large Featured Product Image */}
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
                alt="Featured Smart Watch"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
