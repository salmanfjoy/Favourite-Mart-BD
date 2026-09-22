import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShoppingCart,
  ShieldCheck,
  X
} from 'lucide-react';
import { Subscriber, UserProfile, Order } from '../../types';

interface AdminCustomersTabProps {
  subscribers: Subscriber[];
  users: UserProfile[];
  orders: Order[];
  onDeleteSubscriber?: (id: string) => Promise<void>;
  onRefreshData: () => Promise<void>;
  isRefreshing?: boolean;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  subscribers,
  users,
  orders,
  onDeleteSubscriber,
  onRefreshData,
  isRefreshing = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'subscribers'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Compute order counts for registered users
  const getUserOrderCount = (user: UserProfile) => {
    return orders.filter(
      (o) =>
        (o.userId && o.userId === user.uid) ||
        (user.phone && o.customerPhone === user.phone) ||
        (user.displayName && o.customerName.toLowerCase() === user.displayName.toLowerCase())
    ).length;
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const filteredSubscribers = subscribers.filter((s) =>
    s.contact?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleCopyAllContacts = () => {
    const contacts = subscribers.map((s) => s.contact).filter(Boolean).join(', ');
    navigator.clipboard.writeText(contacts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Contact', 'Source', 'Date Joined'],
      ...subscribers.map((s) => [
        s.id,
        s.contact,
        s.source || 'website_footer',
        s.createdAt || '',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#083344] flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Customers &amp; Subscribers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered customer accounts, order histories, and newsletter VIP subscriber list
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>

          {activeSubTab === 'subscribers' && subscribers.length > 0 && (
            <>
              <button
                onClick={handleCopyAllContacts}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Contacts'}
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1">
        <button
          onClick={() => {
            setActiveSubTab('users');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-[#083344] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Registered Users ({users.length})
        </button>

        <button
          onClick={() => {
            setActiveSubTab('subscribers');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'subscribers'
              ? 'bg-[#083344] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={
            activeSubTab === 'users'
              ? 'Search registered users by name, email, or phone...'
              : 'Search newsletter subscribers by email or phone...'
          }
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

      {/* VIEW 1: REGISTERED USERS TABLE */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No registered users found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'No registered users match your search query.'
                  : 'Customer accounts created on the site will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Phone / Address</th>
                    <th className="py-3.5 px-4">Join Date</th>
                    <th className="py-3.5 px-4 text-center">Orders Placed</th>
                    <th className="py-3.5 px-4 text-right">Account Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map((u) => {
                    const orderCount = getUserOrderCount(u);
                    const joinDateStr = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recently';

                    return (
                      <tr key={u.uid} className="hover:bg-slate-50/70 transition-colors">
                        {/* User Avatar + Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {u.photoURL ? (
                              <img
                                src={u.photoURL}
                                alt={u.displayName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center border border-slate-200">
                                {u.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-900">{u.displayName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                UID: {u.uid.slice(0, 10)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {u.email}
                        </td>

                        {/* Phone / Address */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">
                            {u.phone || 'No phone set'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {u.address || u.district || 'Address not added'}
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{joinDateStr}</span>
                          </div>
                        </td>

                        {/* Orders Placed */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            orderCount > 0
                              ? 'bg-teal-50 text-[#00829B] border border-teal-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            <ShoppingCart className="w-3 h-3" />
                            {orderCount} order(s)
                          </span>
                        </td>

                        {/* Account Type */}
                        <td className="py-3.5 px-4 text-right">
                          {u.role === 'admin' || u.email === 'salmanfjoyce@gmail.com' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                              Customer
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: NEWSLETTER SUBSCRIBERS TABLE */}
      {activeSubTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No subscribers found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'No subscribers match your search query.'
                  : 'Customers who join via the website footer newsletter will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Contact (Email / Phone)</th>
                    <th className="py-3.5 px-4">Channel Type</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Date Joined</th>
                    {onDeleteSubscriber && <th className="py-3.5 px-4 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSubscribers.map((sub) => {
                    const isEmail = sub.contact?.includes('@');
                    const dateStr = sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recent';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              {isEmail ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-semibold text-slate-900 font-mono text-xs">
                              {sub.contact}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                            {isEmail ? 'Email' : 'SMS'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-slate-600 capitalize">
                            {sub.source ? sub.source.replace('_', ' ') : 'Website Footer'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </td>

                        {onDeleteSubscriber && (
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Remove ${sub.contact} from subscriber list?`)) {
                                  setDeletingId(sub.id);
                                  try {
                                    await onDeleteSubscriber(sub.id);
                                  } finally {
                                    setDeletingId(null);
                                  }
                                }
                              }}
                              disabled={deletingId === sub.id}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
