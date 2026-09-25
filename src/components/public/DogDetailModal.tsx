import { useState } from 'react';
import { Dog, ExhibitionAward } from '../../types/kennel';
import { PedigreeTree } from './PedigreeTree';
import { KennelLogo } from '../common/KennelLogo';
import { KENNEL_BRAND } from '../../assets/logo';
import { 
  X, 
  Trophy, 
  ShieldCheck, 
  Award, 
  Compass, 
  Sparkles,
  FileCheck,
  Dna
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface DogDetailModalProps {
  dog: Dog | null;
  allDogs: Dog[];
  awards: ExhibitionAward[];
  onClose: () => void;
  onSelectDog: (dog: Dog) => void;
  onRequestPuppy?: () => void;
  lang?: Language;
}

export function DogDetailModal({
  dog,
  allDogs,
  awards,
  onClose,
  onSelectDog,
  onRequestPuppy,
  lang = 'ru',
}: DogDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pedigree' | 'awards' | 'genetics'>('overview');
  const t = TRANSLATIONS[lang].modal;

  if (!dog) return null;

  const dogAwards = awards.filter((a) => a.dogId === dog.id);
  const displayName = lang === 'en' && dog.registeredNameEn ? dog.registeredNameEn : dog.registeredName;
  const displayCallName = lang === 'en' && dog.callNameEn ? dog.callNameEn : dog.callName;
  const displayColor = lang === 'en' && dog.colorEn ? dog.colorEn : dog.color;
  const displayDesc = lang === 'en' && dog.descriptionEn ? dog.descriptionEn : dog.description;
  const titlesList = (lang === 'en' && dog.titlesEn && dog.titlesEn.length > 0) ? dog.titlesEn : dog.titles;
  const huntingList = (lang === 'en' && dog.huntingDiplomasEn && dog.huntingDiplomasEn.length > 0) ? dog.huntingDiplomasEn : dog.huntingDiplomas;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium tracking-wider uppercase">
              <span>{dog.sex === 'male' ? (lang === 'en' ? 'Male (Sire)' : 'Кобель (Sire)') : (lang === 'en' ? 'Female (Dam)' : 'Сука (Dam)')}</span>
              <span>·</span>
              <span>FCI / KC: {dog.rkfNumber}</span>
              <span>·</span>
              <span>{lang === 'en' ? 'Tattoo / Tattoo' : 'Клеймо'}: {dog.tattooNumber}</span>
            </div>
            <h3 className="font-serif-royal text-2xl font-bold text-white tracking-wide mt-0.5">
              {displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 flex gap-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'en' ? 'Profile & Conformation' : 'Профиль и экстерьер'}
          </button>

          <button
            onClick={() => setActiveTab('pedigree')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pedigree'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.tabPedigree}
          </button>

          <button
            onClick={() => setActiveTab('awards')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'awards'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            {lang === 'en' ? `Shows & Diplomas (${dogAwards.length})` : `Выставки и дипломы (${dogAwards.length})`}
          </button>

          <button
            onClick={() => setActiveTab('genetics')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'genetics'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Dna className="w-4 h-4" />
            {t.tabGenetics}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Visuals & Basic Info */}
              <div className="space-y-4">
                <div className="aspect-4/3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs">
                  <img
                    src={dog.photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Additional gallery thumbnails */}
                {dog.galleryUrls && dog.galleryUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {dog.galleryUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden border border-stone-200 cursor-pointer hover:opacity-85 transition-opacity"
                      >
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Physical Conformation stats */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-center">
                  <div>
                    <span className="text-stone-500 block">{lang === 'en' ? 'Call Name' : 'Домашнее имя'}</span>
                    <span className="font-bold text-stone-900 text-sm">{displayCallName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'en' ? 'Height at Withers' : 'Рост в холке'}</span>
                    <span className="font-bold text-stone-900 text-sm">{dog.heightCm} cm</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'en' ? 'Coat Color' : 'Окрас'}</span>
                    <span className="font-bold text-stone-900 text-sm">{displayColor}</span>
                  </div>
                </div>

                {/* Passport & Microchip details */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.regNumber}:</span>
                    <span className="font-bold text-stone-900">{dog.rkfNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.chip}:</span>
                    <span className="text-stone-800">{dog.chipNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.tattoo}:</span>
                    <span className="text-stone-800">{dog.tattooNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t.owner}:</span>
                    <span className="text-stone-800">{dog.owner.name} ({dog.owner.city}, {dog.owner.country || 'Europe'})</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Titles, Description & Health Summary */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    {lang === 'en' ? 'Conformation & Breeding Description' : 'Породное описание экспертов'}
                  </h4>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {displayDesc}
                  </p>
                </div>

                {/* Titles Breakdown */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    {lang === 'en' ? 'Official European & UK Titles' : 'Официальные титулы FCI & Crufts'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {titlesList.map((title, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-amber-50/60 border border-amber-200/70 p-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                        <span className="font-medium">{title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Field & Coursing Diplomas */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" />
                    {lang === 'en' ? 'Field & Lure Coursing Certificates' : 'Рабочие охотничьи и беговые дипломы'}
                  </h4>
                  <div className="space-y-1.5">
                    {huntingList.map((dip, idx) => (
                      <div key={idx} className="text-xs bg-emerald-50 text-emerald-900 px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium">{dip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Health Summary */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {lang === 'en' ? 'Genetic Health Status (DM):' : 'Генетическое здоровье DM:'}
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {dog.genetics.dm.code} ({dog.genetics.dm.status === 'clean' ? (lang === 'en' ? 'Clear' : 'Здоров/Чист') : (lang === 'en' ? 'Carrier' : 'Носитель')})
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'en' 
                      ? `Certified by ${dog.genetics.dm.laboratory || 'Laboklin Germany / UK'}. Cardiac Doppler: ${dog.genetics.dcm.status === 'clear' ? 'Normal / Clear' : dog.genetics.dcm.status}.`
                      : `Сертифицирован лабораторией ${dog.genetics.dm.laboratory || 'Laboklin Germany / UK'}. ЭхоКГ сердца: ${dog.genetics.dcm.status === 'clear' ? 'Чисто (Норма)' : dog.genetics.dcm.status}.`}
                  </p>
                </div>

                {onRequestPuppy && (
                  <button
                    onClick={onRequestPuppy}
                    className="w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-950 text-amber-50 font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {lang === 'en' ? 'Inquire about puppies from this dog' : 'Узнать о планируемых щенках от этой собаки'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pedigree' && (
            <div className="space-y-4">
              <PedigreeTree
                dog={dog}
                allDogs={allDogs}
                onSelectDog={onSelectDog}
                lang={lang}
              />
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="space-y-4">
              <h4 className="font-serif-royal text-xl font-bold text-stone-900">
                {lang === 'en' ? 'Championship Rings & Judge Critiques' : 'Летопись выставочных побед и экспертных оценок'}
              </h4>
              {dogAwards.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-sm">
                  {lang === 'en' ? 'Archived show records being updated.' : 'Для данной собаки ведутся внесения архивных выставочных протоколов.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {dogAwards.map((award) => {
                    const displayCritique = lang === 'en' && award.critiqueEn ? award.critiqueEn : award.critique;

                    return (
                      <div
                        key={award.id}
                        className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-amber-300 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2 mb-2">
                          <div>
                            <span className="text-xs text-stone-500">
                              {new Date(award.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU')} · {award.city}
                            </span>
                            <h5 className="font-serif-royal font-bold text-stone-900 text-base">
                              {award.exhibitionName}
                            </h5>
                          </div>
                          <div className="text-right text-xs">
                            <span className="text-stone-500">{lang === 'en' ? 'Judge' : 'Судья'}:</span>{' '}
                            <span className="font-medium text-stone-800">{award.judge}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 my-2">
                          {award.certificates.map((cert, cIdx) => (
                            <span
                              key={cIdx}
                              className="bg-amber-100/70 border border-amber-200 text-amber-950 font-medium text-xs px-2.5 py-0.5 rounded"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>

                        {displayCritique && (
                          <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-200/80 italic">
                            "{displayCritique}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'genetics' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-1">
                <div className="font-semibold text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  {lang === 'en' ? 'Breeding Clearance & Health Standard (FCI / Europe)' : 'Племенной допуск и соответствие стандарту здоровья'}
                </div>
                <p className="text-emerald-800">
                  {lang === 'en'
                    ? 'All kennel breeding stock undergoes mandatory DNA testing for Degenerative Myelopathy (DM N/N), regular cardiovascular screening (Echo Doppler) and eye exams (ECVO).'
                    : 'Все производители питомника проходят обязательное ДНК-тестирование на дегенеративную миелопатию (DM), регулярный кардиоскрининг (ЭхоКГ / Допплер) и проверку глаз (ECVO).'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* DM Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">{lang === 'en' ? 'Degenerative Myelopathy (DM, SOD1)' : 'Дегенеративная миелопатия (DM, SOD1)'}</span>
                    <span className="px-2 py-0.5 font-mono font-bold text-xs bg-emerald-100 text-emerald-800 rounded">
                      {dog.genetics.dm.code}
                    </span>
                  </div>
                  <div className="text-stone-600">
                    {lang === 'en' ? 'Status' : 'Статус'}: <span className="font-medium text-stone-900">{dog.genetics.dm.status === 'clean' ? (lang === 'en' ? 'Clear / Normal (N/N)' : 'Свободен / Чист (N/N)') : (lang === 'en' ? 'Carrier (N/DM)' : 'Носитель (N/DM)')}</span>
                  </div>
                  {dog.genetics.dm.certificateNumber && (
                    <div className="text-stone-500 text-[11px]">
                      {lang === 'en' ? 'Certificate No.' : 'Сертификат №'} {dog.genetics.dm.certificateNumber} ({dog.genetics.dm.laboratory || 'Laboklin Germany / UK'})
                    </div>
                  )}
                </div>

                {/* DCM Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">{lang === 'en' ? 'Cardiology (DCM Screening)' : 'Кардиология (DCM Screening)'}</span>
                    <span className="px-2 py-0.5 font-bold text-xs bg-emerald-100 text-emerald-800 rounded">
                      {dog.genetics.dcm.status === 'clear' ? (lang === 'en' ? 'Clear (Normal)' : 'Чисто (Норма)') : dog.genetics.dcm.status}
                    </span>
                  </div>
                  <div className="text-stone-600">{dog.genetics.dcm.verdict}</div>
                  {dog.genetics.dcm.dopplerDate && (
                    <div className="text-stone-500 text-[11px]">
                      {lang === 'en' ? 'Exam Date' : 'Дата обследования'}: {dog.genetics.dcm.dopplerDate} ({dog.genetics.dcm.clinic})
                    </div>
                  )}
                </div>

                {/* MH Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">{lang === 'en' ? 'Malignant Hyperthermia (MH, RYR1)' : 'Злокачественная гипертермия (MH, RYR1)'}</span>
                    <span className="px-2 py-0.5 font-mono font-bold text-xs bg-emerald-100 text-emerald-800 rounded">
                      {dog.genetics.mh.code}
                    </span>
                  </div>
                  <div className="text-stone-600">
                    {lang === 'en' ? 'Status: Free from anesthesia intolerance' : 'Статус: Свободен от непереносимости наркоза'}
                  </div>
                </div>

                {/* Coat Genetics */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                  <span className="font-semibold text-stone-800">{lang === 'en' ? 'Coat Color Loci Genetics' : 'Локусы окрасов псовины'}</span>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                    <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                      <div className="text-[10px] text-stone-500">E-locus</div>
                      <div className="font-bold text-stone-800">{dog.genetics.coat_genetics.e_locus}</div>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                      <div className="text-[10px] text-stone-500">K-locus</div>
                      <div className="font-bold text-stone-800">{dog.genetics.coat_genetics.k_locus}</div>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                      <div className="text-[10px] text-stone-500">A-locus</div>
                      <div className="font-bold text-stone-800">{dog.genetics.coat_genetics.a_locus}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-stone-600">
            <KennelLogo size="xs" showText={false} />
            <span>
              {lang === 'en' ? 'Russian Borzoi Kennel' : 'Питомник Русских Псовых Борзых'} <strong>«{KENNEL_BRAND.name}»</strong> ({KENNEL_BRAND.subName}) · FCI
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
