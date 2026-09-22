import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface ShopByCategoryProps {
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();

  // Top 6 primary categories matching reference image (Electronics, Fashion, Home & Living, Beauty, Sports, Toys & Games)
  const displayCategories = [
    {
      id: 'cat-audio',
      slug: 'audio',
      name: 'Electronics',
      bnName: 'ইলেকট্রনিক্স',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cat-bags',
      slug: 'bags',
      name: 'Fashion',
      bnName: 'ফ্যাশন ও ব্যাগ',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cat-home',
      slug: 'home',
      name: 'Home & Living',
      bnName: 'হোম অ্যান্ড লিভিং',
      image: 'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cat-beauty',
      slug: 'beauty',
      name: 'Beauty',
      bnName: 'বিউটি কেয়ার',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cat-fitness',
      slug: 'fitness',
      name: 'Sports',
      bnName: 'স্পোর্টস ও ফিটনেস',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cat-toys',
      slug: 'toys',
      name: 'Toys & Games',
      bnName: 'খেলনা ও কিডস',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section id="categories" className="py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header: Title and "View All Categories →" */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {t('ক্যাটাগরি অনুযায়ী শপিং করুন', 'Shop By Category')}
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory(null)}
            className="group text-xs sm:text-sm font-bold text-[#083344] hover:text-[#00829B] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{selectedCategory ? t('সব প্রোডাক্ট দেখুন', 'View All Products') : t('সব ক্যাটাগরি', 'View All Categories')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Row: Horizontally scrollable on mobile, 6-col grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`flex-shrink-0 w-36 sm:w-auto snap-start flex flex-col items-center p-4 rounded-2xl transition-all duration-300 cursor-pointer group border text-center ${
                  isSelected
                    ? 'border-[#00829B] bg-[#F0FDFA] shadow-md ring-2 ring-[#00829B]/20'
                    : 'bg-[#F8F9FA] hover:bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                }`}
              >
                {/* Category Image Box - Circular and modern */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-2 mb-3 bg-white border border-slate-100 shadow-2xs group-hover:scale-105 group-hover:border-[#00829B]/40 transition-all duration-300 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#00829B] transition-colors truncate max-w-full">
                  {language === 'bn' ? cat.bnName : cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
