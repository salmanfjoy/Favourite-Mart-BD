import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './SafeImage';

interface BuyerProfile {
  nameBn: string;
  nameEn: string;
  locBn: string;
  locEn: string;
}

const BANGLADESHI_BUYERS: BuyerProfile[] = [
  { nameBn: 'তানভীর আহমেদ', nameEn: 'Tanvir Ahmed', locBn: 'ধানমন্ডি, ঢাকা', locEn: 'Dhanmondi, Dhaka' },
  { nameBn: 'নুসরাত জাহান', nameEn: 'Nusrat Jahan', locBn: 'মিরপুর-১০, ঢাকা', locEn: 'Mirpur-10, Dhaka' },
  { nameBn: 'রাকিবুল হাসান', nameEn: 'Rakibul Hasan', locBn: 'জিইসি মোড়, চট্টগ্রাম', locEn: 'GEC Circle, Chittagong' },
  { nameBn: 'সুমাইয়া আক্তার', nameEn: 'Sumaiya Akter', locBn: 'উত্তরা সেক্টর ৭, ঢাকা', locEn: 'Uttara Sector 7, Dhaka' },
  { nameBn: 'মাহমুদুল হক', nameEn: 'Mahmudul Haque', locBn: 'কান্দিরপাড়, কুমিল্লা', locEn: 'Kandirpar, Cumilla' },
  { nameBn: 'জান্নাতুল ফেরদৌস', nameEn: 'Jannatul Ferdous', locBn: 'গুলশান-২, ঢাকা', locEn: 'Gulshan-2, Dhaka' },
  { nameBn: 'ফারহান কবির', nameEn: 'Farhan Kabir', locBn: 'বনানী, ঢাকা', locEn: 'Banani, Dhaka' },
  { nameBn: 'সাদিয়া ইসলাম', nameEn: 'Sadia Islam', locBn: 'শিববাড়ি মোড়, খুলনা', locEn: 'Shibbari, Khulna' },
  { nameBn: 'আশিকুর রহমান', nameEn: 'Ashiqur Rahman', locBn: 'চাষাঢ়া, নারায়ণগঞ্জ', locEn: 'Chashara, Narayanganj' },
  { nameBn: 'তাহমিনা বেগম', nameEn: 'Tahmina Begum', locBn: 'জয়দেবপুর, গাজীপুর', locEn: 'Joydebpur, Gazipur' },
  { nameBn: 'আরিফ হোসেন', nameEn: 'Arif Hossain', locBn: 'আগ্রাবাদ, চট্টগ্রাম', locEn: 'Agrabad, Chittagong' },
  { nameBn: 'ফারজানা ইয়াসমিন', nameEn: 'Farzana Yeasmin', locBn: 'মোহাম্মদপুর, ঢাকা', locEn: 'Mohammadpur, Dhaka' },
  { nameBn: 'ইমরান হোসেন', nameEn: 'Imran Hossain', locBn: 'বসুন্ধরা আ/এ, ঢাকা', locEn: 'Bashundhara R/A, Dhaka' },
  { nameBn: 'রুমানা চৌধুরী', nameEn: 'Rumana Chowdhury', locBn: 'জিন্দাবাজার, সিলেট', locEn: 'Zindabazar, Sylhet' },
  { nameBn: 'মেহেদী হাসান', nameEn: 'Mehedi Hasan', locBn: 'সাহেব বাজার, রাজশাহী', locEn: 'Shaheb Bazar, Rajshahi' },
  { nameBn: 'সাবিনা ইয়াসমিন', nameEn: 'Sabina Yasmin', locBn: 'ময়মনসিংহ সদর', locEn: 'Mymensingh Town' },
  { nameBn: 'শাকিল খান', nameEn: 'Shakil Khan', locBn: 'বগুড়া সদর', locEn: 'Bogura Sadar' },
  { nameBn: 'নাজমুন নাহার', nameEn: 'Nazmun Nahar', locBn: 'বরিশাল সদর', locEn: 'Barisal Sadar' },
  { nameBn: 'কাজী নোমান', nameEn: 'Kazi Noman', locBn: 'বাড্ডা, ঢাকা', locEn: 'Badda, Dhaka' },
  { nameBn: 'শারমিন সুলতানা', nameEn: 'Sharmin Sultana', locBn: 'ফেনী সদর', locEn: 'Feni Sadar' },
  { nameBn: 'জাহিদ হাসান', nameEn: 'Zahid Hasan', locBn: 'কুষ্টিয়া শহর', locEn: 'Kushtia Town' },
  { nameBn: 'আফসানা মিমি', nameEn: 'Afsana Mimi', locBn: 'টাঙ্গাইল সদর', locEn: 'Tangail Sadar' },
  { nameBn: 'তরিকুল ইসলাম', nameEn: 'Tariqul Islam', locBn: 'নরসিংদী', locEn: 'Narsingdi' },
  { nameBn: 'ইশরাত জাহান', nameEn: 'Ishrat Jahan', locBn: 'ব্রাহ্মণবাড়িয়া', locEn: 'Brahmanbaria' },
  { nameBn: 'সাইফুল ইসলাম', nameEn: 'Saiful Islam', locBn: 'যশোর সদর', locEn: 'Jessore Sadar' },
  { nameBn: 'ফাহিম মুনতাসির', nameEn: 'Fahim Montasir', locBn: 'খিলগাঁও, ঢাকা', locEn: 'Khilgaon, Dhaka' },
];

const TIME_INTERVALS = [
  { bn: '১ মিনিট আগে', en: '1 min ago' },
  { bn: '২ মিনিট আগে', en: '2 mins ago' },
  { bn: '৩ মিনিট আগে', en: '3 mins ago' },
  { bn: '৫ মিনিট আগে', en: '5 mins ago' },
  { bn: '৭ মিনিট আগে', en: '7 mins ago' },
  { bn: '৯ মিনিট আগে', en: '9 mins ago' },
  { bn: '১২ মিনিট আগে', en: '12 mins ago' },
];

export const LiveSalesToast: React.FC = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [buyerIndex, setBuyerIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);
  const recentQueueRef = useRef<number[]>([]);

  // Function to pick a non-repeating buyer index
  const pickNextIndices = () => {
    let nextBuyer: number;
    do {
      nextBuyer = Math.floor(Math.random() * BANGLADESHI_BUYERS.length);
    } while (
      recentQueueRef.current.includes(nextBuyer) &&
      BANGLADESHI_BUYERS.length > 5
    );

    // Keep last 8 shown buyers in memory to prevent near-term repeats
    recentQueueRef.current.push(nextBuyer);
    if (recentQueueRef.current.length > 8) {
      recentQueueRef.current.shift();
    }

    const nextProduct = Math.floor(Math.random() * PRODUCTS.length);
    const nextTime = Math.floor(Math.random() * TIME_INTERVALS.length);

    setBuyerIndex(nextBuyer);
    setProductIndex(nextProduct);
    setTimeIndex(nextTime);
  };

  useEffect(() => {
    if (dismissed) return;

    // Pick first notification
    pickNextIndices();

    // Show initial notification after 5 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    // Auto rotate every 15-18 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        pickNextIndices();
        setVisible(true);
      }, 1200);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (!visible || dismissed) return null;

  const currentBuyer = BANGLADESHI_BUYERS[buyerIndex] || BANGLADESHI_BUYERS[0];
  const currentProduct = PRODUCTS[productIndex] || PRODUCTS[0];
  const currentTime = TIME_INTERVALS[timeIndex] || TIME_INTERVALS[0];

  const displayName = language === 'bn' ? currentBuyer.nameBn : currentBuyer.nameEn;
  const displayLocation = language === 'bn' ? currentBuyer.locBn : currentBuyer.locEn;
  const displayTime = language === 'bn' ? currentTime.bn : currentTime.en;

  return (
    <div 
      id="live-sales-notification-popup"
      className="hidden sm:flex fixed bottom-6 right-6 z-40 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-3 items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-black/5"
    >
      {/* Product Image with SafeImage fallback */}
      <div className="relative flex-shrink-0">
        <SafeImage
          src={currentProduct.image}
          alt={currentProduct.name}
          className="w-13 h-13 rounded-xl object-cover bg-slate-100 border border-slate-100"
        />
        <div 
          className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs"
          title="Verified Purchase"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-[#083344] truncate">
            {displayName}
          </p>
          <span className="text-[10px] text-slate-400 truncate font-normal">
            ({displayLocation})
          </span>
        </div>

        <p className="text-[11px] text-[#00829B] font-semibold truncate mt-0.5" title={currentProduct.name}>
          {currentProduct.name}
        </p>

        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <span className="text-emerald-600 font-semibold">{language === 'bn' ? 'অর্ডার করেছেন' : 'Purchased'}</span>
          <span>•</span>
          <span>{displayTime}</span>
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer flex-shrink-0 transition-colors"
        title="Close notification"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
