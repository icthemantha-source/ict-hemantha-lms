import React, { useState } from 'react';
import { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Download, 
  Building,
  Smartphone,
  Lock,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayHereModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PayHereModal: React.FC<PayHereModalProps> = ({ course, isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { addPayment } = useData();
  const { language } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState<'payhere_online' | 'bank_transfer' | 'cash'>('payhere_online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<any | null>(null);

  // Bank Transfer Fields
  const [bankRef, setBankRef] = useState('');
  const [bankName, setBankName] = useState('Bank of Ceylon');

  if (!isOpen) return null;

  const handleOnlinePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const payment = addPayment({
        studentId: currentUser?.id || 'guest',
        studentName: currentUser?.fullName || 'Enrolled Student',
        studentIdentifier: currentUser?.studentId || 'STU-2026',
        grade: course.grade,
        courseTitle: course.title,
        amountLkr: course.monthlyFeeLkr,
        paymentMethod: 'payhere_online',
        referenceNumber: 'PH-TX-' + Math.floor(100000 + Math.random() * 900000),
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'paid',
        notes: 'PayHere Online verified automated transaction.'
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setCompletedReceipt(payment);
      setIsProcessing(false);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleBankSubmit = () => {
    if (!bankRef.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const payment = addPayment({
        studentId: currentUser?.id || 'guest',
        studentName: currentUser?.fullName || 'Enrolled Student',
        studentIdentifier: currentUser?.studentId || 'STU-2026',
        grade: course.grade,
        courseTitle: course.title,
        amountLkr: course.monthlyFeeLkr,
        paymentMethod: 'bank_transfer',
        referenceNumber: `${bankName} - ${bankRef}`,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: 'Bank slip reference submitted for admin verification.'
      });

      setCompletedReceipt(payment);
      setIsProcessing(false);
      if (onSuccess) onSuccess();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B1F4A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-[#F58220]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {language === 'si' ? 'පාඨමාලා ගෙවීම සහ ලියාපදිංචිය' : 'Course Enrollment & Payment'}
              </h3>
              <p className="text-xs text-slate-300">Grade {course.grade} ICT · Verified Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {completedReceipt ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#0B1F4A]">
                  {completedReceipt.status === 'paid' ? 'Enrollment Activated!' : 'Payment Slip Received!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {completedReceipt.status === 'paid' 
                    ? 'Your access to Grade ' + course.grade + ' ICT lessons, notes, and exams is now unlocked.'
                    : 'Our admin team will review your deposit and verify activation within a few hours.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-mono font-bold text-slate-800">{completedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-800">{completedReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-semibold text-slate-800">Grade {course.grade} ICT</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-700">Amount Paid:</span>
                  <span className="text-[#2563A6] text-sm">LKR {completedReceipt.amountLkr.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#F58220] hover:bg-[#e07519] text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Start Learning Now
                </button>
              </div>
            </div>
          ) : (
            /* Payment Flow */
            <>
              {/* Course Summary Card */}
              <div className="bg-[#EAF3FC] border border-[#2563A6]/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#0B1F4A] text-sm">{course.title}</h4>
                  <p className="text-xs text-[#2563A6] mt-0.5">Instructor: {course.instructorName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Monthly Fee</span>
                  <span className="text-xl font-extrabold text-[#0B1F4A]">
                    LKR {course.monthlyFeeLkr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payhere_online')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'payhere_online'
                        ? 'border-[#F58220] bg-orange-50/50 ring-2 ring-[#F58220]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <CreditCard className="w-5 h-5 text-[#F58220]" />
                      <span className="text-[10px] font-bold bg-[#F58220] text-white px-1.5 py-0.5 rounded">Instant</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold text-xs text-slate-900 block">PayHere Online</span>
                      <span className="text-[11px] text-slate-500">Cards, FriMi, Genie, eZ Cash</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#2563A6] bg-blue-50/50 ring-2 ring-[#2563A6]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#2563A6]" />
                    <div className="mt-2">
                      <span className="font-bold text-xs text-slate-900 block">Bank Transfer</span>
                      <span className="text-[11px] text-slate-500">BOC, Commercial, Sampath</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* PayHere Details */}
              {paymentMethod === 'payhere_online' ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Supported Methods:</span>
                    <span className="font-medium text-slate-800">Visa · Mastercard · FriMi · eZ Cash</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Payment Gateway:</span>
                    <span className="font-semibold text-[#2563A6]">PayHere Sri Lanka (Sandbox Live)</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>256-Bit SSL Encrypted. No card details are stored directly on our servers.</span>
                  </div>

                  <button
                    disabled={isProcessing}
                    onClick={handleOnlinePay}
                    className="w-full mt-2 py-3 px-4 bg-[#F58220] hover:bg-[#e07519] disabled:opacity-75 text-white font-bold rounded-xl shadow-md shadow-[#F58220]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to PayHere...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Pay LKR {course.monthlyFeeLkr.toLocaleString()} via PayHere</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Bank Deposit Details */
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="space-y-1.5 p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px]">
                    <div className="text-slate-600"><span className="font-bold text-slate-800">Bank:</span> Bank of Ceylon (BOC)</div>
                    <div className="text-slate-600"><span className="font-bold text-slate-800">Account Name:</span> Hemantha Wanninayake</div>
                    <div className="text-slate-600"><span className="font-bold text-slate-800">Account No:</span> 84729104</div>
                    <div className="text-slate-600"><span className="font-bold text-slate-800">Branch:</span> Kurunegala City Branch</div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Select Bank Deposited To:</label>
                      <select 
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                      >
                        <option value="Bank of Ceylon">Bank of Ceylon (BOC)</option>
                        <option value="Commercial Bank">Commercial Bank</option>
                        <option value="Sampath Bank">Sampath Bank</option>
                        <option value="Hatton National Bank">Hatton National Bank (HNB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Deposit Slip Reference / Transaction ID:
                      </label>
                      <input
                        type="text"
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                        placeholder="e.g. TX-991823 or Slip Number"
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <button
                      disabled={isProcessing || !bankRef.trim()}
                      onClick={handleBankSubmit}
                      className="w-full mt-2 py-2.5 px-4 bg-[#2563A6] hover:bg-[#1d4f85] disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Reference...</span>
                        </>
                      ) : (
                        <span>Submit Bank Deposit Reference</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
