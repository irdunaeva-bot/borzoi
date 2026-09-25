import { useState } from 'react';
import { Database, Menu, X, Globe } from 'lucide-react';
import { KennelLogo } from '../common/KennelLogo';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface PublicHeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onSwitchToAdmin: () => void;
  onSwitchToSchema: () => void;
  availablePuppiesCount: number;
  lang: Language;
  onToggleLang: (lang: Language) => void;
}

export function PublicHeader({
  currentSection,
  onNavigate,
  onSwitchToAdmin,
  onSwitchToSchema,
  availablePuppiesCount,
  lang,
  onToggleLang,
}: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'dogs', label: t.nav.dogs, count: null },
    { id: 'puppies', label: t.nav.puppies, count: availablePuppiesCount },
    { id: 'shows', label: t.nav.shows, count: null },
    { id: 'about', label: t.nav.about, count: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Kennel Branding with Logo */}
          <div 
            onClick={() => onNavigate('hero')}
            className="cursor-pointer"
          >
            <KennelLogo size="md" showText={true} textColor="dark" lang={lang} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentSection === item.id
                    ? 'text-amber-900 font-semibold border-b-2 border-amber-900'
                    : 'hover:text-stone-900 border-b-2 border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Mode Switchers & Language Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-stone-300 p-0.5 bg-stone-100 text-xs font-semibold shadow-2xs">
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English version"
              >
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('ru')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
                  lang === 'ru'
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Переключить на русскую версию"
              >
                <span>RU</span>
              </button>
            </div>

            <button
              onClick={onSwitchToSchema}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 hover:border-stone-400 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title={lang === 'en' ? 'Open Database Architecture (ERD)' : 'Открыть архитектуру базы данных (ERD)'}
            >
              <Database className="w-3.5 h-3.5 text-stone-500" />
              <span>{lang === 'en' ? 'ERD Schema' : 'Концепция БД'}</span>
            </button>

            <button
              onClick={onSwitchToAdmin}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Breeding Database' : 'Племенная база'}</span>
              <span className="text-[9px] bg-amber-800 px-1 py-0.5 rounded uppercase font-bold tracking-wider">
                L1
              </span>
            </button>
          </div>

          {/* Mobile Menu & Language Switcher */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center rounded-lg border border-stone-300 p-0.5 bg-stone-100 text-xs font-semibold">
              <button
                onClick={() => onToggleLang('en')}
                className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-amber-900 text-white font-bold' : 'text-stone-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => onToggleLang('ru')}
                className={`px-2 py-0.5 rounded ${lang === 'ru' ? 'bg-amber-900 text-white font-bold' : 'text-stone-600'}`}
              >
                RU
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onSwitchToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-amber-900 rounded-lg text-center"
              >
                {lang === 'en' ? 'Breeding Database (Level 1)' : 'Племенная база данных (Уровень 1)'}
              </button>
              <button
                onClick={() => {
                  onSwitchToSchema();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs text-stone-700 border border-stone-300 rounded-lg text-center"
              >
                {lang === 'en' ? 'Database ERD Architecture & SQL' : 'Концепция и Схема БД (ERD & SQL)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
