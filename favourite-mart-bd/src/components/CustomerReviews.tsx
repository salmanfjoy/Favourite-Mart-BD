import React from 'react';
import { Star, CheckCircle2, Quote, ShoppingBag } from 'lucide-react';
import { REVIEWS, WHY_SHOP_STATS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const CustomerReviews: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-[#F8F9FA] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STATS ROW / "WHY SHOP WITH US" */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs">
          {WHY_SHOP_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center p-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                {language === 'bn' ? stat.labelBn : stat.label}
              </h4>
            </div>
          ))}
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('গ্রাহকদের সন্তুষ্টি ও রিভিউ', 'What Our Customers Say')}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            {t(
              'হাজারো গ্রাহক প্রতিদিন আমাদের পণ্যের গুণগত মান ও দ্রুত ডেলিভারির প্রশংসা করছেন',
              'Real reviews from real buyers who experienced our quality products and service'
            )}
          </p>
        </div>

        {/* Customer Reviews Cards Grid (Clean ShopCart style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-200 relative group"
            >
              <div>
                {/* 5 Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Quote */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author and Product Details */}
              <div className="pt-3.5 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {rev.author}
                      </p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    </div>
                    {/* Product Purchased Tag */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                      <ShoppingBag className="w-3 h-3 text-[#FF6B4A] flex-shrink-0" />
                      <span className="truncate">{rev.productName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
