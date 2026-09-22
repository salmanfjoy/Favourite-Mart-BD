import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Product, Order, Subscriber, UserProfile } from '../../types';

interface AdminDashboardTabProps {
  products: Product[];
  orders: Order[];
  subscribers: Subscriber[];
  users: UserProfile[];
  onNavigateTab: (tab: 'dashboard' | 'products' | 'orders' | 'customers') => void;
  onSelectOrder?: (order: Order) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  products,
  orders,
  subscribers,
  users,
  onNavigateTab,
  onSelectOrder,
}) => {
  const now = new Date();

  // Helper date matches
  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const isThisWeek = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const isThisMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  };

  // Orders counts
  const ordersToday = orders.filter((o) => isToday(o.createdAt));
  const ordersThisWeek = orders.filter((o) => isThisWeek(o.createdAt));
  const ordersThisMonth = orders.filter((o) => isThisMonth(o.createdAt));

  // Revenue calculation: Sum of paid orders (also including confirmed/delivered)
  const paidOrders = orders.filter((o) => o.status === 'paid' || o.status === 'confirmed' || o.status === 'delivered');
  const totalPaidRevenue = paidOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
  const totalAllRevenue = orders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);

  // Products stock status
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 50) < 5);
  const inStockProducts = products.filter((p) => p.inStock !== false && (p.stockCount ?? 50) > 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return (
    <div className="space-y-6">
      {/* 1. Core Top Stats: Revenue & Order Velocity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue (Paid Orders) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Revenue (Paid)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#083344] tracking-tight">
              ৳{totalPaidRevenue.toLocaleString()}
            </span>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>{paidOrders.length} paid/delivered order(s)</span>
              <span className="text-slate-400">Total: ৳{totalAllRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Orders Today</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00829B] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#083344] tracking-tight">
              {ordersToday.length}
            </span>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Placed today</span>
              {pendingOrders.length > 0 && (
                <span className="text-amber-600 font-semibold">{pendingOrders.length} pending total</span>
              )}
            </div>
          </div>
        </div>

        {/* Orders This Week */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Orders This Week</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#083344] tracking-tight">
              {ordersThisWeek.length}
            </span>
            <div className="mt-1 text-[11px] text-slate-500">
              <span>Past 7 days volume</span>
            </div>
          </div>
        </div>

        {/* Orders This Month */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Orders This Month</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#083344] tracking-tight">
              {ordersThisMonth.length}
            </span>
            <div className="mt-1 text-[11px] text-slate-500">
              <span>All-time total: <strong className="text-slate-800">{orders.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics: Total Products, Subscribers & Registered Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Products Card */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#00829B]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              Manage Products <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-slate-500">Total Products</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#083344]">{products.length}</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {inStockProducts.length} in stock
              </span>
            </div>
          </div>
          {lowStockProducts.length > 0 && (
            <div className="mt-2 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{lowStockProducts.length} product(s) low stock (below 5)</span>
            </div>
          )}
        </div>

        {/* Total Newsletter Subscribers Card */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              View List <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-slate-500">Newsletter Subscribers</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#083344]">{subscribers.length}</span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                VIP Audience
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Joined via website footer promo bar</span>
          </div>
        </div>

        {/* Total Registered Users Card */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              View Customers <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-medium text-slate-500">Registered Users</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#083344]">{users.length}</span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Accounts
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Customer accounts created in Firestore</span>
          </div>
        </div>
      </div>

      {/* 3. 5 Most Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#083344]">Recent Orders (Latest 5)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Most recent customer purchases placed across Bangladesh</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#00829B] hover:text-[#006477] flex items-center gap-1 cursor-pointer"
          >
            See All Orders ({orders.length}) &rarr;
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No orders placed yet</p>
            <p className="text-xs text-slate-400 mt-1">Live customer orders from Firestore will automatically appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.slice(0, 5).map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
                    paid: 'bg-blue-50 text-blue-700 border-blue-200',
                    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
                    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                  };
                  const currentStatus = order.status || 'pending';
                  const badgeClass = statusColors[currentStatus] || 'bg-slate-50 text-slate-700 border-slate-200';

                  const dateFormatted = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#00829B]">
                        #{order.trackingCode || order.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{order.items?.length || 0} item(s)</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ৳{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass} capitalize`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (onSelectOrder) onSelectOrder(order);
                            onNavigateTab('orders');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
