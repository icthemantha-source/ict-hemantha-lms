import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const defaultText = language === 'si'
    ? 'ආයුබෝවන් හේමන්ත සර්, මට 6-11 ICT පන්ති පිළිබඳ තොරතුරු දැනගැනීමට අවශ්‍යයි.'
    : 'Hello Hemantha Sir, I would like to inquire about Grade 6-11 ICT classes.';

  const getWhatsAppUrl = () => {
    const textToSend = message.trim() || defaultText;
    return `https://wa.me/94772735518?text=${encodeURIComponent(textToSend)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Inquiry Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 border border-white/40 flex items-center justify-center">
                <img
                  src="/src/assets/images/instructor_hemantha_1794084339711.jpg"
                  alt="Hemantha Wanninayake B.Sc"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Hemantha Wanninayake B.Sc</h4>
                <p className="text-[11px] text-emerald-100">ICT Academy · Typically replies within 1 hour</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ECE5DD]/40 space-y-3 text-sm">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs text-slate-800 max-w-[85%] text-xs leading-relaxed">
              {language === 'si'
                ? 'ආයුබෝවන්! 2026 O/L සහ 6-11 ශ්‍රේණි ICT පන්ති වේලාවන් හෝ ලියාපදිංචිය පිළිබඳ ඕනෑම ගැටලුවක් සෘජුවම විමසන්න.'
                : 'Welcome to ICT Hemantha Academy! Feel free to ask about class schedules, Zoom links, or syllabus notes.'}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {language === 'si' ? 'ඔබගේ පණිවිඩය (WhatsApp):' : 'Your WhatsApp Message:'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={defaultText}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-[#25D366] resize-none"
              />
            </div>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-center"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'WhatsApp හරහා සම්බන්ධ වන්න' : 'Chat on WhatsApp (0772735518)'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/35 transition-all hover:scale-105 active:scale-95 focus:outline-hidden"
        aria-label="Open WhatsApp Support"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};
