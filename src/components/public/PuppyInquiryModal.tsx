import { useState } from 'react';
import { Puppy, Litter } from '../../types/kennel';
import { X, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { KennelLogo } from '../common/KennelLogo';
import { KENNEL_BRAND } from '../../assets/logo';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface PuppyInquiryModalProps {
  puppy?: Puppy | null;
  litter?: Litter | null;
  onClose: () => void;
  lang?: Language;
}

export function PuppyInquiryModal({ puppy, litter, onClose, lang = 'ru' }: PuppyInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const t = TRANSLATIONS[lang].inquiry;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    purpose: t.purposeOptions[0],
    experience: t.experienceOptions[2],
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const puppyName = puppy ? (lang === 'en' && puppy.registeredNameEn ? puppy.registeredNameEn : puppy.registeredName) : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-stone-950 text-amber-50 px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <KennelLogo size="sm" showText={false} />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                {KENNEL_BRAND.name} · {KENNEL_BRAND.subName}
              </span>
              <h3 className="font-serif-royal text-xl font-bold text-white">
                {puppy 
                  ? (lang === 'en' ? `Puppy Reservation: ${puppyName}` : `Заявка на щенка: ${puppyName}`)
                  : (lang === 'en' ? 'Puppy Inquiry & Reservation Waitlist' : 'Бронирование щенка / Лист ожидания')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-200 hover:text-white rounded-full hover:bg-amber-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif-royal text-2xl font-bold text-stone-900">
                {t.successTitle}
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                {t.successText}
              </p>
              <div className="text-xs bg-amber-50 text-amber-950 p-3 rounded-xl border border-amber-200">
                {t.deliveryNote}
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-amber-950 text-white rounded-lg text-sm font-medium hover:bg-stone-900 transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close & Return to Kennel' : 'Вернуться к просмотру'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {puppy && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3">
                  <img
                    src={puppy.photoUrl}
                    alt={puppyName}
                    className="w-14 h-14 rounded-lg object-cover border border-stone-200"
                  />
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">{puppyName}</div>
                    <div className="text-stone-500">
                      {lang === 'en' ? 'Sex' : 'Пол'}: {puppy.sex === 'male' ? (lang === 'en' ? 'Male' : 'Кобель') : (lang === 'en' ? 'Female' : 'Сука')} · {lang === 'en' ? 'Color' : 'Окрас'}: {lang === 'en' && puppy.colorEn ? puppy.colorEn : puppy.color}
                      {puppy.priceEur && (
                        <span className="font-semibold text-amber-900 ml-1.5">
                          €{puppy.priceEur.toLocaleString('en-US')} {puppy.priceGbp ? `(£${puppy.priceGbp.toLocaleString('en-US')})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  {t.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t.phoneLabel} *</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-hidden text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t.cityLabel} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t.cityPlaceholder}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-hidden text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t.purposeLabel}</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs font-medium"
                  >
                    {t.purposeOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">{t.experienceLabel}</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs font-medium"
                  >
                    {t.experienceOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">{t.messageLabel}</label>
                <textarea
                  rows={3}
                  placeholder={t.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-hidden text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitBtn}</span>
              </button>

              <div className="text-[11px] text-stone-500 text-center">
                {t.deliveryNote}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
