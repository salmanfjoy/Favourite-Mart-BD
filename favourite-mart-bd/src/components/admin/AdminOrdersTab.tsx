import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ChevronDown, 
  Eye, 
  Phone, 
  MapPin, 
  CreditCard,
  Calendar,
  X,
  RefreshCw,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../types';
import { SafeImage } from '../SafeImage';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
  onRefreshOrders: () => Promise<void>;
  isRefreshing?: boolean;
  selectedOrderProp?: Order | null;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'paid', label: 'Paid', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { value: 'processing', label: 'Processing', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateStatus,
  onRefreshOrders,
  isRefreshing = false,
  selectedOrderProp = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(selectedOrderProp);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (o.trackingCode && o.trackingCode.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q));

    const matchesStatus = 
      statusFilter === 'all' || 
      o.status === statusFilter || 
      (statusFilter === 'paid' && (o.status === 'paid' || o.status === 'confirmed'));

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || {
      label: status,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${opt.color} capitalize`}>
        {opt.label}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Action and Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#083344] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#00829B]" />
            Customer Orders ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time customer orders synced directly with Firestore
          </p>
        </div>

        <button
          onClick={onRefreshOrders}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Quick Status Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          Pending ({orders.filter((o) => o.status === 'pending').length})
        </button>

        <button
          onClick={() => setStatusFilter('paid')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'paid'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Paid ({orders.filter((o) => o.status === 'paid' || o.status === 'confirmed').length})
        </button>

        <button
          onClick={() => setStatusFilter('shipped')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'shipped'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          Shipped ({orders.filter((o) => o.status === 'shipped').length})
        </button>

        <button
          onClick={() => setStatusFilter('delivered')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'delivered'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Delivered ({orders.filter((o) => o.status === 'delivered').length})
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'cancelled'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          Cancelled ({orders.filter((o) => o.status === 'cancelled').length})
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, order ID, tracking code, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00829B]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No orders found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'No orders match your search and filter criteria.'
                : 'Customer orders placed on the website will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((ord) => {
                  const isUpdating = updatingId === ord.id;
                  const dateStr = ord.createdAt 
                    ? new Date(ord.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recent';

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Order ID / Tracking */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#00829B]">
                        #{ord.trackingCode || ord.id.slice(0, 8)}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]" title={ord.customerAddress}>
                          {ord.district || 'Dhaka'}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <a href={`tel:${ord.customerPhone}`} className="hover:text-[#00829B] hover:underline">
                          {ord.customerPhone}
                        </a>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">
                          {ord.items?.length || 0} item(s)
                        </span>
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#083344] text-xs sm:text-sm">
                          ৳{ord.totalAmount?.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          {ord.paymentMethod || 'COD'}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            disabled={isUpdating}
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00829B] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {isUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00829B]" />}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* View Details Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
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

      {/* Order Full Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Overview</span>
                <h3 className="text-base font-extrabold text-[#083344]">
                  #{selectedOrder.trackingCode || selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block">Current Status</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <label className="text-slate-500 font-medium block mb-1">Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00829B] cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#00829B]" /> Customer & Delivery Address
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <strong className="text-slate-900">{selectedOrder.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone Number:</span>
                    <a href={`tel:${selectedOrder.customerPhone}`} className="text-[#00829B] font-bold">
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Full Address:</span>
                    <span className="text-slate-900 text-right max-w-[220px]">{selectedOrder.customerAddress}</span>
                  </div>
                  {selectedOrder.district && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">District:</span>
                      <span className="text-slate-900">{selectedOrder.district}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking Code:</span>
                    <span className="text-slate-900 font-mono font-bold">{selectedOrder.trackingCode || selectedOrder.id}</span>
                  </div>
                  {selectedOrder.note && (
                    <div className="pt-2 mt-2 border-t border-slate-200/60">
                      <span className="text-slate-500 block mb-0.5">Special Instructions / Note:</span>
                      <span className="italic text-slate-800 bg-white p-2 rounded-lg border border-slate-200 block">
                        "{selectedOrder.note}"
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#00829B]" /> Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Qty: {item.quantity} × ৳{item.price?.toLocaleString()}
                            {item.color && ` • Color: ${item.color}`}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        ৳{(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>৳{selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span>+৳{selectedOrder.deliveryCharge?.toLocaleString() || 0}</span>
                </div>
                {Number(selectedOrder.discount) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span>-৳{selectedOrder.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#083344] pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-[#00829B]">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Method:</span>
                  <span className="uppercase font-bold text-slate-800">{selectedOrder.paymentMethod || 'COD'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
