import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from './data/mockData';
import { Product, CartItem, OrderConfirmation, ComboBundle } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedProducts } from './components/FeaturedProducts';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { FeaturedBrands } from './components/FeaturedBrands';
import { TestimonialsAndWhyShop } from './components/TestimonialsAndWhyShop';
import { NewsletterAndInstagram } from './components/NewsletterAndInstagram';
import { BlogSection } from './components/BlogSection';
import { FAQSection } from './components/FAQSection';
import { TrustBadges } from './components/TrustBadges';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { LiveSalesToast } from './components/LiveSalesToast';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { ShoppingBag, PhoneCall, Heart, Truck, Gift } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { AdminPanel } from './components/admin/AdminPanel';
import { fetchProductsFromFirestore } from './services/firebaseService';

export default function App() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Helper to reliably detect admin route via pathname, hash, or search query
  const checkIsAdminRoute = (): boolean => {
    if (typeof window === 'undefined') return false;
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();

    return (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      path.includes('/admin') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      hash.startsWith('#admin') ||
      hash.startsWith('#/admin') ||
      hash.includes('admin') ||
      search.includes('admin') ||
      search.includes('page=admin') ||
      search.includes('view=admin')
    );
  };

  // Routing State for /admin
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return checkIsAdminRoute() ? '/admin' : '/';
  });

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch (e) {
        console.warn('pushState note:', e);
      }

      // Sync hash so iframe or external tab navigation stays perfectly in sync
      if (path === '/admin' || path.includes('admin')) {
        window.location.hash = '/admin';
      } else {
        if (window.location.hash.includes('admin')) {
          window.location.hash = '';
        }
      }

      setCurrentRoute(path === '/admin' || path.includes('admin') ? '/admin' : '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setCurrentRoute('/admin');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Global keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A toggles admin panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo(currentRoute === '/admin' ? '/' : '/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRoute]);

  // Fetch Firestore products if any exist
  useEffect(() => {
    const loadFirestoreProducts = async () => {
      try {
        const firestoreProds = await fetchProductsFromFirestore();
        if (firestoreProds && firestoreProds.length > 0) {
          setProducts(firestoreProds);
        }
      } catch (err) {
        console.warn('Could not load products from Firestore:', err);
      }
    };
    loadFirestoreProducts();
  }, []);

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[2], // Urban Pro Backpack
      quantity: 1,
      selectedColor: '#00829B',
    },
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[0], PRODUCTS[7]]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Orders stored in local storage
  const [recentOrders, setRecentOrders] = useState<OrderConfirmation[]>(() => {
    try {
      const saved = localStorage.getItem('fmbd_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      {
        orderId: 'FM-7842',
        customer: {
          fullName: 'তানভীর আহমেদ (Tanvir Ahmed)',
          phoneNumber: '01712-345678',
          deliveryArea: 'inside_dhaka',
          fullAddress: 'ধানমন্ডি ২৭, ঢাকা (Dhanmondi 27, Dhaka)',
          district: 'ঢাকা',
          paymentMethod: 'cod',
        },
        items: [
          {
            product: PRODUCTS[2],
            quantity: 1,
            selectedColor: '#00829B',
          },
        ],
        subtotal: 1850,
        shippingFee: 60,
        discount: 0,
        total: 1910,
        createdAt: '১৬/০৮/২০২৬',
        status: 'processing',
      },
    ];
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('home');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const handleMobileTabSelect = (tab: MobileTab) => {
    setMobileActiveTab(tab);
    if (tab === 'home') {
      setSelectedCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'categories') {
      const el = document.getElementById('categories') || document.getElementById('featured-products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'wishlist') {
      setIsWishlistOpen(true);
    } else if (tab === 'account') {
      setIsAccountOpen(true);
    }
  };

  // Toast Notification Queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartItemIds = useMemo(() => new Set(cart.map((item) => item.product.id)), [cart]);
  const wishlistIds = useMemo(() => new Set(wishlist.map((p) => p.id)), [wishlist]);

  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.colors?.[0] }];
    });

    addToast({
      type: 'cart',
      title: t('কার্টে যোগ করা হয়েছে!', 'Added to Cart!'),
      description: `${product.name} (${quantity}${t('টি', ' pcs')})`,
      image: product.image,
    });
  };

  // Handle Full Combo Bundle Addition
  const handleAddComboToCart = (combo: ComboBundle) => {
    setCart((prev) => {
      const updated = [...prev];
      combo.items.forEach((prod) => {
        const existing = updated.find((i) => i.product.id === prod.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push({
            product: prod,
            quantity: 1,
            selectedColor: prod.colors?.[0],
          });
        }
      });
      return updated;
    });

    addToast({
      type: 'cart',
      title: t('মেগা কম্বো প্যাক কার্টে যোগ হয়েছে!', 'Mega Combo Pack Added!'),
      description: `${combo.titleBn} (${combo.items.length}টি আইটেম)`,
      image: combo.image,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Direct 1-Click Order Handler
  const handleDirectOrder = (product: Product, quantity = 1, color?: string) => {
    setCheckoutItems([{ product, quantity, selectedColor: color || product.colors?.[0] }]);
    setIsCheckoutOpen(true);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  // Proceed to checkout from drawer
  const handleProceedFromCart = () => {
    if (cart.length === 0) return;
    setCheckoutItems([...cart]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Confirmed Handler
  const handleOrderSuccess = (order: OrderConfirmation) => {
    // Save to orders state and localStorage
    const updated = [order, ...recentOrders];
    setRecentOrders(updated);
    try {
      localStorage.setItem('fmbd_orders', JSON.stringify(updated));
    } catch (e) {}

    // If the full cart was ordered, empty cart
    if (checkoutItems.length === cart.length) {
      setCart([]);
    }
    addToast({
      type: 'cart',
      title: t('অর্ডার সফল হয়েছে!', 'Order Confirmed!'),
      description: `${t('অর্ডার আইডি:', 'Order ID:')} #${order.orderId}`,
    });
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.has(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast({
        type: 'wishlist-remove',
        title: t('উইশলিস্ট থেকে সরানো হয়েছে', 'Removed from Wishlist'),
        description: product.name,
      });
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast({
        type: 'wishlist-add',
        title: t('পছন্দের তালিকায় রাখা হয়েছে', 'Added to Wishlist'),
        description: product.name,
        image: product.image,
      });
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, 1);
    handleRemoveFromWishlist(product);
  };

  // Apply Coupon from Lucky Wheel
  const handleApplyCoupon = (code: string) => {
    addToast({
      type: 'info',
      title: t('ভাউচার কোড অ্যাক্টিভ হয়েছে!', 'Voucher Activated!'),
      description: `${t('কোড:', 'Code:')} ${code}`,
    });
  };

  // Navigation smooth scroll
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    const el = document.getElementById('featured-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentRoute === '/admin') {
    return (
      <AdminPanel
        onNavigateToStore={() => navigateTo('/')}
        onProductsUpdated={(updated) => setProducts(updated)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#083344] font-['Hind_Siliguri',sans-serif]">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar 
        onShopClick={() => handleNavigateSection('featured-products')} 
      />

      {/* 2. STICKY HEADER */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onCategorySelect={handleCategorySelect}
        onNavigateSection={handleNavigateSection}
      />

      {/* MAIN HOMEPAGE BODY: Exactly the 9 requested sections between Header and Footer */}
      <main className="flex-grow pb-16 sm:pb-0">
        {/* 1. HERO BANNER: Two-column layout (headline+buttons first, image below on mobile) */}
        <HeroSection
          onShopCollection={() => handleNavigateSection('featured-products')}
          onExploreDeals={() => handleNavigateSection('flash-sale')}
        />

        {/* 2. SHOP BY CATEGORY: Clean row of 6 category cards with circular images (scrollable on mobile) */}
        <div id="shop-by-category">
          <ShopByCategory
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* 3. BEST SELLING PRODUCTS: 6 cols desktop, 2 cols mobile */}
        <div id="featured-products">
          <FeaturedProducts
            products={products}
            selectedCategory={selectedCategory}
            wishlistIds={wishlistIds}
            cartItemIds={cartItemIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p, color) => handleAddToCart(p, 1, color)}
            onQuickView={(p) => setQuickViewProduct(p)}
            onDirectOrder={handleDirectOrder}
            onClearCategory={() => setSelectedCategory(null)}
          />
        </div>

        {/* 4. LIMITED-TIME SALE BANNER: Full-width dark navy banner with countdown timer & CTA */}
        <div id="flash-sale">
          <FlashSaleBanner
            onShopSale={() => {
              handleCategorySelect('audio');
            }}
          />
        </div>

        {/* 5. FEATURED BRANDS: Row of brand logos */}
        <div id="brands">
          <FeaturedBrands />
        </div>

        {/* 6. TESTIMONIALS + STATS: Two columns - customer testimonial on left, 4-icon stats on right */}
        <div id="testimonials-why-shop">
          <TestimonialsAndWhyShop />
        </div>

        {/* 7. NEWSLETTER + INSTAGRAM: Two columns - newsletter signup on left, Instagram grid on right */}
        <div id="newsletter-instagram">
          <NewsletterAndInstagram />
        </div>

        {/* 8. FAQ SECTION: Accordion-style expandable questions */}
        <div id="faq">
          <FAQSection />
        </div>

        {/* 9. TRUST BADGES STRIP: Row of small icons with labels */}
        <div id="trust-badges">
          <TrustBadges />
        </div>
      </main>

      {/* 14. FOOTER */}
      <Footer
        onNavigateCategory={handleCategorySelect}
        onNavigateSection={handleNavigateSection}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* FLOATING WHATSAPP CHAT WIDGET */}
      <WhatsAppWidget />

      {/* LIVE SALES ACTIVITY SOCIAL PROOF POPUP */}
      <LiveSalesToast />

      {/* NATIVE-LIKE MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeTab={
          isCartOpen
            ? 'cart'
            : isWishlistOpen
            ? 'wishlist'
            : isAccountOpen
            ? 'account'
            : mobileActiveTab
        }
        onTabSelect={handleMobileTabSelect}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      {/* INTERACTIVE MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setMobileActiveTab('home');
        }}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedFromCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => {
          setIsWishlistOpen(false);
          setMobileActiveTab('home');
        }}
        wishlist={wishlist}
        onRemoveWishlist={handleRemoveFromWishlist}
        onAddToCart={handleMoveWishlistToCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setQuickViewProduct(p);
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        onApplyCoupon={handleApplyCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems.length > 0 ? checkoutItems : cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        recentOrders={recentOrders}
      />

      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => {
          setIsAccountOpen(false);
          setMobileActiveTab('home');
        }}
        onOpenTracking={() => {
          setIsAccountOpen(false);
          setIsTrackingOpen(true);
        }}
        onOpenShop={() => {
          setIsAccountOpen(false);
          handleNavigateSection('featured-products');
        }}
        recentOrders={recentOrders}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </div>
  );
}
