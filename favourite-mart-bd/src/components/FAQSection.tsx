import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  RotateCcw, 
  CreditCard,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      questionBn: 'পেমেন্টের কী কী মাধ্যম রয়েছে? (What payment methods do you accept?)',
      questionEn: 'What payment methods do you accept?',
      answerBn: 'আমরা ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ), বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), এবং ভিসা/মাস্টারকার্ডসহ সকল প্রধান কার্ড ও মোবাইল ব্যাংকিং সাপোর্ট করি। কোনো হিডেন চার্জ নেই।',
      answerEn: 'We accept Cash on Delivery (COD), bKash, Nagad, Rocket, as well as all major Visa and Mastercard debit and credit cards. There are no hidden transaction fees.',
      icon: CreditCard,
    },
    {
      questionBn: 'আমার অর্ডার কীভাবে ট্র্যাক করব? (How to track order?)',
      questionEn: 'How can I track my order?',
      answerBn: 'অর্ডার কনফার্মেশনের সাথে সাথেই আপনি এসএমএসের মাধ্যমে একটি ইউনিক ট্র্যাকিং আইডি পাবেন। আমাদের ওয়েবসাইটের ওপরের মেন্যু থেকে "Track Order" বাটনে ক্লিক করে ট্র্যাকিং আইডি দিয়ে যেকোনো সময় রিয়েল-টাইম ডেলিভারি স্ট্যাটাস দেখতে পারবেন।',
      answerEn: 'Upon confirming your order, you receive a tracking ID via SMS. Simply click "Track Order" in the top navigation or footer, enter your ID or phone number, and see live real-time courier updates.',
      icon: Truck,
    },
    {
      questionBn: 'আপনাদের রিটার্ন ও এক্সচেঞ্জ পলিসি কী? (What is your return policy?)',
      questionEn: 'What is your return & exchange policy?',
      answerBn: 'আমাদের রয়েছে সহজ ৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট পলিসি। ডেলিভারি পাওয়ার পর পণ্যটিতে কোনো ত্রুটি থাকলে বা প্রত্যাশা অনুযায়ী না হলে আমাদের হটলাইন 01890-000000 নম্বরে যোগাযোগ করলে আমরা দ্রুত এক্সচেঞ্জ বা সম্পূর্ণ রিফান্ডের ব্যবস্থা করি।',
      answerEn: 'We offer a hassle-free 7-day return and replacement policy. If your product is damaged, defective, or incorrect upon delivery, call our helpline at 01890-000000 for prompt exchange or full refund.',
      icon: RotateCcw,
    },
    {
      questionBn: 'আপনারা কি আন্তর্জাতিকভাবে পণ্য ডেলিভারি করেন? (Do you ship internationally?)',
      questionEn: 'Do you ship internationally?',
      answerBn: 'বর্তমানে আমরা বাংলাদেশের সকল ৬৪টি জেলায় অত্যন্ত দ্রুততম সময়ে হোম ডেলিভারি সেবা দিয়ে আসছি। আন্তর্জাতিক অর্ডারের ক্ষেত্রে বিশেষ অনুরোধে ডিএইচএল/ফেডেক্স কুরিয়ারের মাধ্যমে ডেলিভারি করা সম্ভব। বিস্তারিত জানতে সাপোর্টে নক করুন।',
      answerEn: 'Currently, our primary service covers nationwide fast home delivery to all 64 districts in Bangladesh. For special international shipments via DHL/FedEx, please contact our support team directly.',
      icon: HelpCircle,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-[#F8FAFC] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDFA] text-[#00829B] text-xs font-bold uppercase tracking-wider border border-[#00829B]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('সচরাচর জিজ্ঞাসিত প্রশ্নাবলী', 'Frequently Asked Questions')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#083344] tracking-tight">
            {t('গ্রাহকদের সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)', 'Customer FAQs & Support')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('অর্ডার, ডেলিভারি ও ওয়ারেন্টি সম্পর্কিত যেকোনো তথ্য সহজে জেনে নিন', 'Everything you need to know about ordering, delivery, and warranty')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#00829B]/40"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3.5 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-[#F0FDFA] text-[#00829B]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#083344]">
                      {t(faq.questionBn, faq.questionEn)}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#00829B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in-50 duration-200">
                    <p className="pl-11">{t(faq.answerBn, faq.answerEn)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Banner */}
        <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#00829B] flex items-center justify-center font-bold flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#083344]">
                {t('আরো কিছু জানার আছে?', 'Still have questions?')}
              </h4>
              <p className="text-xs text-slate-400">
                {t('আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে সরাসরি কথা বলুন', 'Talk directly with our friendly support team in Dhaka')}
              </p>
            </div>
          </div>

          <a
            href="tel:+8801890000000"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#083344] hover:bg-[#00829B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('কল করুন: 01890-000000', 'Call: 01890-000000')}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
