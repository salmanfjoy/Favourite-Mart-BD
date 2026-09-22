import React from 'react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist-add' | 'wishlist-remove' | 'info';
  title: string;
  description?: string;
  image?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onOpenCart?: () => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, onOpenCart }) => {
  const { t } = useLanguage();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-3.5 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center flex-shrink-0">
              {toast.type === 'cart' ? (
                <ShoppingBag className="w-5 h-5" />
              ) : (
                <Heart className="w-5 h-5 fill-[#00829B]" />
              )}
            </div>
          )}

          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-xs sm:text-sm font-bold text-[#083344] leading-snug truncate">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {toast.description}
              </p>
            )}
          </div>

          {toast.type === 'cart' && onOpenCart && (
            <button
              onClick={() => {
                onDismiss(toast.id);
                onOpenCart();
              }}
              className="px-2.5 py-1 text-xs font-bold text-[#00829B] hover:bg-[#F0FDFA] rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            >
              {t('কার্ট দেখুন', 'View Cart')}
            </button>
          )}

          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 flex-shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
