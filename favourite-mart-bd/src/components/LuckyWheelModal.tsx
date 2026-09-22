import React, { useState } from 'react';
import { X, Sparkles, Gift, Check, ArrowRight, RotateCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string, discountAmount: number) => void;
}

const PRIZES = [
  { label: '৳150 ছাড়', labelEn: '৳150 Off', code: 'FAV150', amount: 150, color: '#00829B', textColor: '#ffffff' },
  { label: 'ফ্রি ডেলিভারি', labelEn: 'Free Delivery', code: 'FREESHIP', amount: 60, color: '#083344', textColor: '#ffffff' },
  { label: '৳100 ছাড়', labelEn: '৳100 Off', code: 'FAV100', amount: 100, color: '#00A3C4', textColor: '#ffffff' },
  { label: '৳200 ভাউচার', labelEn: '৳200 Voucher', code: 'VIP200', amount: 200, color: '#0E4B5B', textColor: '#ffffff' },
  { label: '১০% অফার', labelEn: '10% Discount', code: 'MART10', amount: 180, color: '#00829B', textColor: '#ffffff' },
  { label: '৳120 ক্যাশব্যাক', labelEn: '৳120 Cashback', code: 'FAV120', amount: 120, color: '#00A3C4', textColor: '#ffffff' },
];

// Simple synthesized Web Audio chime for joyful interaction
const playChimeSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    // ignore audio block
  }
};

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
}) => {
  const { t, language } = useLanguage();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof PRIZES[0] | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);
    setCopied(false);

    // Pick a random prize
    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[randomIndex];

    // Segment angle = 360 / 6 = 60 deg
    const segmentAngle = 360 / PRIZES.length;
    // Calculate final rotation to point the selected segment to the top indicator
    const extraRounds = 5 * 360; // 5 full spins
    const targetOffset = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const newRotation = rotation + extraRounds + targetOffset - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(selectedPrize);
      playChimeSound();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00829B', '#00A3C4', '#083344', '#F59E0B'],
      });
    }, 3800);
  };

  const handleCopyAndApply = () => {
    if (!wonPrize) return;
    navigator.clipboard?.writeText(wonPrize.code);
    setCopied(true);
    onApplyCoupon(wonPrize.code, wonPrize.amount);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative transform rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-md border border-[#ECFEFF] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#083344] via-[#004D61] to-[#00829B] text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-cyan-300">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {t('লাকি স্পিন হুইল', 'Lucky Spin & Win')}
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              </h3>
              <p className="text-[11px] text-cyan-100 font-medium">
                {t('স্পিন করে আকর্ষণীয় ডিসকাউন্ট ভাউচার জিতুন!', 'Spin to win exclusive shopping vouchers!')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-cyan-100 hover:text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wheel Body */}
        <div className="p-6 text-center space-y-6 bg-gradient-to-b from-[#F0FDFA] to-white">
          
          {/* Wheel Stage */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            
            {/* Pointer / Needle at Top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#083344] filter drop-shadow-md" />

            {/* Rotating SVG Wheel */}
            <div
              className="w-60 h-60 rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform duration-[3800ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {PRIZES.map((prize, idx) => {
                  const angle = 360 / PRIZES.length;
                  const startAngle = idx * angle;
                  const endAngle = startAngle + angle;
                  const x1 = 100 + 100 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 100 + 100 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 100 + 100 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 100 + 100 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                  const midAngle = startAngle + angle / 2;

                  return (
                    <g key={idx}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Text in sector */}
                      <text
                        x="100"
                        y="45"
                        fill={prize.textColor}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        transform={`rotate(${midAngle}, 100, 100)`}
                      >
                        {language === 'bn' ? prize.label : prize.labelEn}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Spin Hub */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#083344] text-white font-extrabold text-xs shadow-lg flex flex-col items-center justify-center border-2 border-white cursor-pointer transition-transform hover:scale-105 active:scale-95 z-10 ${
                spinning ? 'opacity-80 pointer-events-none' : ''
              }`}
            >
              <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
              <span className="text-[10px] mt-0.5">{spinning ? '...' : t('স্পিন', 'SPIN')}</span>
            </button>
          </div>

          {/* Outcome / Result Announcement */}
          {wonPrize ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in zoom-in-95 duration-200 space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-sm">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>{t('অভিনন্দন! আপনি জিতেছেন:', 'Congratulations! You won:')}</span>
              </div>
              <p className="text-lg font-black text-[#00829B]">
                {language === 'bn' ? wonPrize.label : wonPrize.labelEn}
              </p>
              
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs text-slate-500">{t('কুপন কোড:', 'Coupon Code:')}</span>
                <span className="px-2.5 py-1 bg-white border border-emerald-300 font-mono font-bold text-xs text-[#083344] rounded-lg">
                  {wonPrize.code}
                </span>
              </div>

              <button
                onClick={handleCopyAndApply}
                className="w-full mt-2 py-2.5 bg-[#00829B] hover:bg-[#006C82] text-white font-bold text-xs rounded-xl transition-all shadow-primary-glow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{copied ? t('কুপন অ্যাপ্লাই করা হয়েছে!', 'Coupon Applied!') : t('কপি করে অর্ডারে ব্যবহার করুন', 'Copy & Apply Discount')}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full py-3 bg-[#00829B] hover:bg-[#006C82] text-white font-bold text-sm rounded-2xl transition-all shadow-primary-glow flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              >
                <Sparkles className="w-4 h-4" />
                <span>{spinning ? t('হুইল ঘুরছে...', 'Spinning Wheel...') : t('স্পিন করে অফার জিতুন', 'Spin the Wheel Now')}</span>
              </button>
              <p className="text-[11px] text-[#64748B]">
                {t('প্রতিটি স্পিনে রয়েছে নিশ্চিত গিফট ও ডিসকাউন্ট ভাউচার', 'Guaranteed instant voucher on every lucky spin')}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
