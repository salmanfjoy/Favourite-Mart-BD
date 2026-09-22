import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Zap, CheckCircle2 } from 'lucide-react';
import { COMBO_BUNDLES } from '../data/mockData';
import { ComboBundle, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface ComboDealsProps {
  onAddComboToCart: (combo: ComboBundle) => void;
  onDirectOrderProduct: (product: Product) => void;
}

export const ComboDeals: React.FC<ComboDealsProps> = ({
  onAddComboToCart,
  onDirectOrderProduct,
}) => {
  const { t, language } = useLanguage();

  return (
    <section id="combo-deals" className="py-12 sm:py-16 bg-gradient-to-b from-[#F0FDFA] to-white relative overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00829B]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#00A3C4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00829B]/10 text-[#00829B] text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4 fill-[#00829B]" />
            <span>{t('মেগা সেভিংস অফার', 'Mega Savings Bundles')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#083344] tracking-tight">
            {t('জনপ্রিয় কম্বো প্যাকেজ সমূহ', 'Exclusive Super-Saver Combos')}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            {t(
              'একসাথে একাধিক পণ্য অর্ডার করে জিতে নিন বিশেষ ছাড় ও সারাদেশে ক্যাশ অন ফ্রি ডেলিভারি সুযোগ।',
              'Bundle together to save extra money and enjoy fast cash-on-delivery across Bangladesh.'
            )}
          </p>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {COMBO_BUNDLES.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group"
            >
              {/* Savings Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00829B] to-[#083344] text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                {combo.badge}
              </div>

              <div>
                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-black text-[#083344] pr-24 leading-snug">
                  {language === 'bn' ? combo.titleBn : combo.titleEn}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 mb-4">
                  {language === 'bn' ? combo.subtitleBn : combo.subtitleEn}
                </p>

                {/* Bundle Included Items Preview Strip */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100 mb-5">
                  {combo.items.map((item, idx) => (
                    <div 
                      key={item.id} 
                      onClick={() => onDirectOrderProduct(item)}
                      className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 hover:border-[#00829B]/40 hover:shadow-2xs transition-all cursor-pointer group/item"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-50 mb-1.5 p-1 flex items-center justify-center">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#083344] line-clamp-1 leading-tight">
                        {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-[#00829B] font-extrabold mt-0.5">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Order CTA */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {t('কম্বো প্যাকেজ মূল্য:', 'Combo Special Price:')}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-[#083344]">
                      ৳{combo.bundlePrice.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">
                      ৳{combo.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddComboToCart(combo)}
                  className="px-5 py-2.5 rounded-xl bg-[#00829B] hover:bg-[#006C82] text-white text-xs sm:text-sm font-bold shadow-primary-glow hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('কম্বোটি কার্টে নিন', 'Add Full Combo')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
