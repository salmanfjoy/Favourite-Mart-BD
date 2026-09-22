import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Quote, 
  Users, 
  PackageCheck, 
  ThumbsUp, 
  Headphones, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { REVIEWS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsAndWhyShop: React.FC = () => {
  const { t } = useLanguage();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const stats = [
    {
      id: 'happy-customers',
      value: '50,000+',
      labelEn: 'Happy Customers',
      labelBn: 'সন্তুষ্ট গ্রাহক',
      descEn: 'Across all 64 districts',
      descBn: 'সারাদেশের ৬৪ জেলায়',
      icon: Users,
      color: 'text-sky-500 bg-sky-50',
    },
    {
      id: 'products-sold',
      value: '120,000+',
      labelEn: 'Products Sold',
      labelBn: 'পণ্য ডেলিভারি',
      descEn: 'Verified authentic orders',
      descBn: 'সফলভাবে সম্পন্ন অর্ডার',
      icon: PackageCheck,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 'positive-reviews',
      value: '99.4%',
      labelEn: 'Positive Reviews',
      labelBn: 'পজিটিভ রিভিউ',
      descEn: 'Rated 4.9 out of 5',
      descBn: '৪.৯ স্টার গড় রেটিং',
      icon: ThumbsUp,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      id: 'customer-support',
      value: '24/7',
      labelEn: 'Customer Support',
      labelBn: 'কাস্টমার সাপোর্ট',
      descEn: 'Always ready to help',
      descBn: 'সার্বক্ষণিক সেবা ও সহায়তা',
      icon: Headphones,
      color: 'text-[#00829B] bg-[#F0FDFA]',
    },
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const currentRev = REVIEWS[currentReviewIndex];

  return (
    <section id="testimonials-why-shop" className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#00829B]">
            {t('বিশ্বাস ও সন্তুষ্টি', 'TRUST & PROVEN RESULTS')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#083344] tracking-tight mt-1">
            {t('আমাদের গ্রাহকদের অভিজ্ঞতা ও অর্জন', 'Why Customers Love Shopping With Us')}
          </h2>
        </div>

        {/* Two Columns Layout: Side by Side on Desktop, Stacked Vertically on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Customer Testimonial Card */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex-1 flex flex-col justify-between relative overflow-hidden">
              
              {/* Background watermark quote icon */}
              <Quote className="w-24 h-24 text-slate-100 absolute -bottom-4 -right-4 pointer-events-none" />

              <div>
                {/* Header of Testimonial Card */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(currentRev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">5.0</span>
                  </div>

                  {/* Prev / Next controls */}
                  <div className="flex items-center gap-1.5 z-10">
                    <button
                      onClick={prevReview}
                      aria-label="Previous Testimonial"
                      className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextReview}
                      aria-label="Next Testimonial"
                      className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Quote */}
                <p className="text-slate-800 text-sm sm:text-base sm:leading-relaxed font-medium mb-6 relative z-10">
                  "{currentRev.comment}"
                </p>
              </div>

              {/* Author & Purchased Product footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={currentRev.avatar}
                    alt={currentRev.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900">
                        {currentRev.author}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t('ভেরিফাইড ক্রেতা', 'Verified Buyer')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentRev.location}
                    </p>
                  </div>
                </div>

                {/* Product Tag */}
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium max-w-[170px] truncate">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#00829B] flex-shrink-0" />
                  <span className="truncate">{currentRev.productName}</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: 4-Icon Stats Grid ("Why Shop With Us") */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-1">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.color} transition-transform group-hover:scale-105`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight block">
                        {stat.value}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                        {t(stat.labelBn, stat.labelEn)}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {t(stat.descBn, stat.descEn)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
