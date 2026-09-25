import { MapPin, Phone, Mail, Award, ShieldCheck, Heart } from 'lucide-react';
import { KennelLogo } from '../common/KennelLogo';
import { KENNEL_BRAND } from '../../assets/logo';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface PublicFooterProps {
  onNavigateSection: (section: string) => void;
  onOpenInquiry: () => void;
  lang?: Language;
}

export function PublicFooter({ onNavigateSection, onOpenInquiry, lang = 'ru' }: PublicFooterProps) {
  const t = TRANSLATIONS[lang].footer;

  return (
    <footer id="about" className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-2">
            <KennelLogo size="md" showText={true} textColor="light" lang={lang} />

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-lg">
              {t.aboutText}
            </p>

            <div className="flex items-center gap-6 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DM N/N Clear</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>FCI Standard #193</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{KENNEL_BRAND.motto}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif-royal text-lg font-bold text-white tracking-wider">
              {t.navigation}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('dogs')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Our Borzois (Sires & Dams)' : 'Наши борзые (Кобели и суки)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('puppies')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Puppies for Reservation' : 'Щенки для продажи и резерва'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('shows')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'European Shows & Crufts' : 'Календарь выставок Европы & Crufts'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenInquiry}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Submit Puppy Inquiry' : 'Оставить заявку на щенка'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-3">
            <h4 className="font-serif-royal text-lg font-bold text-white tracking-wider">
              {lang === 'en' ? 'Kennel Contacts' : 'Контакты питомника'}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">{t.address}</div>
                  <div className="text-[11px] text-stone-500">{t.addressNote}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+421948123456" className="hover:text-white transition-colors">
                  {t.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${t.email}`} className="hover:text-white transition-colors">
                  {t.email}
                </a>
              </div>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-800">
                {lang === 'en'
                  ? 'FCI Registered Kennel · SKJ Slovakia & UK Sighthound Association'
                  : 'Официальная регистрация FCI · SKJ Словакия & Ассоциация борзых Великобритании'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} {KENNEL_BRAND.name} ({KENNEL_BRAND.subName}). {t.copyright}
          </div>
          <div className="flex items-center gap-4">
            <span>FCI Standard #193</span>
            <span>·</span>
            <span>European & UK Borzoi Bloodlines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
