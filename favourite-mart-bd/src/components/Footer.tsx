import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Truck,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToNewsletterInFirestore } from '../services/firebaseService';

interface FooterProps {
  onNavigateCategory: (categorySlug: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCategory,
  onNavigateSection,
  onOpenTracking,
}) => {
  const { t, language } = useLanguage();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || phoneOrEmail.length < 5) {
      setError(t('সঠিক মোবাইল নম্বর বা ইমেইল লিখুন।', 'Please enter a valid mobile number or email.'));
      return;
    }
    setError('');
    try {
      await subscribeToNewsletterInFirestore(phoneOrEmail, 'website_footer');
    } catch (err) {
      console.warn('Subscription save notice:', err);
    }
    setSubscribed(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#00829B', '#00A3C4', '#083344', '#F59E0B'],
    });
  };

  // Social media platforms
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      color: 'hover:bg-[#1877F2]',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      color: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      color: 'hover:bg-[#FF0000]',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      color: 'hover:bg-[#000000]',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.82c0 1.7-.49 3.42-1.52 4.77-1.53 2.01-4.04 3.08-6.52 2.87-2.31-.19-4.48-1.48-5.63-3.47-1.22-2.09-1.24-4.8-.05-6.91 1.25-2.22 3.66-3.6 6.19-3.55.33.01.65.04.97.09v4.11c-.48-.15-.99-.2-1.5-.16-1.04.09-2.02.73-2.51 1.65-.54 1.02-.45 2.34.22 3.26.68.93 1.87 1.39 3 1.21 1.06-.17 1.95-.98 2.21-2.03.07-.3.1-.61.1-.92V.02z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/8801890000000',
      color: 'hover:bg-[#25D366]',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer id="about" className="bg-[#083344] text-slate-200 pt-12 sm:pt-14 pb-20 sm:pb-8 border-t border-teal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIP NEWSLETTER SIGNUP BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-[#05232e] via-[#083344] to-[#004D61] border border-teal-800/60 p-5 sm:p-8 lg:p-10 mb-10 sm:mb-14 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#00A3C4]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00829B]/30 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('ভিআইপি মেম্বার ডিসকাউন্ট', 'VIP Member Special')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {t('প্রথম অর্ডারে ১০০ টাকা ক্যাশব্যাক বা ডিসকাউন্ট', 'Get ৳100 Cashback on Your First Order')}
              </h2>
              <p className="text-cyan-100/80 text-xs sm:text-sm font-normal">
                {t(
                  'নতুন গ্যাজেট ড্রপ, বিশেষ অফার ও কুপন কোড পেতে আপনার মোবাইল নম্বর বা ইমেইল দিয়ে যুক্ত থাকুন।',
                  'Stay updated on flash sale drops, secret vouchers, and new tech accessories.'
                )}
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-bold text-sm text-white">
                      {t('অভিনন্দন! আপনি আমাদের ভিআইপি ক্লাবে যুক্ত হয়েছেন।', 'Congratulations! You are now a VIP member.')}
                    </p>
                    <p className="text-xs text-emerald-300 mt-0.5">
                      {t('অর্ডারের সময় কুপন কোড ব্যবহার করুন:', 'Use promo code during checkout:')}{' '}
                      <span className="font-mono font-bold bg-emerald-400/20 px-2 py-0.5 rounded text-white">FAV100</span>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <PhoneCall className="w-4 h-4 text-cyan-300 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        placeholder={t('আপনার মোবাইল নম্বর (যেমন: 018xxxxxxxx)...', 'Your mobile number (e.g. 018xxxxxxxx)...')}
                        className="w-full bg-[#05232e]/90 border border-teal-700/80 text-white rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#00A3C4] focus:ring-1 focus:ring-[#00A3C4] placeholder:text-slate-400 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-[#00829B] hover:bg-[#00A3C4] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-primary-glow cursor-pointer whitespace-nowrap active:scale-98"
                    >
                      <span>{t('অফার নিন', 'Claim Offer')}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <p className="text-xs text-rose-400 pl-2">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 5-COLUMN FOOTER NAVIGATION & DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 border-b border-teal-900/60">
          
          {/* Column 1: Brand Info & Social Icons */}
          <div className="space-y-4 text-left">
            <BrandLogo variant="full" theme="dark" size="lg" />

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t(
                'ফেভারিট মার্ট বিডি — বাংলাদেশে প্রিমিয়াম লাইফস্টাইল গ্যাজেট, ব্লুটুথ হেডফোন, স্মার্টওয়াচ, ওয়াটারপ্রুফ ব্যাগ ও ট্রাভেল এসেনশিয়ালের বিশ্বস্ত অনলাইন শপ।',
                'Favourite Mart BD is your trusted destination for premium lifestyle gadgets, audio gear, smartwatches, backpacks, and daily tech accessories in Bangladesh.'
              )}
            </p>

            {/* Social Media Platform Icons */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 mb-2">
                {t('সোশ্যাল মিডিয়ায় যুক্ত থাকুন', 'Follow Us')}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl bg-white/10 hover:text-white flex items-center justify-center text-slate-200 transition-all duration-200 hover:scale-110 shadow-sm ${s.color}`}
                    title={s.name}
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-sm text-left">
            <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-teal-800/60 pb-1">
              {t('কুইক লিংকস', 'Quick Links')}
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FF6B4A] transition-colors text-left cursor-pointer"
                >
                  {t('হোম পেইজ', 'Home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('featured-products')}
                  className="hover:text-[#FF6B4A] transition-colors text-left cursor-pointer"
                >
                  {t('সব প্রোডাক্টস', 'Shop All Products')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('shop-by-category')}
                  className="hover:text-[#FF6B4A] transition-colors text-left cursor-pointer"
                >
                  {t('ক্যাটাগরি সমূহ', 'Categories')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('flash-sale')}
                  className="hover:text-[#FF6B4A] transition-colors text-left cursor-pointer"
                >
                  {t('সুপার সেল ও অফার', 'Super Sale Deals')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('blog')}
                  className="hover:text-[#FF6B4A] transition-colors text-left cursor-pointer"
                >
                  {t('ব্লগ ও আর্টিকেকেল', 'Blog & Articles')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-3 text-sm text-left">
            <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-teal-800/60 pb-1">
              {t('কাস্টমার সার্ভিস', 'Customer Service')}
            </p>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-cyan-200 transition-colors flex items-center gap-1.5 text-left cursor-pointer text-cyan-300 font-bold"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t('অর্ডার ট্র্যাক করুন', 'Track Order Status')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('সচরাচর জিজ্ঞাসা (FAQ)', 'Frequently Asked Questions')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-badges')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('ক্যাশ অন ডেলিভারি পলিসি', 'Cash on Delivery Policy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('trust-badges')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট', '7-Day Return & Replacement')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('testimonials-why-shop')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('গ্রাহক সন্তুষ্টি ও রিভিউ', 'Customer Reviews')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: My Account Links */}
          <div className="space-y-3 text-sm text-left">
            <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-teal-800/60 pb-1">
              {t('আমার অ্যাকাউন্ট', 'My Account')}
            </p>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('আমার প্রোফাইল ও লগইন', 'My Account Profile')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('অর্ডার হিস্ট্রি ও স্ট্যাটাস', 'Order History & Status')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('featured-products')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('উইশলিস্ট তালিকা', 'Saved Wishlist')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('featured-products')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('শপিং ব্যাগ / কার্ট', 'Shopping Cart')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  {t('হেল্প ও সাপোর্ট সেন্টার', 'Help & Support Desk')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="space-y-3 text-sm text-left">
            <p className="font-bold text-white uppercase tracking-wider text-xs border-b border-teal-800/60 pb-1">
              {t('যোগাযোগের ঠিকানা', 'Contact Info')}
            </p>
            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B4A] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-bold">{t('অফিস:', 'Address:')}</strong>
                  <span className="text-slate-300">{t('কলাবাগান, ধানমন্ডি, ঢাকা - ১২০৫', 'Kalabagan, Dhanmondi, Dhaka - 1205')}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                <span>
                  <strong className="text-white block font-bold">{t('হটলাইন:', 'Phone:')}</strong>
                  <a href="tel:+8801890000000" className="text-cyan-300 hover:text-white font-mono font-bold">01890-000000</a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                <span>
                  <strong className="text-white block font-bold">{t('ইমেইল:', 'Email:')}</strong>
                  <span className="text-slate-300">support@favouritemartbd.com</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                <span>
                  <strong className="text-white block font-bold">{t('অফিস সময়:', 'Hours:')}</strong>
                  <span className="text-slate-300">সকাল ৯টা - রাত ১১টা (প্রতিদিন)</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR (COPYRIGHT & PAYMENT METHOD ICONS) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <p className="text-slate-300 font-medium text-center sm:text-left">
              © 2026 <strong className="text-white">Favourite Mart BD</strong>. {t('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}
            </p>
          </div>
          
          {/* Payment Method Badges including Visa, Mastercard, PayPal, etc. */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['Visa', 'Mastercard', 'PayPal', 'bKash', 'Nagad', 'Cash On Delivery'].map((pay, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold text-[11px] border border-slate-700 shadow-xs"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
