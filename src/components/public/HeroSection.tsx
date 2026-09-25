import { Trophy, ShieldCheck, Heart, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { KennelLogo } from '../common/KennelLogo';
import { KENNEL_BRAND } from '../../assets/logo';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface HeroSectionProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenDog: (dogId: string) => void;
  availablePuppiesCount: number;
  lang: Language;
}

export function HeroSection({
  onNavigateSection,
  onOpenDog,
  availablePuppiesCount,
  lang,
}: HeroSectionProps) {
  const t = TRANSLATIONS[lang].hero;

  return (
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Background with real Russian Borzoi Hero Photo */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('/borzoi_hero.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/65 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-300 text-xs tracking-wider uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.badge}</span>
            </div>

            <h1 className="font-serif-royal text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.15]">
              {t.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              {t.subtitle}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80 text-stone-300 text-xs">
              <div>
                <div className="font-serif-royal text-2xl font-bold text-amber-300">14+</div>
                <div className="text-stone-400">{t.yearsBreeding}</div>
              </div>
              <div>
                <div className="font-serif-royal text-2xl font-bold text-amber-300">C.I.B.</div>
                <div className="text-stone-400">{t.interchampions}</div>
              </div>
              <div>
                <div className="font-serif-royal text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-stone-400">{t.dnaControl}</div>
              </div>
              <div>
                <div className="font-serif-royal text-2xl font-bold text-amber-300">{KENNEL_BRAND.motto}</div>
                <div className="text-stone-400">{t.mottoLabel}</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateSection('puppies')}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.ctaPuppies}</span>
                {availablePuppiesCount > 0 && (
                  <span className="bg-amber-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {availablePuppiesCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateSection('dogs')}
                className="px-6 py-3 bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{t.ctaDogs}</span>
              </button>

              <button
                onClick={() => onNavigateSection('shows')}
                className="px-6 py-3 bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{t.ctaShows}</span>
              </button>
            </div>
          </div>

          {/* Right Logo Emblem Showcase */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-stone-950/70 border border-amber-900/40 rounded-3xl backdrop-blur-md shadow-2xl space-y-4 max-w-xs text-center shrink-0">
            <KennelLogo size="xl" showText={false} lang={lang} />
            <div>
              <div className="font-serif-royal text-2xl font-bold text-amber-200 tracking-wide">
                {KENNEL_BRAND.name}
              </div>
              <div className="text-xs text-amber-500/90 font-medium tracking-wider uppercase mt-0.5">
                {KENNEL_BRAND.subName}
              </div>
              <div className="text-[11px] text-stone-400 mt-2 font-mono">
                {lang === 'en' ? 'Motto' : 'Девиз'}: {KENNEL_BRAND.motto}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {KENNEL_BRAND.country}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
