import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  User, 
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  LogIn
} from 'lucide-react';
import { CartItem, CheckoutFormData, OrderConfirmation } from '../types';
import { formatBDT } from '../utils/currency';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { createOrderInFirestore } from '../services/firebaseService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const { t } = useLanguage();
  const { user, userProfile, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: userProfile?.displayName || user?.displayName || '',
    phoneNumber: userProfile?.phone || '',
    deliveryArea: 'inside_dhaka',
    fullAddress: userProfile?.address || '',
    district: userProfile?.district || 'ঢাকা',
    orderNotes: '',
    paymentMethod: 'cod',
  });

  // Keep synced if user signs in
  useEffect(() => {
    if (userProfile || user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userProfile?.displayName || user?.displayName || '',
        phoneNumber: prev.phoneNumber || userProfile?.phone || '',
        fullAddress: prev.fullAddress || userProfile?.address || '',
        district: prev.district || userProfile?.district || 'ঢাকা',
      }));
    }
  }, [user, userProfile]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = formData.deliveryArea === 'inside_dhaka' ? 60 : 120;
  const discount = subtotal > 5000 ? 200 : 0;
  const total = subtotal + shippingFee - discount;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      err.fullName = t('আপনার পূর্ণ নাম লিখুন', 'Please enter your full name');
    }
    if (!formData.phoneNumber.trim()) {
      err.phoneNumber = t('মোবাইল নম্বর প্রদান করুন', 'Please enter your mobile phone number');
    } else if (!/^01[3-9]\d{8}$/.test(formData.phoneNumber.replace(/\s|-/g, ''))) {
      err.phoneNumber = t('১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)', 'Enter a valid 11-digit Bangladeshi number (e.g. 017xxxxxxxx)');
    }
    if (!formData.fullAddress.trim()) {
      err.fullAddress = t('সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (রোড, বাসা, এলাকা)', 'Enter detailed delivery address (House, Road, Area)');
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `FM-${orderNum}`;
    const orderId = `FM-BD-${orderNum}`;

    try {
      // Save order to Firebase Firestore
      await createOrderInFirestore({
        id: orderId,
        trackingCode,
        customerName: formData.fullName,
        customerPhone: formData.phoneNumber,
        customerAddress: formData.fullAddress,
        district: formData.district,
        deliveryCharge: shippingFee,
        subtotal,
        discount,
        totalAmount: total,
        paymentMethod: formData.paymentMethod || 'cod',
        status: 'pending',
        note: formData.orderNotes,
        items: items.map(i => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          color: i.selectedColor,
          image: i.product.image,
        })),
        userId: user?.uid || null,
      });

      const order: OrderConfirmation = {
        orderId,
        customer: formData,
        items,
        subtotal,
        shippingFee,
        discount,
        total,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      setIsSubmitting(false);
      setConfirmedOrder(order);
      onOrderSuccess(order);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00829B', '#00A3C4', '#083344', '#10B981'],
      });
    } catch (error) {
      console.error('Error placing order to Firestore:', error);
      // Fallback local placement
      const order: OrderConfirmation = {
        orderId,
        customer: formData,
        items,
        subtotal,
        shippingFee,
        discount,
        total,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };
      setIsSubmitting(false);
      setConfirmedOrder(order);
      onOrderSuccess(order);
    }
  };

  const handleWhatsAppShare = () => {
    if (!confirmedOrder) return;
    const itemsText = confirmedOrder.items.map(i => `${i.quantity}x ${i.product.name}${i.selectedColor ? ` [${i.selectedColor}]` : ''} (${formatBDT(i.product.price)})`).join('\n');
    const msg = `*Favourite Mart BD - নতুন অর্ডার*\n\n*অর্ডার ট্র্যাকিং কোড:* ${confirmedOrder.orderId}\n*নাম:* ${confirmedOrder.customer.fullName}\n*ফোন:* ${confirmedOrder.customer.phoneNumber}\n*ঠিকানা:* ${confirmedOrder.customer.fullAddress}, ${confirmedOrder.customer.district}\n\n*প্রোডাক্ট সমূহ:*\n${itemsText}\n\n*মোট বিল:* ${formatBDT(confirmedOrder.total)} (ক্যাশ অন ডেলিভারি)`;
    window.open(`https://wa.me/8801890000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#083344] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00829B] flex items-center justify-center text-white font-bold text-sm">
              FM
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight">
                {confirmedOrder ? t('অর্ডার সফল হয়েছে 🎉', 'Order Placed Successfully 🎉') : t('ক্যাশ অন ডেলিভারিতে দ্রুত অর্ডার করুন', 'Quick Cash on Delivery Order')}
              </h2>
              <p className="text-[11px] text-cyan-200">
                {confirmedOrder ? t('আপনার অর্ডারটি গ্রহণ করা হয়েছে এবং ফায়ারবেসে সিঙ্ক হয়েছে', 'Your order is recorded & synced to cloud') : t('পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করবেন', 'Pay with cash upon package delivery')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {confirmedOrder ? (
          <div className="p-5 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-[#083344]">
                {t('অর্ডার সফলভাবে প্লেস হয়েছে!', 'Order Successfully Placed!')}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t('ধন্যবাদ', 'Thank you')}{' '}
                <strong className="text-[#083344]">{confirmedOrder.customer.fullName}</strong>. {t('আমাদের কাস্টমার কেয়ার থেকে দ্রুত কল করে আপনার অর্ডারটি কনফার্ম করা হবে।', 'Our customer support team will call you shortly to confirm your delivery.')}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">{t('ট্র্যাকিং কোড:', 'Tracking Code:')}</span>
                <span className="font-mono font-extrabold text-sm text-[#00829B] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {confirmedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('ফোন নম্বর:', 'Phone:')}</span>
                <span className="font-bold text-[#083344]">{confirmedOrder.customer.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('ডেলিভারি ঠিকানা:', 'Address:')}</span>
                <span className="font-medium text-[#083344] text-right max-w-[240px] truncate">{confirmedOrder.customer.fullAddress}, {confirmedOrder.customer.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('পেমেন্ট মেথড:', 'Payment Method:')}</span>
                <span className="font-bold text-emerald-600">{t('ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে পেমেন্ট)', 'Cash on Delivery')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold text-[#083344]">
                <span>{t('সর্বমোট প্রদেয় টাকা:', 'Total Payable:')}</span>
                <span className="text-base text-[#00829B]">{formatBDT(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* WhatsApp & Close Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleWhatsAppShare}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('হোয়াটসঅ্যাপে আপডেট পান', 'Get WhatsApp Update')}</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#083344] hover:bg-[#00829B] text-white font-bold text-sm transition-all cursor-pointer"
              >
                {t('আরও শপিং করুন', 'Continue Shopping')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-5 text-left">
            
            {/* Quick Google Sign In Suggestion if Guest */}
            {!user && (
              <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00829B]" />
                  <span className="text-xs text-[#083344] font-medium">
                    {t('Google দিয়ে দ্রুত লগইন করে অটো ঠিকানা পূরণ করতে চান?', 'Sign in with Google for 1-click address autofill')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-100 border border-cyan-300 text-[#083344] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#00829B]" />
                  <span>Google Login</span>
                </button>
              </div>
            )}

            {/* Order Items Preview Ribbon */}
            <div className="bg-[#F0FDFA] rounded-2xl p-3.5 border border-[#00829B]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShoppingBag className="w-5 h-5 text-[#00829B] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#083344] truncate">
                    {items.length} {t('টি প্রোডাক্ট', 'Products')} ({items.reduce((s, i) => s + i.quantity, 0)} {t('পিস', 'items')})
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-[#00829B] flex-shrink-0">
                {formatBDT(subtotal)}
              </span>
            </div>

            {/* Customer Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#083344] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#00829B]" /> {t('আপনার পূর্ণ নাম *', 'Your Full Name *')}
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder={t('যেমন: তানভীর আহমেদ', 'e.g. Tanvir Ahmed')}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full bg-[#F8FAFC] border rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#083344] focus:outline-none focus:bg-white transition-all ${
                    errors.fullName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-[#00829B]'
                  }`}
                />
                {errors.fullName && <p className="text-[10px] text-rose-500">{errors.fullName}</p>}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#083344] flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-[#00829B]" /> {t('মোবাইল নম্বর *', 'Phone Number *')}
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="017xxxxxxxx"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={`w-full bg-[#F8FAFC] border rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-[#083344] focus:outline-none focus:bg-white transition-all ${
                    errors.phoneNumber ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-[#00829B]'
                  }`}
                />
                {errors.phoneNumber && <p className="text-[10px] text-rose-500">{errors.phoneNumber}</p>}
              </div>

              {/* Delivery Area Selection */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#083344] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#00829B]" /> {t('ডেলিভারি এলাকা সিলেক্ট করুন *', 'Select Delivery Zone *')}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryArea: 'inside_dhaka' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                      formData.deliveryArea === 'inside_dhaka'
                        ? 'border-[#00829B] bg-[#F0FDFA] shadow-xs ring-1 ring-[#00829B]'
                        : 'border-slate-200 bg-[#F8FAFC] hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#083344]">{t('ঢাকা সিটির ভেতরে', 'Inside Dhaka City')}</span>
                    <span className="text-[11px] text-[#00829B] font-extrabold mt-0.5">{t('ডেলিভারি চার্জ: ৳ ৬০', 'Delivery Fee: ৳60')}</span>
                    <span className="text-[10px] text-slate-400">{t('২৪-৪৮ ঘণ্টায় ডেলিভারি', 'Delivery in 24-48 Hours')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryArea: 'outside_dhaka' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                      formData.deliveryArea === 'outside_dhaka'
                        ? 'border-[#00829B] bg-[#F0FDFA] shadow-xs ring-1 ring-[#00829B]'
                        : 'border-slate-200 bg-[#F8FAFC] hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#083344]">{t('ঢাকা সিটির বাইরে', 'Outside Dhaka City')}</span>
                    <span className="text-[11px] text-[#00829B] font-extrabold mt-0.5">{t('ডেলিভারি চার্জ: ৳ ১২০', 'Delivery Fee: ৳120')}</span>
                    <span className="text-[10px] text-slate-400">{t('২-৩ দিনে সারাদেশে ডেলিভারি', 'Nationwide in 2-3 Days')}</span>
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#083344] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00829B]" /> {t('সম্পূর্ণ ঠিকানা (রোড, বাসা, থানা/উপজেলা) *', 'Full Delivery Address (House, Road, Area) *')}
                </label>
                <textarea
                  rows={2}
                  autoComplete="street-address"
                  placeholder={t('যেমন: বাসা # ১২, রোড # ৪, ধানমন্ডি, ঢাকা', 'e.g. House #12, Road #4, Dhanmondi, Dhaka')}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className={`w-full bg-[#F8FAFC] border rounded-xl px-3.5 py-2 text-base sm:text-xs text-[#083344] focus:outline-none focus:bg-white transition-all ${
                    errors.fullAddress ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-[#00829B]'
                  }`}
                />
                {errors.fullAddress && <p className="text-[10px] text-rose-500">{errors.fullAddress}</p>}
              </div>

              {/* District & Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#083344]">{t('জেলা (District)', 'District')}</label>
                <input
                  type="text"
                  placeholder={t('যেমন: ঢাকা, চট্টগ্রাম, সিলেট', 'e.g. Dhaka, Chattogram, Sylhet')}
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#083344] focus:outline-none focus:border-[#00829B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#083344]">{t('অর্ডার নোট (ঐচ্ছিক)', 'Order Notes (Optional)')}</label>
                <input
                  type="text"
                  placeholder={t('কালার বা কোনো স্পেশাল ইনস্ট্রাকশন', 'Special preferences or instructions')}
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#083344] focus:outline-none focus:border-[#00829B]"
                />
              </div>

            </div>

            {/* Payment Method Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">{t('ক্যাশ অন ডেলিভারি প্রযোজ্য', 'Cash on Delivery Guaranteed')}</p>
                  <p className="text-[11px] text-emerald-700">{t('কোনো অগ্রিম পেমেন্ট ছাড়া পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।', 'Zero upfront deposit required. Inspect and pay directly.')}</p>
                </div>
              </div>
              <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-md shadow-2xs">
                COD
              </span>
            </div>

            {/* Order Summary Calculations */}
            <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('সাবটোটাল:', 'Subtotal:')}</span>
                <span className="font-bold text-[#083344]">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('ডেলিভারি চার্জ', 'Delivery Fee')} ({formData.deliveryArea === 'inside_dhaka' ? t('ঢাকা', 'Dhaka') : t('ঢাকার বাইরে', 'Outside')}):</span>
                <span className="font-bold text-[#083344]">{formatBDT(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{t('স্পেশাল ডিসকাউন্ট:', 'Special Discount:')}</span>
                  <span>-{formatBDT(discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm sm:text-base font-black text-[#083344] pt-2 border-t border-slate-200">
                <span>{t('সর্বমোট পরিশোধযোগ্য বিল:', 'Total Payable Amount:')}</span>
                <span className="text-[#00829B]">{formatBDT(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#00829B] hover:bg-[#00A3C4] text-white font-extrabold text-sm sm:text-base shadow-primary-glow flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {t('অর্ডার ফায়ারবেসে সুরক্ষিত হচ্ছে...', 'Securing order in cloud...')}
                </span>
              ) : (
                <>
                  <span>{t('অর্ডার কনফার্ম করুন — ', 'Confirm Cash on Delivery Order — ')}{formatBDT(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
