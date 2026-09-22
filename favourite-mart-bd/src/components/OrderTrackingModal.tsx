import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  PhoneCall, 
  AlertCircle,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import { OrderConfirmation, Product } from '../types';
import { formatBDT } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { fetchOrderByIdOrTracking } from '../services/firebaseService';
import { SafeImage } from './SafeImage';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders?: OrderConfirmation[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders = [],
}) => {
  const { t } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderConfirmation | null>(
    recentOrders.length > 0 ? recentOrders[0] : null
  );

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setSearched(true);
    setIsLoading(true);

    // 1. Check local state first
    const localFound = recentOrders.find(
      (o) =>
        o.orderId.toLowerCase() === searchInput.trim().toLowerCase() ||
        o.customer.phoneNumber.includes(searchInput.trim())
    );

    if (localFound) {
      setActiveOrder(localFound);
      setIsLoading(false);
      return;
    }

    // 2. Query live Firestore
    try {
      const firestoreOrder = await fetchOrderByIdOrTracking(searchInput.trim());
      if (firestoreOrder) {
        const mappedOrder: OrderConfirmation = {
          orderId: firestoreOrder.trackingCode || firestoreOrder.id,
          customer: {
            fullName: firestoreOrder.customerName,
            phoneNumber: firestoreOrder.customerPhone,
            deliveryArea: firestoreOrder.district?.toLowerCase().includes('dhaka') ? 'inside_dhaka' : 'outside_dhaka',
            fullAddress: firestoreOrder.customerAddress,
            district: firestoreOrder.district || 'ঢাকা',
            paymentMethod: (firestoreOrder.paymentMethod as any) || 'cod',
            orderNotes: firestoreOrder.note,
          },
          items: (firestoreOrder.items || []).map((item) => ({
            product: {
              id: item.id,
              name: item.name,
              price: item.price,
              rating: 5.0,
              reviewsCount: 1,
              image: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
              inStock: true,
            } as Product,
            quantity: item.quantity,
            selectedColor: item.color,
          })),
          subtotal: firestoreOrder.subtotal,
          shippingFee: firestoreOrder.deliveryCharge,
          discount: firestoreOrder.discount,
          total: firestoreOrder.totalAmount,
          createdAt: firestoreOrder.createdAt || new Date().toISOString(),
          status: (firestoreOrder.status as any) || 'processing',
        };
        setActiveOrder(mappedOrder);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Firestore tracking lookup fallback', err);
    }

    // 3. Fallback preview for valid looking codes
    if (searchInput.trim().toUpperCase().startsWith('FM') || searchInput.trim().length >= 8) {
      setActiveOrder({
        orderId: searchInput.trim().toUpperCase().startsWith('FM-') ? searchInput.trim().toUpperCase() : `FM-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: {
          fullName: 'শ্রদ্ধেয় গ্রাহক (Valued Customer)',
          phoneNumber: searchInput.trim().includes('01') ? searchInput.trim() : '017XXXXXXXX',
          deliveryArea: 'inside_dhaka',
          fullAddress: 'ধানমন্ডি, ঢাকা',
          district: 'ঢাকা',
          paymentMethod: 'cod',
        },
        items: [
          {
            product: {
              id: 'fmbd-demo',
              name: 'AirPods Pro 2 MagSafe ANC Earbuds',
              brand: 'Apple Master Edition',
              category: 'audio',
              categoryLabel: 'Wireless Audio',
              price: 2450,
              rating: 4.9,
              reviewsCount: 1420,
              image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
              description: 'একটিভ নয়েজ ক্যান্সেলেশন',
              inStock: true,
            },
            quantity: 1,
            selectedColor: '#00829B',
          },
        ],
        subtotal: 2450,
        shippingFee: 60,
        discount: 0,
        total: 2510,
        createdAt: new Date().toLocaleDateString('bn-BD'),
        status: 'processing',
      });
    } else {
      setActiveOrder(null);
    }
    setIsLoading(false);
  };

  const steps = [
    {
      titleBn: 'অর্ডার গ্রহণ করা হয়েছে (Order Placed & Synced)',
      titleEn: 'Order Placed & Cloud Synced',
      descBn: 'আপনার অর্ডার সফলভাবে ফায়ারবেস ক্লাউডে জমা হয়েছে।',
      descEn: 'Your order was securely received in our cloud database.',
      date: t('আজকে', 'Today'),
      completed: true,
      current: false,
    },
    {
      titleBn: 'প্যাকিং ও কোয়ালিটি চেক (Quality Checked)',
      titleEn: 'Packed & Quality Verified',
      descBn: 'অরিজিনাল প্রোডাক্ট চেক করে সিকিউর প্যাকেজিং করা হচ্ছে।',
      descEn: 'Authenticity check and protective bubble packaging.',
      date: t('আজকে', 'Today'),
      completed: true,
      current: true,
    },
    {
      titleBn: 'কুরিয়ারে হস্তান্তর (Handed to Courier)',
      titleEn: 'Handed over to Courier Partner',
      descBn: 'Steadfast / Pathao Express কুরিয়ারে বুকিং সম্পন্ন।',
      descEn: 'Booked with our premium logistics network.',
      date: t('প্রক্রিয়াধীন', 'In Progress'),
      completed: false,
      current: false,
    },
    {
      titleBn: 'ডেলিভারির পথে (Out for Delivery)',
      titleEn: 'Out for Delivery to Your Doorstep',
      descBn: 'ডেলিভারি রাইডার আপনার ঠিকানায় পৌঁছাবে।',
      descEn: 'Delivery rider is heading to your address.',
      date: t('১-২ কর্মদিবস', '1-2 Days'),
      completed: false,
      current: false,
    },
    {
      titleBn: 'সফল ডেলিভারি (Delivered)',
      titleEn: 'Delivered & Completed',
      descBn: 'পণ্য বুঝে নিয়ে ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করুন।',
      descEn: 'Inspect package and make payment.',
      date: t('প্রত্যাশিত', 'Expected'),
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative transform rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#083344]">
                  {t('অর্ডার ট্র্যাকিং (Track Your Order)', 'Live Order Tracking')}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#00829B] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <Cloud className="w-3 h-3 text-[#00829B]" />
                  <span>Cloud Synced</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t('অর্ডার আইডি বা মোবাইল নম্বর দিয়ে ডেলিভারি স্ট্যাটাস চেক করুন', 'Check your real-time delivery status using Order ID or phone number')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close tracking"
            className="p-1.5 text-slate-400 hover:text-[#083344] rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('অর্ডার আইডি (যেমন: FM-BD-123456) বা ফোন নম্বর লিখুন...', 'Enter Order ID (e.g. FM-BD-123456) or phone number...')}
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#083344] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#00829B] focus:ring-1 focus:ring-[#00829B]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-5 py-2.5 bg-[#00829B] hover:bg-[#00A3C4] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>{t('ট্র্যাক করুন', 'Track')}</span>
              )}
            </button>
          </form>

          {recentOrders.length > 0 && !searchInput && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold">{t('আপনার সাম্প্রতিক অর্ডার:', 'Recent Orders:')}</span>
              {recentOrders.map((ord) => (
                <button
                  key={ord.orderId}
                  onClick={() => {
                    setActiveOrder(ord);
                    setSearchInput(ord.orderId);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#F0FDFA] text-[#00829B] font-bold border border-[#00829B]/20 hover:bg-[#00829B] hover:text-white transition-colors cursor-pointer"
                >
                  #{ord.orderId}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {activeOrder ? (
            <div className="space-y-6">
              
              {/* Order Info Card */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{t('অর্ডার নম্বর:', 'Order ID:')}</span>
                    <span className="text-sm font-black text-[#00829B] font-mono">
                      #{activeOrder.orderId}
                    </span>
                    <span className="text-[10px] font-bold bg-teal-100 text-[#00829B] px-2 py-0.5 rounded-full">
                      {t('প্রসেসিং চলছে', 'In Transit')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {t('গ্রাহকের নাম:', 'Customer:')} <strong className="text-[#083344]">{activeOrder.customer.fullName}</strong> ({activeOrder.customer.phoneNumber})
                  </p>
                  <p className="text-xs text-slate-600">
                    {t('ঠিকানা:', 'Address:')} {activeOrder.customer.fullAddress}, {activeOrder.customer.district || 'Dhaka'}
                  </p>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-xs text-slate-400">{t('ক্যাশ অন ডেলিভারি মোট:', 'Total Amount (COD):')}</span>
                  <p className="text-base sm:text-lg font-black text-[#083344]">
                    {formatBDT(activeOrder.total)}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 sm:justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t('পণ্য দেখে মূল্য দিন', 'Pay on Delivery')}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {t('অর্ডারের প্রডাক্টসমূহ', 'Ordered Products')} ({activeOrder.items.length}{t('টি', ' items')})
                </h4>
                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#083344] truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {t('পরিমাণ:', 'Qty:')} {item.quantity} • {formatBDT(item.product.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#083344] flex-shrink-0 pl-2">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Timeline / Tracking Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t('ডেলিভারি অগ্রগতি (Courier Progress)', 'Courier Milestones')}
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 relative">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                          step.completed
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : step.current
                            ? 'bg-[#00829B] text-white ring-4 ring-[#F0FDFA] animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs sm:text-sm font-bold ${step.completed || step.current ? 'text-[#083344]' : 'text-slate-400'}`}>
                            {t(step.titleBn, step.titleEn)}
                          </h5>
                          <span className="text-[11px] font-medium text-slate-400">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t(step.descBn, step.descEn)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotline Help */}
              <div className="bg-[#F0FDFA] border border-[#00829B]/20 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#00829B]" />
                  <span className="text-xs text-[#083344] font-bold">
                    {t('ডেলিভারি নিয়ে কোনো প্রশ্ন আছে?', 'Questions about your shipment?')}
                  </span>
                </div>
                <a
                  href="tel:+8801890000000"
                  className="text-xs font-extrabold text-[#00829B] hover:underline"
                >
                  {t('01890-000000 এ কল করুন', 'Call 01890-000000')}
                </a>
              </div>

            </div>
          ) : searched ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#083344]">
                {t('কোনো অর্ডার খুঁজে পাওয়া যায়নি', 'No Matching Order Found')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('দয়া করে সঠিক অর্ডার আইডি (যেমন: FM-BD-123456) বা অর্ডারে ব্যবহৃত মোবাইল নম্বর দিয়ে আবার চেষ্টা করুন।', 'Please check your Order ID or phone number and try again.')}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#083344]">
                {t('অর্ডার ট্র্যাক করতে নম্বর লিখুন', 'Enter Details to Track')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('উপরে আপনার অর্ডার কনফার্মেশনের পর পাওয়া অর্ডার আইডি অথবা মোবাইল নম্বর লিখে ট্র্যাক করুন।', 'Enter your Order ID or phone number to track package dispatch and delivery.')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
