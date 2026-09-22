import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  RotateCcw, 
  Headphones, 
  Globe,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AnnouncementBarProps {
  onShopClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const trustMessages = [
    {
      icon: Truck,
      color: 'text-emerald-400',
      en: 'Free Shipping on orders over ৳1000',
      bn: '১০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি',
    },
    {
      icon: RotateCcw,
      color: 'text-sky-400',
      en: 'Money-back Guarantee — 7-Day Easy Returns',
      bn: '১০০% মানিব্যাক গ্যারান্টি — ৭ দিনের রিটার্ন পলিসি',
    },
    {
      icon: Headphones,
      color: 'text-amber-400',
      en: '24/7 Dedicated Customer Support Hotline',
      bn: '২৪/৭ কাস্টমার সাপোর্ট ও হেল্পলাইন সেবা',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % trustMessages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [trustMessages.length]);

  const activeMsg = trustMessages[currentMessageIndex];
  const ActiveIcon = activeMsg.icon;

  return (
    <div className="bg-[#0F172A] text-slate-300 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        
        {/* Desktop View: Rotating Trust Highlight + Full Badges */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-2 transition-all duration-300">
            <ActiveIcon className={`w-3.5 h-3.5 ${activeMsg.color} flex-shrink-0 animate-pulse`} />
            <span className="font-semibold text-white">
              {language === 'bn' ? activeMsg.bn : activeMsg.en}
            </span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('১০০% অথেনটিক গ্যাজেটস', '100% Authentic Products')}</span>
            </span>
          </div>
        </div>

        {/* Mobile View: Rotating Trust Message in Center */}
        <div className="flex md:hidden items-center justify-center flex-1 text-[11px] font-medium text-slate-200">
          <div className="flex items-center gap-1.5 truncate">
            <ActiveIcon className={`w-3.5 h-3.5 ${activeMsg.color} flex-shrink-0`} />
            <span className="truncate font-medium">
              {language === 'bn' ? activeMsg.bn : activeMsg.en}
            </span>
          </div>
        </div>

        {/* Right: Language & Currency Selector */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-medium flex-shrink-0 ml-2">
          {/* Language Selector */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-slate-300"
            title="Switch English / বাংলা"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="font-semibold">{language === 'bn' ? 'বাংলা' : 'English'}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Currency Selector */}
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 font-semibold">
            <span>BDT (৳)</span>
          </span>
        </div>

      </div>
    </div>
  );
};
