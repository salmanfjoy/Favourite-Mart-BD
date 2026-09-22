import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhatsAppWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickMessages = [
    { bn: 'আমি একটি প্রোডাক্ট অর্ডার করতে চাই', en: 'I want to place an order' },
    { bn: 'ক্যাশ অন ডেলিভারিতে কীভাবে নেব?', en: 'How does cash on delivery work?' },
    { bn: 'ডেলিভারি চার্জ এবং সময় কত?', en: 'What are delivery fees & times?' },
    { bn: 'পণ্য কি ১০০% অরিজিনাল?', en: 'Are your items 100% authentic?' },
  ];

  const handleSend = (text: string) => {
    const message = encodeURIComponent(text || 'Hello Favourite Mart BD, I would like to inquire about your products.');
    window.open(`https://wa.me/8801890000000?text=${message}`, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-[4.5rem] sm:bottom-6 right-3.5 sm:right-6 z-30 flex flex-col items-end pointer-events-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-88 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-left pointer-events-auto">
          
          {/* Header */}
          <div className="bg-[#083344] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#083344] rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Favourite Mart BD</h3>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ● {t('অনলাইনে একটিভ আছেন', 'Online & Ready to help')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F8FAFC] space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-slate-100 shadow-2xs text-xs text-[#083344] space-y-1">
              <p className="font-bold text-[#00829B]">{t('আসসালামু আলাইকুম!', 'Welcome to Favourite Mart BD!')}</p>
              <p className="text-slate-600">
                {t(
                  'Favourite Mart BD-তে আপনাকে স্বাগতম। আপনার অর্ডার বা কোনো তথ্যের জন্য নিচে ক্লিক করুন অথবা মেসেজ লিখুন:',
                  'How can we help you today? Choose a quick question below or type your message:'
                )}
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('সহজ প্রশ্ন বেছে নিন:', 'Quick Inquiries:')}
              </p>
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(t(msg.bn, msg.en))}
                  className="w-full p-2 bg-white hover:bg-[#F0FDFA] hover:text-[#00829B] hover:border-[#00829B]/30 border border-slate-200/80 rounded-xl text-xs font-semibold text-[#083344] text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{t(msg.bn, msg.en)}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-[#00829B] flex-shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(customMsg)}
              placeholder={t('আপনার প্রশ্ন লিখুন...', 'Type your question...')}
              className="flex-1 bg-[#F8FAFC] border border-slate-200 text-[#083344] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend(customMsg)}
              aria-label="Send message"
              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Trigger: Compact circular icon button on mobile, pill on desktop */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('হোয়াটসঅ্যাপ চ্যাট', 'WhatsApp Help')}
        className="pointer-events-auto relative flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/90 group"
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
        <span className="text-xs sm:text-sm font-bold hidden sm:inline-block ml-2">
          {t('হোয়াটসঅ্যাপ চ্যাট', 'WhatsApp Help')}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping hidden sm:inline-block ml-1" />
        
        {/* Mobile online status dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center sm:hidden shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </span>
      </button>
    </div>
  );
};
