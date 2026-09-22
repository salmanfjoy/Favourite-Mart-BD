import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order, Review, Product, Subscriber, UserProfile } from '../types';

export interface CreateOrderParams {
  id?: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  district: string;
  deliveryCharge: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  note?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    image?: string;
  }>;
  userId?: string | null;
}

export const createOrderInFirestore = async (orderData: CreateOrderParams): Promise<string> => {
  const orderId = orderData.id || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `orders/${orderId}`;

  try {
    const payload = {
      id: orderId,
      trackingCode: orderData.trackingCode,
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      customerAddress: orderData.customerAddress.trim(),
      district: orderData.district || 'ঢাকা সিটি (Inside Dhaka)',
      deliveryCharge: Number(orderData.deliveryCharge) || 0,
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      status: 'pending',
      note: (orderData.note || '').substring(0, 500),
      items: orderData.items.map((i) => ({
        id: String(i.id),
        name: String(i.name).substring(0, 100),
        price: Number(i.price),
        quantity: Number(i.quantity) || 1,
        color: i.color || '',
        image: i.image || '',
      })),
      userId: orderData.userId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, payload);
    return orderId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};

export const fetchOrderByIdOrTracking = async (searchQuery: string): Promise<Order | null> => {
  const cleanQuery = searchQuery.trim().toUpperCase();
  const path = 'orders';

  try {
    // 1. Try direct ID get
    const directDocRef = doc(db, 'orders', searchQuery.trim());
    const directDoc = await getDoc(directDocRef);
    if (directDoc.exists()) {
      return directDoc.data() as Order;
    }

    // 2. Query by trackingCode
    const qTracking = query(
      collection(db, 'orders'),
      where('trackingCode', '==', cleanQuery),
      limit(1)
    );
    const trackingSnapshot = await getDocs(qTracking);
    if (!trackingSnapshot.empty) {
      return trackingSnapshot.docs[0].data() as Order;
    }

    // 3. Query by customerPhone
    const qPhone = query(
      collection(db, 'orders'),
      where('customerPhone', '==', searchQuery.trim()),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const phoneSnapshot = await getDocs(qPhone);
    if (!phoneSnapshot.empty) {
      return phoneSnapshot.docs[0].data() as Order;
    }

    return null;
  } catch (err) {
    console.warn('Order lookup notice:', err);
    // Non-fatal, return null if not found
    return null;
  }
};

export const subscribeToNewsletterInFirestore = async (contact: string, source: string = 'website_footer') => {
  const subId = `sub_${Date.now()}`;
  const path = `subscribers/${subId}`;
  try {
    const docRef = doc(db, 'subscribers', subId);
    await setDoc(docRef, {
      id: subId,
      contact: contact.trim(),
      source,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};

// ==========================================
// ADMIN: Products Management
// ==========================================

export const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  const path = 'products';
  try {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    const products: Product[] = [];
    snapshot.forEach((d) => {
      products.push({ id: d.id, ...d.data() } as Product);
    });
    return products;
  } catch (err) {
    console.warn('Error fetching products from Firestore:', err);
    return [];
  }
};

export const saveProductToFirestore = async (productData: Partial<Product>): Promise<string> => {
  const productId = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `products/${productId}`;
  try {
    const docRef = doc(db, 'products', productId);
    const payload = {
      ...productData,
      id: productId,
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      inStock: productData.inStock !== false,
      stockCount: typeof productData.stockCount === 'number' ? Number(productData.stockCount) : 50,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      brand: productData.brand || 'Favourite Mart BD',
      category: productData.category || 'tech',
      categoryLabel: productData.categoryLabel || 'Tech & Gadgets',
      updatedAt: new Date().toISOString(),
      ...(productData.id ? {} : { createdAt: new Date().toISOString() }),
    };

    await setDoc(docRef, payload, { merge: true });
    return productId;
  } catch (err) {
    handleFirestoreError(err, productData.id ? OperationType.UPDATE : OperationType.CREATE, path);
    throw err;
  }
};

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  const path = `products/${productId}`;
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
};

export const seedProductsToFirestore = async (initialProducts: Product[]): Promise<number> => {
  let count = 0;
  for (const prod of initialProducts) {
    try {
      const docRef = doc(db, 'products', prod.id);
      await setDoc(docRef, {
        ...prod,
        stockCount: prod.stockCount || 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      count++;
    } catch (e) {
      console.warn(`Failed seeding product ${prod.id}:`, e);
    }
  }
  return count;
};

// ==========================================
// ADMIN: Orders Management
// ==========================================

export const fetchAllOrdersFromFirestore = async (): Promise<Order[]> => {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as Order);
    });
    return orders;
  } catch (err) {
    // If index or order error, fallback without sorting
    try {
      const fallbackSnapshot = await getDocs(collection(db, 'orders'));
      const orders: Order[] = [];
      fallbackSnapshot.forEach((d) => {
        orders.push({ id: d.id, ...d.data() } as Order);
      });
      return orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (innerErr) {
      console.warn('Orders fetch note:', innerErr);
      return [];
    }
  }
};

export const updateOrderStatusInFirestore = async (orderId: string, newStatus: string): Promise<void> => {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
};

export const deleteOrderFromFirestore = async (orderId: string): Promise<void> => {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
};

// ==========================================
// ADMIN: Subscribers Management
// ==========================================

export const fetchAllSubscribersFromFirestore = async (): Promise<Subscriber[]> => {
  const path = 'subscribers';
  try {
    const q = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const subscribers: Subscriber[] = [];
    snapshot.forEach((d) => {
      subscribers.push({ id: d.id, ...d.data() } as Subscriber);
    });
    return subscribers;
  } catch (err) {
    try {
      const fallbackSnapshot = await getDocs(collection(db, 'subscribers'));
      const subscribers: Subscriber[] = [];
      fallbackSnapshot.forEach((d) => {
        subscribers.push({ id: d.id, ...d.data() } as Subscriber);
      });
      return subscribers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (innerErr) {
      console.warn('Subscribers fetch note:', innerErr);
      return [];
    }
  }
};

export const deleteSubscriberFromFirestore = async (subscriberId: string): Promise<void> => {
  const path = `subscribers/${subscriberId}`;
  try {
    const docRef = doc(db, 'subscribers', subscriberId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
};

export const fetchAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
  const path = 'users';
  try {
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    const users: UserProfile[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      users.push({
        uid: d.id,
        email: data.email || '',
        displayName: data.displayName || data.name || 'User',
        phone: data.phone || '',
        address: data.address || '',
        district: data.district || '',
        role: data.role || 'customer',
        createdAt: data.createdAt || '',
        photoURL: data.photoURL || '',
      });
    });
    return users.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.warn('Users fetch note:', err);
    return [];
  }
};

// ==========================================
// USER: Order History & User Persistence
// ==========================================

export const fetchUserOrdersFromFirestore = async (userId: string): Promise<Order[]> => {
  if (!userId) return [];
  const path = 'orders';
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((d) => {
      orders.push({ id: d.id, ...d.data() } as Order);
    });
    return orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.warn('User orders fetch note:', err);
    return [];
  }
};

export const subscribeUserOrders = (
  userId: string,
  onOrders: (orders: Order[]) => void
) => {
  if (!userId) {
    onOrders([]);
    return () => {};
  }
  const path = 'orders';
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((d) => {
        orders.push({ id: d.id, ...d.data() } as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onOrders(orders);
    },
    (error) => {
      console.warn('User orders real-time subscription note:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
};

export const saveUserWishlistToFirestore = async (userId: string, wishlistIds: string[]): Promise<void> => {
  if (!userId) return;
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      wishlistIds,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};


