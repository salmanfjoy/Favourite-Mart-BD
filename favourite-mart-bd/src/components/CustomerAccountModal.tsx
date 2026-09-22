import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  PackageCheck,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { OrderConfirmation, Order } from '../types';
import { subscribeUserOrders } from '../services/firebaseService';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking?: () => void;
  onOpenShop?: () => void;
  recentOrders?: OrderConfirmation[];
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenTracking,
  onOpenShop,
  recentOrders = [],
}) => {
  const { t } = useLanguage();
  const { 
    user, 
    userProfile, 
    isAdmin, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signOut,
    updateShippingAddress 
  } = useAuth();

  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Logged-in profile tab
  const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders');

  // Address edit state
  const [editPhone, setEditPhone] = useState(userProfile?.phone || userProfile?.phoneNumber || '');
  const [editAddress, setEditAddress] = useState(userProfile?.address || userProfile?.shippingAddress || '');
  const [editDistrict, setEditDistrict] = useState(userProfile?.district || 'ঢাকা (Dhaka)');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressSavedSuccess, setAddressSavedSuccess] = useState(false);

  // Firestore user orders
  const [firestoreOrders, setFirestoreOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Sync address form with userProfile whenever it changes in Firestore
  useEffect(() => {
    if (userProfile) {
      if (userProfile.phone) setEditPhone(userProfile.phone);
      if (userProfile.address) setEditAddress(userProfile.address);
      if (userProfile.district) setEditDistrict(userProfile.district);
    }
  }, [userProfile]);

  // Real-time Firestore orders listener for authenticated user
  useEffect(() => {
    if (!user?.uid) {
      setFirestoreOrders([]);
      return;
    }

    setIsLoadingOrders(true);
    const unsubscribe = subscribeUserOrders(user.uid, (orders) => {
      setFirestoreOrders(orders);
      setIsLoadingOrders(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      setSuccessMsg(t('সফলভাবে লগইন হয়েছে!', 'Signed in successfully!'));
      setTimeout(() => {
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error('Sign in failed:', err);
      const code = err?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg(t('ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।', 'Invalid email or password.'));
      } else if (code === 'auth/invalid-email') {
        setErrorMsg(t('সঠিক ইমেইল অ্যাড্রেস লিখুন।', 'Please enter a valid email address.'));
      } else {
        setErrorMsg(t('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'Login failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg(t('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।', 'Password must be at least 6 characters.'));
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      if (phone && updateShippingAddress) {
        await updateShippingAddress(phone, '', editDistrict);
      }
      setSuccessMsg(t('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'Account created successfully!'));
      setTimeout(() => {
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error('Sign up failed:', err);
      if (err?.code === 'auth/email-already-in-use') {
        setErrorMsg(t('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট রয়েছে। সাইন ইন করুন।', 'Email already in use. Please sign in.'));
      } else {
        setErrorMsg(t('রেজিস্ট্রেশন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।', 'Sign up failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res) {
        setSuccessMsg(t('গুগল দিয়ে সফলভাবে লগইন হয়েছে!', 'Signed in with Google!'));
      }
    } catch (err) {
      setErrorMsg(t('গুগল লগইন সম্পন্ন করা যায়নি।', 'Google sign-in could not be completed.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateShippingAddress) return;
    setIsSavingAddress(true);
    try {
      await updateShippingAddress(editPhone, editAddress, editDistrict);
      setAddressSavedSuccess(true);
      setTimeout(() => setAddressSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 flex items-center justify-center text-[#00829B]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#083344] leading-tight">
                {user ? t('আমার অ্যাকাউন্ট', 'My Account') : t('কাস্টমার লগইন / সাইন আপ', 'Customer Login / Sign Up')}
              </h2>
              <p className="text-[11px] text-slate-400">
                {user ? (user.email || 'Favourite Mart BD') : t('অর্ডার ট্র্যাক ও প্রোফাইল ব্যবহারের জন্য লগইন করুন', 'Sign in to track orders & save delivery address')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* STATE A: USER IS NOT LOGGED IN */}
          {!user ? (
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-[#00829B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('লগইন (Sign In)', 'Sign In')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-[#00829B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('নতুন অ্যাকাউন্ট (Register)', 'Create Account')}
                </button>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1-Tap Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>{t('গুগল দিয়ে ১ ক্লিকে সাইন ইন', 'Continue with Google')}</span>
              </button>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] uppercase font-bold text-slate-400">
                  {t('অথবা ইমেইল ব্যবহার করুন', 'or use email')}
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* EMAIL / PASSWORD FORM */}
              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('আপনার পুরো নাম', 'Full Name')} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('মোবাইল নম্বর', 'Mobile Number')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01712-XXXXXX"
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ইমেইল অ্যাড্রেস', 'Email Address')} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('পাসওয়ার্ড', 'Password')} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#00829B] hover:bg-[#006477] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00829B]/20 cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>
                    {authMode === 'signin'
                      ? t('লগইন করুন', 'Sign In')
                      : t('অ্যাকাউন্ট তৈরি করুন', 'Create Account')}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            /* STATE B: USER IS LOGGED IN */
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-50 border border-teal-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00829B]/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#00829B] text-white font-extrabold text-base flex items-center justify-center">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#083344] truncate">
                        {user.displayName || t('সম্মানিত গ্রাহক', 'Valued Customer')}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {t('গ্রাহক', 'Verified')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('লগআউট', 'Log Out')}</span>
                </button>
              </div>

              {/* Sub-Tabs: Orders vs Saved Address */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-white text-[#00829B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>{t('আমার অর্ডারসমূহ', 'My Orders')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('address')}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'address'
                      ? 'bg-white text-[#00829B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('ডেলিভারি ঠিকানা', 'Delivery Address')}</span>
                </button>
              </div>

              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  {isLoadingOrders ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#00829B] animate-spin" />
                      <p className="text-xs text-slate-500 font-medium">
                        {t('অর্ডার লোড হচ্ছে...', 'Loading your orders...')}
                      </p>
                    </div>
                  ) : (firestoreOrders.length > 0 ? (
                    <div className="space-y-2.5">
                      {firestoreOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-all shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-[#083344] font-mono">
                              #{order.trackingCode || order.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex items-center justify-between">
                            <span>{new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            <span className="font-bold text-[#00829B]">
                              ৳{(order.totalAmount || 0).toLocaleString('bn-BD')}
                            </span>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-0.5">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between truncate">
                                  <span className="truncate">{it.name}</span>
                                  <span className="text-slate-400 font-medium flex-shrink-0 ml-2">x{it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {onOpenTracking && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenTracking();
                              }}
                              className="w-full py-1.5 text-center text-xs font-bold text-[#00829B] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1 border-t border-slate-100"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{t('লাইভ ট্র্যাক করুন', 'Live Track Parcel')}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-2.5">
                      {recentOrders.map((order) => (
                        <div
                          key={order.orderId}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-all shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-[#083344] font-mono">
                              #{order.orderId}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex items-center justify-between">
                            <span>{order.createdAt}</span>
                            <span className="font-bold text-[#00829B]">
                              ৳{order.total?.toLocaleString('bn-BD') || order.total}
                            </span>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 truncate">
                              {order.items.map((it) => it.product.name).join(', ')}
                            </div>
                          )}

                          {onOpenTracking && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenTracking();
                              }}
                              className="w-full py-1.5 text-center text-xs font-bold text-[#00829B] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1 border-t border-slate-100"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{t('লাইভ ট্র্যাক করুন', 'Live Track Parcel')}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-teal-50 text-[#00829B] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {t('এখনও কোনো অর্ডার পাওয়া যায়নি', 'No orders placed yet')}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {t('ক্যাশ অন ডেলিভারিতে পছন্দের পণ্য অর্ডার করুন!', 'Order your favorite items with Cash on Delivery!')}
                      </p>
                      {onOpenShop && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenShop();
                          }}
                          className="px-4 py-2 bg-[#00829B] text-white rounded-xl text-xs font-bold hover:bg-[#006477] transition-all cursor-pointer"
                        >
                          {t('কেনাকাটা শুরু করুন', 'Start Shopping')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ADDRESS */}
              {activeTab === 'address' && (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-left">
                  {addressSavedSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{t('ঠিকানা সফলভাবে সংরক্ষিত হয়েছে!', 'Address saved successfully!')}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('ফোন নম্বর', 'Contact Phone Number')}
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('জেলা / অঞ্চল', 'District / Region')}
                    </label>
                    <select
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    >
                      <option value="ঢাকা (Dhaka)">ঢাকা (Dhaka) - Delivery ৳৬০</option>
                      <option value="চট্টগ্রাম (Chittagong)">চট্টগ্রাম (Chittagong) - Delivery ৳১০০</option>
                      <option value="সিলেট (Sylhet)">সিলেট (Sylhet) - Delivery ৳১০০</option>
                      <option value="রাজশাহী (Rajshahi)">রাজশাহী (Rajshahi) - Delivery ৳১০০</option>
                      <option value="খুলনা (Khulna)">খুলনা (Khulna) - Delivery ৳১০০</option>
                      <option value="বরিশাল (Barisal)">বরিশাল (Barisal) - Delivery ৳১০০</option>
                      <option value="রংপুর (Rangpur)">রংপুর (Rangpur) - Delivery ৳১০০</option>
                      <option value="ময়মনসিংহ (Mymensingh)">ময়মনসিংহ (Mymensingh) - Delivery ৳১০০</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('বিস্তারিত ঠিকানা (বাড়ি, রোড, এলাকা)', 'Full Delivery Address')}
                    </label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="যেমন: বাড়ি #১২, রোড #৪, সেক্টর #৩, উত্তরা, ঢাকা"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="w-full py-3 px-4 rounded-xl bg-[#00829B] hover:bg-[#006477] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#00829B]/20"
                  >
                    {isSavingAddress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{t('ঠিকানা সংরক্ষণ করুন', 'Save Address Details')}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
