import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FEATURED_BRANDS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const FeaturedBrands: React.FC = () => {
  const { t } = useLanguage();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Scroll arrows */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            {t('আমাদের অফিসিয়াল ও পার্টনার ব্র্যান্ডস', 'Our Featured Brands')}
          </h3>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Previous Brands"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Next Brands"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Brands Horizontal Scrolling Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 sm:gap-12 overflow-x-auto py-3 scrollbar-none snap-x"
        >
          {FEATURED_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-xl hover:bg-slate-50 transition-all cursor-default group"
            >
              <span className="text-lg sm:text-xl font-black tracking-widest text-slate-400 group-hover:text-slate-800 transition-colors uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
