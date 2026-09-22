import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export type MobileTab = 'home' | 'categories' | 'cart' | 'wishlist' | 'account';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabSelect: (tab: MobileTab) => void;
  cartCount: number;
  wishlistCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabSelect,
  cartCount,
  wishlistCount,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    {
      id: 'home' as MobileTab,
      labelBn: 'হোম',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'categories' as MobileTab,
      labelBn: 'ক্যাটাগরি',
      labelEn: 'Categories',
      icon: LayoutGrid,
    },
    {
      id: 'cart' as MobileTab,
      labelBn: 'কার্ট',
      labelEn: 'Cart',
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      id: 'wishlist' as MobileTab,
      labelBn: 'উইশলিস্ট',
      labelEn: 'Wishlist',
      icon: Heart,
      badge: wishlistCount,
    },
    {
      id: 'account' as MobileTab,
      labelBn: 'একাউন্ট',
      labelEn: 'Account',
      icon: User,
      isUser: true,
    },
  ];

  return (
    <nav 
      id="mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] md:hidden pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1 transform-gpu"
    >
      <div className="grid grid-cols-5 h-14 items-center max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 px-1 select-none transition-all cursor-pointer active:scale-90 group ${
                isActive ? 'text-[#00829B]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#00829B] rounded-full shadow-xs shadow-[#00829B]/30 animate-in fade-in zoom-in duration-200" />
              )}

              {/* Icon with badges */}
              <div className="relative flex items-center justify-center">
                {item.isUser && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User profile"
                    className={`w-5 h-5 rounded-full object-cover ring-2 transition-all ${
                      isActive ? 'ring-[#00829B]' : 'ring-slate-300'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                    }`}
                  />
                )}

                {/* Badge for cart / wishlist */}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#00829B] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {item.badge! > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-bold tracking-tight truncate max-w-full ${
                  isActive ? 'text-[#00829B] font-extrabold' : 'text-slate-500'
                }`}
              >
                {t(item.labelBn, item.labelEn)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
