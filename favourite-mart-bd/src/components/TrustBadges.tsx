import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBadges: React.FC = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: ShieldCheck,
      titleBn: 'সিকিউর চেকআউট',
      titleEn: 'Secure Checkout',
      descBn: '১০০% নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি',
      descEn: '100% Protected Payment & COD',
    },
    {
      icon: RotateCcw,
      titleBn: 'সহজ রিটার্ন পলিসি',
      titleEn: 'Easy Returns',
      descBn: '৭ দিনের ঝামেলাহীন রিপ্লেসমেন্ট গ্যারান্টি',
      descEn: '7-Day Hassle-Free Returns',
    },
    {
      icon: Award,
      titleBn: 'কোয়ালিটি গ্যারান্টি',
      titleEn: 'Quality Guarantee',
      descBn: '১০০% অরিজিনাল ও পরীক্ষিত গ্যাজেটস',
      descEn: '100% Authentic Quality Tested',
    },
    {
      icon: Truck,
      titleBn: 'দ্রুত ডেলিভারি',
      titleEn: 'Fast Delivery',
      descBn: 'সারাদেশে হোম ডেলিভারি সেবা',
      descEn: 'Nationwide Doorstep Delivery',
    },
  ];

  return (
    <section id="trust-badges" className="py-6 sm:py-8 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-slate-100 hover:border-[#00829B]/30 transition-all duration-200 group shadow-2xs hover:shadow-xs"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-[#00829B] group-hover:scale-105 group-hover:bg-[#F0FDFA] transition-all duration-200 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-[#083344] tracking-tight truncate sm:whitespace-normal">
                    {t(badge.titleBn, badge.titleEn)}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-2">
                    {t(badge.descBn, badge.descEn)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
