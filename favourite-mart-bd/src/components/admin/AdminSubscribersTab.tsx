import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Copy, 
  Check, 
  Calendar, 
  Mail, 
  Phone, 
  Trash2, 
  RefreshCw,
  Download
} from 'lucide-react';
import { Subscriber } from '../../types';

interface AdminSubscribersTabProps {
  subscribers: Subscriber[];
  onDeleteSubscriber?: (id: string) => Promise<void>;
  onRefreshSubscribers: () => Promise<void>;
  isRefreshing?: boolean;
}

export const AdminSubscribersTab: React.FC<AdminSubscribersTabProps> = ({
  subscribers,
  onDeleteSubscriber,
  onRefreshSubscribers,
  isRefreshing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSubscribers = subscribers.filter((s) =>
    s.contact?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleCopyAll = () => {
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
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#083344] flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Newsletter Subscribers ({subscribers.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customers registered for VIP offers, promo vouchers and product drops
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefreshSubscribers}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {subscribers.length > 0 && (
            <>
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy All Contacts'}
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

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by phone number or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00829B]"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No subscribers found</h4>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'No contacts match your search query.' : 'Customers who enter their email/phone in the website footer will show here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Source Channel</th>
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
                          {isEmail ? 'Email' : 'Mobile SMS'}
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
    </div>
  );
};
