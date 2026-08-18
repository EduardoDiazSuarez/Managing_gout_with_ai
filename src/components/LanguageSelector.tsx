import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../i18n/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="language_selector_container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
        id="btn_language_selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-sans">{currentLang.label}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-1.5 w-40 rounded-2xl shadow-lg bg-white border border-slate-100 ring-1 ring-black/5 focus:outline-hidden z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {t('app.languageSelect', 'Language')}
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold cursor-pointer text-left transition ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="menuitem"
                id={`lang_option_${item.code}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-blue-600 font-bold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
