import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Flame,
  ArrowRight,
  Truck,
  Sparkles,
  Gift,
  User as UserIcon,
  LogOut,
  HelpCircle,
  PhoneCall,
  BookOpen
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenLuckyWheel: () => void;
  onCategorySelect: (categorySlug: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAccount?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenTracking,
  onOpenLuckyWheel,
  onCategorySelect,
  onNavigateSection,
  onOpenAccount,
}) => {
  const { language, t } = useLanguage();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-2.5 sm:py-3' 
          : 'bg-white border-b border-slate-100 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Menu Button (Left on mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo (Left on Desktop, Center/Left on Mobile) */}
          <div className="flex items-center gap-6">
            <button 
              id="brand-logo-btn"
              onClick={() => onNavigateSection('hero')}
              className="group cursor-pointer text-left focus:outline-none flex items-center"
            >
              <BrandLogo variant="full" size="md" />
            </button>

            {/* Desktop Main Navigation Links (ShopCart Style) */}
            <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm text-slate-700">
              <button
                onClick={() => onNavigateSection('hero')}
                className="px-3 py-2 rounded-lg hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('হোম', 'Home')}
              </button>
              
              <button
                onClick={() => onNavigateSection('featured-products')}
                className="px-3 py-2 rounded-lg hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('শপ', 'Shop')}
              </button>

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <button
                  onClick={() => onNavigateSection('categories')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    isCategoryDropdownOpen ? 'text-[#FF6B4A] bg-slate-50' : 'hover:text-[#FF6B4A] hover:bg-slate-50'
                  }`}
                >
                  <span>{t('ক্যাটাগরি', 'Categories')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#FF6B4A]' : ''}`} />
                </button>

                {/* Dropdown Menu Panel */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 mt-1 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                    {CATEGORIES.slice(0, 10).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onCategorySelect(cat.slug);
                          setIsCategoryDropdownOpen(false);
                          onNavigateSection('featured-products');
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 group text-left transition-colors cursor-pointer"
                      >
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-[#FF6B4A] transition-colors truncate">
                            {language === 'bn' ? (cat.bnName || cat.name) : cat.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {cat.itemCount}+ {t('আইটেম', 'Items')}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="col-span-2 mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">{t('সেরা মানের আসল গ্যাজেট ও লাইফস্টাইল', 'Top quality original products')}</span>
                      <button 
                        onClick={() => {
                          setIsCategoryDropdownOpen(false);
                          onNavigateSection('categories');
                        }}
                        className="text-[#FF6B4A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {t('সব ক্যাটাগরি দেখুন', 'View All Categories')} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigateSection('deal-of-the-day')}
                className="px-3 py-2 rounded-lg hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>{t('অফার', 'Deals')}</span>
              </button>

              <button
                onClick={() => onNavigateSection('blog')}
                className="px-3 py-2 rounded-lg hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('ব্লগ', 'Blog')}
              </button>

              <button
                onClick={() => onNavigateSection('contact')}
                className="px-3 py-2 rounded-lg hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('যোগাযোগ', 'Contact')}
              </button>
            </nav>
          </div>

          {/* CENTER/RIGHT: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2">
            <button
              id="search-bar-trigger"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-500 rounded-full py-2 px-4 text-xs lg:text-sm transition-all cursor-pointer group"
            >
              <span className="truncate text-slate-400 group-hover:text-slate-600">
                {t('পণ্য খুঁজুন...', 'Search products...')}
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-200/60 group-hover:bg-[#FF6B4A] group-hover:text-white flex items-center justify-center transition-colors">
                <Search className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* RIGHT ACTION ICONS: User, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mobile Search Icon Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="md:hidden p-2 text-slate-700 hover:text-[#FF6B4A] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Spin & Win Bonus (Desktop) */}
            <button
              onClick={onOpenLuckyWheel}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all text-xs font-bold cursor-pointer"
              title="Spin & Win Discount"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('স্পিন বোনাস', 'Spin & Win')}</span>
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 text-[#083344] transition-all cursor-pointer"
                    title={user.displayName || user.email || 'Account'}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/40"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#00829B] text-white font-bold text-xs flex items-center justify-center">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline text-xs font-bold truncate max-w-[100px]">
                      {user.displayName?.split(' ')[0] || t('প্রোফাইল', 'Account')}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1.5">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-xs text-[#083344] truncate">{user.displayName || t('গ্রাহক', 'Customer')}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {t('ভেরিফাইড', 'Verified')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenAccount) onOpenAccount();
                          else onOpenTracking();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#00829B] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-[#00829B]" />
                        <span>{t('আমার অর্ডারসমূহ', 'My Orders')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenAccount) onOpenAccount();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#00829B] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#00829B]" />
                        <span>{t('প্রোফাইল ও ঠিকানা', 'Profile & Address')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenWishlist();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>{t('উইশলিস্ট', 'My Wishlist')}</span>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('লগআউট', 'Sign Out')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (onOpenAccount) onOpenAccount();
                    else signInWithGoogle();
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-[#00829B] transition-all cursor-pointer font-bold text-xs shadow-2xs active:scale-95"
                  title="Sign In with Google / Account"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden sm:inline">{t('সাইন ইন', 'Sign In')}</span>
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-slate-700 hover:text-rose-500 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 1.5 -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="p-2 text-slate-800 hover:text-[#FF6B4A] rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF6B4A] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <BrandLogo variant="full" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('hero');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <span>{t('হোম', 'Home')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('featured-products');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <span>{t('শপ (সব প্রোডাক্ট)', 'Shop All Products')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('categories');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <span>{t('ক্যাটাগরি সমূহ', 'Categories')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('deal-of-the-day');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-[#FF6B4A] hover:bg-orange-50 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF6B4A]" />
                  <span>{t('হট ডিল ও ডিসকাউন্ট', 'Hot Deals & Offers')}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF6B4A] text-white">
                  50% OFF
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('blog');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>{t('ব্লগ ও গাইড', 'Latest Blog & Guides')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateSection('faq');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>{t('সাধারণ প্রশ্নাবলী (FAQ)', 'FAQ')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-50 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{t('অর্ডার ট্র্যাক করুন', 'Track My Order')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLuckyWheel();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>{t('লাকি স্পিন হুইল', 'Lucky Spin Wheel')}</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            {/* Drawer Footer / Helpline */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <a
                href="tel:+8801890000000"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>হটলাইন: 01890-000000</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
