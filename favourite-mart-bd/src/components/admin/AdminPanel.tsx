import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Store, 
  LogOut, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Lock,
  Menu,
  X,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { Product, Order, Subscriber, UserProfile } from '../../types';
import { PRODUCTS } from '../../data/mockData';
import { 
  fetchProductsFromFirestore, 
  saveProductToFirestore, 
  deleteProductFromFirestore,
  seedProductsToFirestore,
  fetchAllOrdersFromFirestore, 
  updateOrderStatusInFirestore,
  fetchAllSubscribersFromFirestore,
  deleteSubscriberFromFirestore,
  fetchAllUsersFromFirestore
} from '../../services/firebaseService';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminCustomersTab } from './AdminCustomersTab';

interface AdminPanelProps {
  onNavigateToStore: () => void;
  onProductsUpdated?: (products: Product[]) => void;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'customers';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onNavigateToStore,
  onProductsUpdated,
}) => {
  const { 
    user, 
    userProfile, 
    isAdmin, 
    loading: authLoading, 
    signInWithEmail, 
    signUpWithEmail,
    signInWithGoogle, 
    signOut 
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Loading & sync states
  const [loadingData, setLoadingData] = useState(true);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [isRefreshingSubscribers, setIsRefreshingSubscribers] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Login form state
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all Firestore data when authorized
  useEffect(() => {
    if (user && isAdmin) {
      loadAllAdminData();
    }
  }, [user, isAdmin]);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [prodsData, ordersData, subsData, usersData] = await Promise.all([
        fetchProductsFromFirestore(),
        fetchAllOrdersFromFirestore(),
        fetchAllSubscribersFromFirestore(),
        fetchAllUsersFromFirestore(),
      ]);

      if (prodsData && prodsData.length > 0) {
        setProducts(prodsData);
        if (onProductsUpdated) onProductsUpdated(prodsData);
      } else {
        setProducts(PRODUCTS);
      }

      setOrders(ordersData);
      setSubscribers(subsData);
      setRegisteredUsers(usersData);
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Email/Password login handler
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');

    const targetEmail = emailInput.trim().toLowerCase();
    if (targetEmail !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError(`Access rejected: Only ${ADMIN_EMAIL} is authorized to access /admin.`);
      return;
    }

    if (!passwordInput || passwordInput.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    setIsLoggingIn(true);
    try {
      if (isCreatingAccount) {
        await signUpWithEmail(targetEmail, passwordInput, 'Salman Joyce');
        setLoginSuccessMsg('Admin credentials created successfully! Logging you in...');
      } else {
        await signInWithEmail(targetEmail, passwordInput);
      }
    } catch (err: any) {
      console.error('Email sign in failure:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setLoginError('No account found with this email/password. You can click "Create Password for Admin Account" below.');
      } else if (err.code === 'auth/wrong-password') {
        setLoginError('Incorrect password. Please verify and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setLoginError('This email is already registered. Please enter your existing password to log in.');
        setIsCreatingAccount(false);
      } else if (err.code === 'auth/operation-not-allowed') {
        setLoginError('Email/Password provider is not active in Firebase Console. Please use "Sign In with Google" below.');
      } else {
        setLoginError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Sign In fallback
  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const cred = await signInWithGoogle();
      if (!cred) {
        setIsLoggingIn(false);
        return;
      }
      const userEmail = cred.user.email?.toLowerCase();
      if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
        setLoginError(`Access rejected: Logged in as ${userEmail}. Only ${ADMIN_EMAIL} is authorized to access /admin.`);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Product CRUD
  const handleAddProduct = async (productData: Partial<Product>) => {
    await saveProductToFirestore(productData);
    const updated = await fetchProductsFromFirestore();
    setProducts(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    showToast(`Product "${productData.name}" added to inventory`);
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    await saveProductToFirestore(productData);
    const updated = await fetchProductsFromFirestore();
    setProducts(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    showToast(`Product "${productData.name}" updated successfully`);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProductFromFirestore(productId);
    const updated = await fetchProductsFromFirestore();
    setProducts(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    showToast('Product removed from catalog');
  };

  const handleSyncDefaultProducts = async () => {
    setIsSyncingProducts(true);
    try {
      const count = await seedProductsToFirestore(PRODUCTS);
      const updated = await fetchProductsFromFirestore();
      setProducts(updated);
      if (onProductsUpdated) onProductsUpdated(updated);
      showToast(`Synced ${count} products to Firestore database`);
    } catch (err: any) {
      alert('Failed syncing products: ' + err.message);
    } finally {
      setIsSyncingProducts(false);
    }
  };

  // Orders CRUD
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await updateOrderStatusInFirestore(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status changed to "${newStatus}"`);
  };

  const handleRefreshOrders = async () => {
    setIsRefreshingOrders(true);
    try {
      const fresh = await fetchAllOrdersFromFirestore();
      setOrders(fresh);
      showToast('Orders refreshed from Firestore');
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  // Customers & Subscribers actions
  const handleRefreshCustomersData = async () => {
    setIsRefreshingSubscribers(true);
    try {
      const [subs, usrs] = await Promise.all([
        fetchAllSubscribersFromFirestore(),
        fetchAllUsersFromFirestore(),
      ]);
      setSubscribers(subs);
      setRegisteredUsers(usrs);
      showToast('Customer accounts and subscribers refreshed');
    } finally {
      setIsRefreshingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    await deleteSubscriberFromFirestore(id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    showToast('Subscriber removed');
  };

  // 1. AUTH LOADING STATE
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#00829B] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Verifying administrator authorization...</p>
          <p className="text-xs text-slate-400 mt-1">Favourite Mart BD Portal</p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED OR REJECTED (NON-ADMIN) STATE
  if (!user || !isAdmin) {
    const isUnauthorizedAccount = user && !isAdmin;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4 font-['Hind_Siliguri',sans-serif]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <BrandLogo size="md" />
          </div>

          <div className="w-13 h-13 rounded-2xl bg-teal-50 text-[#00829B] flex items-center justify-center mx-auto mb-3 border border-teal-100 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black text-[#083344] tracking-tight">Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Authorized administrator access for inventory, orders, and customer management.
          </p>

          {/* Authorized Account Banner */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-left text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-[#00829B]" />
              Authorized Administrator
            </div>
            <p className="text-slate-600 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 inline-block">
              {ADMIN_EMAIL}
            </p>
          </div>

          {/* REJECTION SCREEN IF SIGNED IN AS WRONG ACCOUNT */}
          {isUnauthorizedAccount && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left text-xs text-rose-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-rose-900">Access Denied (Unauthorized)</strong>
                  <p className="mt-1">
                    You are signed in as <strong className="font-mono text-slate-900">{user.email}</strong>. This account does NOT have administrative privileges.
                  </p>
                  <p className="mt-1.5 text-[11px] text-rose-700">
                    Only <strong>{ADMIN_EMAIL}</strong> is permitted to enter /admin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loginError && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-left">
              {loginError}
            </div>
          )}

          {loginSuccessMsg && (
            <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{loginSuccessMsg}</span>
            </div>
          )}

          {/* IF LOGGED IN WITH WRONG ACCOUNT: SIGN OUT BUTTON */}
          {isUnauthorizedAccount ? (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => signOut()}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out &amp; Switch Account
              </button>
              <button
                onClick={onNavigateToStore}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                Return to Storefront
              </button>
            </div>
          ) : (
            /* EMAIL / PASSWORD FORM */
            <div className="mt-5 text-left">
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="salmanfjoyce@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#00829B] hover:bg-[#006477] text-white transition-all shadow-md shadow-[#00829B]/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>
                    {isCreatingAccount ? 'Create & Sign In' : 'Sign In with Firebase Email/Password'}
                  </span>
                </button>
              </form>

              {/* Mode Toggle: Log in vs Create Password */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingAccount(!isCreatingAccount);
                    setLoginError('');
                  }}
                  className="text-[11px] text-[#00829B] hover:underline font-semibold cursor-pointer"
                >
                  {isCreatingAccount
                    ? 'Already set a password? Switch to Sign In'
                    : 'First time setup? Create/Set password for admin email'}
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 flex items-center gap-2 text-slate-400 text-xs">
                <div className="h-px bg-slate-200 flex-grow" />
                <span className="text-[10px] uppercase font-bold text-slate-400">or alternative</span>
                <div className="h-px bg-slate-200 flex-grow" />
              </div>

              {/* Google Sign In option */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
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
                <span>Sign in with Google ({ADMIN_EMAIL})</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToStore}
                className="w-full mt-3 py-2 px-4 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                Return to Public Storefront
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pending counts for badges
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockProductsCount = products.filter((p) => (p.stockCount ?? 50) < 5).length;

  // 3. AUTHORIZED ADMIN PANEL WITH CLEAN SIDEBAR NAVIGATION
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#083344] font-['Hind_Siliguri',sans-serif] flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#083344] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-slide-up border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop Permanent + Mobile Slide-over) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-[#00829B] font-extrabold text-[10px] tracking-wider uppercase">
              ADMIN
            </span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#00829B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          {/* Products */}
          <button
            onClick={() => {
              setCurrentTab('products');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'products'
                ? 'bg-[#00829B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <div className="flex items-center gap-1">
              {lowStockProductsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title={`${lowStockProductsCount} low stock`} />
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                currentTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {products.length}
              </span>
            </div>
          </button>

          {/* Orders */}
          <button
            onClick={() => {
              setCurrentTab('orders');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'orders'
                ? 'bg-[#00829B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </div>
            <div className="flex items-center gap-1">
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black" title="Pending orders">
                  {pendingOrdersCount}
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                currentTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {orders.length}
              </span>
            </div>
          </button>

          {/* Customers */}
          <button
            onClick={() => {
              setCurrentTab('customers');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'customers'
                ? 'bg-[#00829B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              currentTab === 'customers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {registeredUsers.length + subscribers.length}
            </span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* Quick link to public store */}
          <button
            onClick={onNavigateToStore}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4 text-[#00829B]" />
            <span>View Public Store</span>
          </button>

          {/* Admin User Info & Logout */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user.displayName || 'Salman Joyce'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate" title={user.email || ''}>
                {user.email}
              </p>
            </div>

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#083344] capitalize">
                {currentTab === 'dashboard' && 'Operations Dashboard'}
                {currentTab === 'products' && 'Product Inventory'}
                {currentTab === 'orders' && 'Customer Orders'}
                {currentTab === 'customers' && 'Customers & Subscribers'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Favourite Mart BD &bull; Administrator Management Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              disabled={loadingData}
              title="Sync with Firestore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-[#00829B]' : ''}`} />
              <span className="hidden sm:inline">{loadingData ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            <button
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00829B] text-white hover:bg-[#006477] transition-all cursor-pointer shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-grow">
          {loadingData ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-[#00829B] animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Loading data from Firestore...</p>
              <p className="text-xs text-slate-400 mt-1">Fetching products, orders, and customer accounts</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <AdminDashboardTab
                  products={products}
                  orders={orders}
                  subscribers={subscribers}
                  users={registeredUsers}
                  onNavigateTab={(tab) => {
                    setCurrentTab(tab);
                  }}
                  onSelectOrder={(ord) => {
                    setSelectedOrderForModal(ord);
                  }}
                />
              )}

              {currentTab === 'products' && (
                <AdminProductsTab
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onSyncDefaultProducts={handleSyncDefaultProducts}
                  isSyncing={isSyncingProducts}
                />
              )}

              {currentTab === 'orders' && (
                <AdminOrdersTab
                  orders={orders}
                  onUpdateStatus={handleUpdateOrderStatus}
                  onRefreshOrders={handleRefreshOrders}
                  isRefreshing={isRefreshingOrders}
                  selectedOrderProp={selectedOrderForModal}
                />
              )}

              {currentTab === 'customers' && (
                <AdminCustomersTab
                  subscribers={subscribers}
                  users={registeredUsers}
                  orders={orders}
                  onDeleteSubscriber={handleDeleteSubscriber}
                  onRefreshData={handleRefreshCustomersData}
                  isRefreshing={isRefreshingSubscribers}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
