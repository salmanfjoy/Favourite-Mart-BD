import React from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface FeaturedCollectionsProps {
  onSelectCollection: (categorySlug: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  onSelectCollection,
}) => {
  const { t } = useLanguage();

  return (
    <section id="collections" className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00829B] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {t('স্পেশাল সিলেকশন', 'Special Selection')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#083344] tracking-tight mt-1">
              {t('ফিচারড কালেকশন ২০২৬', 'Featured Collections 2026')}
            </h2>
          </div>

          <button
            onClick={() => onSelectCollection('bags')}
            className="group text-xs sm:text-sm font-bold text-[#00829B] hover:text-[#006C82] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t('সব কালেকশন দেখুন', 'Explore All')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Two Large Side-by-Side Editorial Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          
          {/* Tile 1: Tech Essentials */}
          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] bg-[#083344] group shadow-lg border border-slate-100 flex flex-col justify-end p-5 sm:p-8">
            <SafeImage
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
              alt="Tech Essentials Desk and Gear"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#083344]/95 via-[#083344]/50 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-200 text-xs font-bold tracking-wider border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                {t('ওয়ার্কস্পেস ও গেমিং সেটআপ', 'Workspace & Gaming Setup')}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('টেক ও মেকানিক্যাল গিয়ার', 'Tech & Mechanical Gear')}
              </h3>
              
              <p className="text-slate-200 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
                {t(
                  'আরজিবি মেকানিক্যাল কিবোর্ড, হাই-কোয়ালিটি নয়েজ ক্যানসেলিং হেডফোন এবং স্মার্ট ডেস্ক অ্যাক্সেসরিজ।',
                  'RGB mechanical keyboards, high fidelity ANC headphones, and minimal desk accessories.'
                )}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onSelectCollection('gaming')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F0FDFA] hover:text-[#00829B] text-[#083344] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group/btn"
                >
                  <span>{t('কালেকশন এক্সপ্লোর করুন', 'Shop Tech Gear')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Tile 2: Travel Collection */}
          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] bg-[#083344] group shadow-lg border border-slate-100 flex flex-col justify-end p-5 sm:p-8">
            <SafeImage
              src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1000&q=80"
              alt="Travel & Luggage Essentials"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#083344]/95 via-[#083344]/50 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-200 text-xs font-bold tracking-wider border border-white/30">
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                {t('ট্যুর ও ট্রাভেল কালেকশন', 'Tour & Travel Edition')}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('লাগেজ ও ট্রাভেল ব্যাগ', 'Luggage & Commuter Bags')}
              </h3>

              <p className="text-slate-200 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
                {t(
                  'ভাঙন-রোধী জার্মান পলিকার্বনেট লাগেজ, ওয়াটারপ্রুফ ট্রাভেল ব্যাকপ্যাক ও স্লিম আরএফআইডি ওয়ালেট।',
                  'Unbreakable polycarbonate luggage, waterproof travel backpacks, and slim RFID wallets.'
                )}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onSelectCollection('travel')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F0FDFA] hover:text-[#00829B] text-[#083344] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group/btn"
                >
                  <span>{t('কালেকশন এক্সপ্লোর করুন', 'Shop Travel Bags')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
