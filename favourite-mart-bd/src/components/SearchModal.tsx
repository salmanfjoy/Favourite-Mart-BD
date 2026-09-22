import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const popularSearches = ['স্মার্টওয়াচ', 'হেডফোন', 'ব্যাকপ্যাক', 'কিবোর্ড', 'ওয়ালেট', 'পাওয়ার ব্যাংক', 'Sony', 'Anker'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Search Header Input */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-[#00829B]" />
          <input
            type="text"
            autoFocus
            placeholder={t('প্রোডাক্ট খুঁজুন (যেমন: হেডফোন, ঘড়ি, ব্যাগ, কীবোর্ড)...', 'Search products, brands, or categories...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[#083344] placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-[#083344] bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search Suggestions if empty */}
        {!query.trim() && (
          <div className="p-5 space-y-4 text-left">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00829B]" /> {t('জনপ্রিয় সার্চসমূহ', 'Popular Searches')}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F0FDFA] hover:text-[#00829B] text-xs font-semibold text-[#083344] border border-slate-100 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {t('ট্রেন্ডিং গ্যাজেট', 'Trending Products')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {products.slice(0, 4).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F0FDFA] text-left transition-colors group cursor-pointer"
                  >
                    <SafeImage src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#083344] truncate group-hover:text-[#00829B]">{prod.name}</p>
                      <p className="text-[11px] text-[#00829B] font-bold">{formatBDT(prod.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {query.trim() && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-2 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              "{query}" {t(`দিয়ে ${results.length}টি প্রোডাক্ট পাওয়া গেছে`, `matched ${results.length} results`)}
            </p>
            {results.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                {t('কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি। অন্য কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।', 'No products found. Please try different keywords.')}
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F0FDFA] transition-colors group border border-transparent hover:border-[#00829B]/20"
                >
                  <div 
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-[#F8FAFC] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#083344] truncate group-hover:text-[#00829B]">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-medium">{product.brand}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-extrabold text-[#00829B]">{formatBDT(product.price)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-3 py-1.5 rounded-xl bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0 ml-2 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('কার্টে নিন', 'Add')}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
