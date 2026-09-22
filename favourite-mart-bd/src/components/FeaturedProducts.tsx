import React, { useState, useMemo } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedProductsProps {
  products: Product[];
  selectedCategory: string | null;
  wishlistIds: Set<string>;
  cartItemIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color?: string) => void;
  onQuickView: (product: Product) => void;
  onDirectOrder?: (product: Product, color?: string) => void;
  onClearCategory: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  selectedCategory,
  wishlistIds,
  cartItemIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onDirectOrder,
  onClearCategory,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const filterTabs = [
    { id: 'all', labelBn: 'সব প্রোডাক্ট', labelEn: 'All' },
    { id: 'audio', labelBn: 'অডিও ও বাডস', labelEn: 'Audio' },
    { id: 'watches', labelBn: 'স্মার্টওয়াচ', labelEn: 'Smartwatches' },
    { id: 'bags', labelBn: 'ব্যাগ ও ব্যাকপ্যাক', labelEn: 'Bags' },
    { id: 'fitness', labelBn: 'ফিটনেস ও স্পোর্টস', labelEn: 'Sports' },
    { id: 'gadgets', labelBn: 'গ্যাজেট ও এক্সেসরিজ', labelEn: 'Gadgets' },
    { id: 'home', labelBn: 'হোম ও লিভিং', labelEn: 'Home' },
    { id: 'beauty', labelBn: 'বিউটি কেয়ার', labelEn: 'Beauty' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category / Tab filter
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    } else if (activeTab !== 'all') {
      list = list.filter((p) => p.category === activeTab);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCategory, activeTab, sortBy]);

  return (
    <section id="featured-products" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching ShopCart template */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('জনপ্রিয় ও বেস্ট সেলিং প্রোডাক্টস', 'Best Selling Products')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('আমাদের সর্বাধিক বিক্রিত এবং সন্তুষ্ট গ্রাহকদের পছন্দের পণ্যসমূহ', 'Top-selling picks loved by our happy customers across the country')}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
              >
                <option value="popular">{t('জনপ্রিয়তা', 'Most Popular')}</option>
                <option value="price-low">{t('দাম: কম থেকে বেশি', 'Price: Low to High')}</option>
                <option value="price-high">{t('দাম: বেশি থেকে কম', 'Price: High to Low')}</option>
                <option value="rating">{t('সর্বোচ্চ রেটিং', 'Highest Rated')}</option>
              </select>
            </div>

            <button
              onClick={() => {
                onClearCategory();
                setActiveTab('all');
              }}
              className="group text-xs sm:text-sm font-bold text-[#083344] hover:text-[#00829B] flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t('সব পণ্য দেখুন', 'View All Products')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterTabs.map((tab) => {
            const isActive = !selectedCategory && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onClearCategory();
                  setActiveTab(tab.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#00829B] text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-[#F0FDFA] hover:text-[#00829B]'
                }`}
              >
                {language === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid: Exactly 2 columns on mobile, 3 on sm, 4 on md, 6 on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
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
        ) : (
          <div className="bg-slate-50 rounded-2xl p-10 text-center border border-slate-100">
            <p className="text-slate-500 text-sm font-semibold mb-3">
              {t('নির্বাচিত ফিল্টারে কোনো প্রোডাক্ট পাওয়া যায়নি।', 'No products found in this category.')}
            </p>
            <button
              onClick={() => {
                onClearCategory();
                setActiveTab('all');
              }}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {t('ফিল্টার রিসেট', 'Show All Products')}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
