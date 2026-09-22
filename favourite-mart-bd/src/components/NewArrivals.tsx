import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NewArrivalsProps {
  products: Product[];
  wishlistIds: Set<string>;
  cartItemIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string) => void;
  onQuickView: (product: Product) => void;
  onDirectOrder?: (product: Product, color?: string) => void;
  onViewAllNew: () => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  wishlistIds,
  cartItemIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onDirectOrder,
  onViewAllNew,
}) => {
  const { t } = useLanguage();
  // Pick items marked with isNew or new arrivals
  const newArrivalsList = products.filter((p) => p.isNew || p.badge?.type === 'new').slice(0, 4);

  return (
    <section id="new-arrivals" className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00829B] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {t('লেটেস্ট সংযোজন', 'Latest Drops')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#083344] tracking-tight mt-1">
              {t('নতুন কালেকশন ২০২৬', 'New Arrivals 2026')}
            </h2>
          </div>

          <button
            onClick={onViewAllNew}
            className="group text-xs sm:text-sm font-bold text-[#00829B] hover:text-[#006C82] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t('সব নতুন প্রোডাক্ট', 'View All New')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Item Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivalsList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              isInCart={cartItemIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onDirectOrder={onDirectOrder}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
