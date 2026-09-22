import React from 'react';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const BlogSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="blog" className="py-12 sm:py-16 bg-[#F8F9FA] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
              {t('লেটেস্ট ব্লগ ও গাইডস', 'LATEST FROM OUR BLOG')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {t('গ্যাজেট টিপস, রিভিউ এবং লাইফস্টাইল', 'Tips, Reviews & Lifestyle Guides')}
            </h2>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group text-xs sm:text-sm font-bold text-slate-700 hover:text-[#FF6B4A] flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{t('সব পোস্ট দেখুন', 'View All Posts')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Blog Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#FF6B4A] transition-colors line-clamp-2 mb-2">
                    {language === 'bn' ? post.titleBn : post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {language === 'bn' ? post.excerptBn : post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-slate-900 group-hover:text-[#FF6B4A] transition-colors">
                  <span>{t('সম্পূর্ণ পড়ুন', 'Read More')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
