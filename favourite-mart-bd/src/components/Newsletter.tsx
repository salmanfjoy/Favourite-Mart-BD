import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Newsletter: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Icon & Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('নিউজলেটার সাইনআপ', 'STAY IN THE LOOP')}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {t(
            'নিউজলেটারে সাবস্ক্রাইব করুন এবং প্রথম অর্ডারে পান ১৫% ছাড়',
            'Subscribe to our newsletter and get 15% off your first order'
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8">
          {t(
            'নতুন পণ্যের আপডেট, এক্সক্লুসিভ ডিসকাউন্ট ভাউচার এবং ফ্ল্যাশ সেলের খবর সবার আগে আপনার ইনবক্সে পেতে যুক্ত থাকুন।',
            'Be the first to hear about new arrivals, flash discounts, and exclusive member-only promo codes.'
          )}
        </p>

        {/* Form or Success Banner */}
        {isSubscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-left text-xs sm:text-sm">
              <p className="font-bold">{t('ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।', 'Thank you for subscribing!')}</p>
              <p className="text-emerald-700 mt-0.5">
                {t('আপনার প্রোমোকোড:', 'Use coupon code:')} <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">WELCOME15</strong>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('আপনার ইমেইল অ্যাড্রেস লিখুন...', 'Enter your email address...')}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition-all bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-[#FF6B4A] text-white font-bold text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer shadow-xs active:scale-98"
            >
              {t('সাবস্ক্রাইব', 'Subscribe')}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
