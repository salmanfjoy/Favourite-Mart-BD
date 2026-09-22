import React, { useState } from 'react';
import { Mail, CheckCircle2, Instagram, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NewsletterAndInstagram: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const instagramPosts = [
    {
      id: 'ig-1',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      likes: '1.4k',
      caption: 'Sony WH-1000XM5 wireless vibes',
    },
    {
      id: 'ig-2',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      likes: '2.1k',
      caption: 'Everyday elegance on your wrist',
    },
    {
      id: 'ig-3',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
      likes: '890',
      caption: 'Urban explorer waterproof backpack',
    },
    {
      id: 'ig-4',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      likes: '3.2k',
      caption: 'Style meets peak performance',
    },
    {
      id: 'ig-5',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
      likes: '1.1k',
      caption: 'Desk setup tech gear',
    },
    {
      id: 'ig-6',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80',
      likes: '945',
      caption: 'Minimal shades & outdoor gear',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section id="newsletter-instagram" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Columns Grid: Stacked vertically on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Newsletter Signup Box */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#083344] text-white relative overflow-hidden shadow-lg border border-[#00829B]/30">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00829B]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#00A3C4] mb-5 border border-white/10">
                <Mail className="w-5 h-5" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#00A3C4]">
                {t('নিউজলেটার ও অফার', 'NEWSLETTER & PROMOS')}
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 mb-3">
                {t('১৫% ছাড়ের জন্য সাবস্ক্রাইব করুন', 'Get 15% Off Your First Order')}
              </h3>

              <p className="text-xs sm:text-sm text-cyan-100/70 leading-relaxed mb-6">
                {t(
                  'আমাদের নিউজলেটারে যোগ দিয়ে এক্সক্লুসিভ ডিসকাউন্ট কুপন, ফ্ল্যাশ ডিল এবং নতুন পণ্যের আপডেট পান সবার আগে।',
                  'Join our community to get instant promo codes, flash sale alerts, and curated new gadget recommendations directly in your inbox.'
                )}
              </p>

              {isSubscribed ? (
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-white">
                      {t('অভিনন্দন! আপনি সাবস্ক্রাইব করেছেন।', 'Congratulations! You are subscribed.')}
                    </p>
                    <p className="mt-1 text-emerald-300">
                      {t('আপনার প্রমো কোড:', 'Your 15% Off Promo Code:')}{' '}
                      <strong className="font-mono bg-emerald-900/90 text-white px-2 py-0.5 rounded border border-emerald-400">
                        WELCOME15
                      </strong>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('আপনার ইমেইল এড্রেস লিখুন...', 'Enter your email address...')}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00829B]/40 focus:border-[#00829B] placeholder-slate-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#00829B] hover:bg-[#006D83] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{t('এখনই সাবস্ক্রাইব করুন', 'Subscribe Now')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-700/60 text-[11px] text-cyan-200/60 flex items-center justify-between">
              <span>{t('আমরা কোনো স্প্যাম পাঠাই না', 'No spam. Unsubscribe anytime.')}</span>
              <span className="font-semibold text-white">Favourite Mart BD</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Instagram Feed Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#F8F9FA] border border-slate-200/80">
            
            {/* Header with @handle and Follow Us button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t('ইনস্টাগ্রামে যুক্ত থাকুন', 'INSTAGRAM FEED')}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  @favouritemartbd
                </h4>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>{t('ফলো করুন', 'Follow Us')}</span>
              </a>
            </div>

            {/* Small Grid of 6 Instagram-Style Product Photos */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {instagramPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-2xs"
                >
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Overlay with Instagram Icon & Likes */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                    <Instagram className="w-5 h-5 mb-1 text-white" />
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 text-center sm:text-left mt-4">
              {t('ট্যাগ করুন #FavouriteMartBD এবং আমাদের অফিশিয়াল পেজে ফিচার্ড হন', 'Tag #FavouriteMartBD to be featured on our official channel')}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
