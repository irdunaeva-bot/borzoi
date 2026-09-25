import { useState } from 'react';
import { Litter, Puppy, Dog } from '../../types/kennel';
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  Heart,
  Truck
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface PuppiesSectionProps {
  litters: Litter[];
  dogs: Dog[];
  onSelectPuppy: (puppy: Puppy) => void;
  onSelectPlannedLitter: (litter: Litter) => void;
  onOpenDogById: (dogId: string) => void;
  lang?: Language;
}

export function PuppiesSection({
  litters,
  dogs,
  onSelectPuppy,
  onSelectPlannedLitter,
  onOpenDogById,
  lang = 'ru',
}: PuppiesSectionProps) {
  const [filterSex, setFilterSex] = useState<'all' | 'male' | 'female'>('all');
  const t = TRANSLATIONS[lang].puppiesSection;

  const dogMap = new Map<string, Dog>();
  dogs.forEach((d) => dogMap.set(d.id, d));

  // Extract all active puppies across litters
  const activeLitters = litters.filter((l) => l.status === 'ready_for_new_home' || l.status === 'nursing');
  const plannedLitters = litters.filter((l) => l.status === 'planned');

  const allPuppies: { puppy: Puppy; litter: Litter }[] = [];
  activeLitters.forEach((litter) => {
    litter.puppies.forEach((puppy) => {
      allPuppies.push({ puppy, litter });
    });
  });

  const filteredPuppies = allPuppies.filter((item) => {
    if (filterSex === 'all') return true;
    return item.puppy.sex === filterSex;
  });

  return (
    <section id="puppies" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1: AVAILABLE PUPPIES FOR SALE */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              {t.subtitle}
            </div>
            <h2 className="font-serif-royal text-3xl sm:text-4xl font-bold text-stone-900">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              {t.description}
            </p>

            {/* Quick Filters */}
            <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-xl mt-4">
              <button
                onClick={() => setFilterSex('all')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterSex === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'en' ? 'All Puppies' : 'Все щенки'} ({allPuppies.length})
              </button>
              <button
                onClick={() => setFilterSex('male')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterSex === 'male'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'en' ? 'Males' : 'Кобели'}
              </button>
              <button
                onClick={() => setFilterSex('female')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filterSex === 'female'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'en' ? 'Females' : 'Суки'}
              </button>
            </div>
          </div>

          {/* Puppies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuppies.map(({ puppy, litter }) => {
              const isAvailable = puppy.status === 'available';
              const isReserved = puppy.status === 'reserved';
              const displayName = lang === 'en' && puppy.registeredNameEn ? puppy.registeredNameEn : puppy.registeredName;
              const displayColor = lang === 'en' && puppy.colorEn ? puppy.colorEn : puppy.color;
              const displayTemperament = lang === 'en' && puppy.temperamentEn ? puppy.temperamentEn : puppy.temperament;
              const displayFeatures = lang === 'en' && puppy.featuresEn ? puppy.featuresEn : puppy.features;

              return (
                <div
                  key={puppy.id}
                  className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Photo */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                    <img
                      src={puppy.photoUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md">
                      {puppy.sex === 'male' ? (lang === 'en' ? 'Male' : 'Кобель') : (lang === 'en' ? 'Female' : 'Сука')} · {displayColor}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isAvailable ? (
                        <span className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                          {t.availableStatus}
                        </span>
                      ) : isReserved ? (
                        <span className="bg-amber-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                          {t.reservedStatus}
                        </span>
                      ) : (
                        <span className="bg-stone-700 text-stone-200 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                          {t.kennelStatus}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-stone-950/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs">
                      {lang === 'en' ? 'Collar' : 'Ошейник'}: {puppy.collarColor}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-stone-500 mb-1">
                        {lang === 'en' ? `Litter «${litter.letter}» · Born:` : `Помет «${litter.letter}» · Рождение:`} {new Date(litter.birthDate).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU')}
                      </div>
                      <h3 className="font-serif-royal text-xl font-bold text-stone-900">
                        {displayName}
                      </h3>
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                        {displayTemperament}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5">
                      {displayFeatures.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="bg-white border border-stone-200 text-stone-700 text-[11px] px-2 py-0.5 rounded"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Parents link */}
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="text-[10px] text-stone-500 font-semibold uppercase">{t.litterParents}:</div>
                      <div className="truncate text-stone-800">
                        <span className="text-stone-500">{lang === 'en' ? 'Sire' : 'Отец'}:</span>{' '}
                        <button
                          onClick={() => onOpenDogById(litter.sireId)}
                          className="font-medium text-amber-900 hover:underline cursor-pointer"
                        >
                          {litter.sireName}
                        </button>
                      </div>
                      <div className="truncate text-stone-800">
                        <span className="text-stone-500">{lang === 'en' ? 'Dam' : 'Мать'}:</span>{' '}
                        <button
                          onClick={() => onOpenDogById(litter.damId)}
                          className="font-medium text-amber-900 hover:underline cursor-pointer"
                        >
                          {litter.damName}
                        </button>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase">{t.price}</div>
                        <div className="font-serif-royal font-bold text-stone-900 text-lg">
                          {puppy.priceEur ? `€${puppy.priceEur.toLocaleString('en-US')}` : (lang === 'en' ? 'On request' : 'По запросу')}
                          {puppy.priceGbp ? (
                            <span className="text-xs text-stone-500 font-sans ml-1">
                              (£{puppy.priceGbp.toLocaleString('en-US')})
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {isAvailable ? (
                        <button
                          onClick={() => onSelectPuppy(puppy)}
                          className="py-2 px-4 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t.btnReserve}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectPuppy(puppy)}
                          className="py-2 px-3 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          {lang === 'en' ? 'View Details' : 'Узнать о щенке'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: PLANNED LITTERS */}
        {plannedLitters.length > 0 && (
          <div className="pt-8 border-t border-stone-200">
            <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
              <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                {lang === 'en' ? 'Breeding Planning' : 'Селекционные планы'}
              </div>
              <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
                {lang === 'en' ? 'Planned Matings & Upcoming Litters' : 'Планируемые вязки и пометы'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                {lang === 'en' 
                  ? 'Early reservations for selective litters from champion parents with full genetic health clearances.' 
                  : 'Заблаговременное бронирование щенков от лучших племенных пар с проверенным здоровьем.'}
              </p>
            </div>

            <div className="space-y-6">
              {plannedLitters.map((litter) => {
                const sireDog = dogMap.get(litter.sireId);
                const damDog = dogMap.get(litter.damId);
                const displayDesc = lang === 'en' && litter.descriptionEn ? litter.descriptionEn : litter.description;

                return (
                  <div
                    key={litter.id}
                    className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-2xs space-y-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
                          <Sparkles className="w-4 h-4 text-amber-700" />
                          <span>
                            {lang === 'en' 
                              ? `Litter «${litter.letter}» Announcement · Expected Autumn 2026` 
                              : `Анонс помета «${litter.letter}» · Ожидается осенью 2026`}
                          </span>
                        </div>
                        <h4 className="font-serif-royal text-2xl font-bold text-stone-900 mt-1">
                          {litter.sireName} × {litter.damName}
                        </h4>
                      </div>

                      <button
                        onClick={() => onSelectPlannedLitter(litter)}
                        className="py-2.5 px-5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
                      >
                        {t.btnPlannedReserve}
                      </button>
                    </div>

                    {/* Parents Visual Match */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sire */}
                      <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-4">
                        {sireDog?.photoUrl && (
                          <img
                            src={sireDog.photoUrl}
                            alt={sireDog.registeredName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase font-semibold">
                            {lang === 'en' ? 'Sire of Litter' : 'Отец помета'}
                          </div>
                          <div className="font-serif-royal font-bold text-stone-900 text-sm">{litter.sireName}</div>
                          <div className="text-xs text-stone-600">
                            DM: <span className="font-mono font-medium text-emerald-800">{sireDog?.genetics.dm.code || 'N/N'}</span> · {sireDog?.color}
                          </div>
                        </div>
                      </div>

                      {/* Dam */}
                      <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-4">
                        {damDog?.photoUrl && (
                          <img
                            src={damDog.photoUrl}
                            alt={damDog.registeredName}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase font-semibold">
                            {lang === 'en' ? 'Dam of Litter' : 'Мать помета'}
                          </div>
                          <div className="font-serif-royal font-bold text-stone-900 text-sm">{litter.damName}</div>
                          <div className="text-xs text-stone-600">
                            DM: <span className="font-mono font-medium text-emerald-800">{damDog?.genetics.dm.code || 'N/N'}</span> · {damDog?.color}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-700 leading-relaxed bg-white/70 p-4 rounded-xl border border-amber-100">
                      {displayDesc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Guarantee Banner (Europe & UK compliant) */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h5 className="font-serif-royal font-bold text-lg text-white">
                {t.healthGuaranteeTitle}
              </h5>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {t.healthGuaranteeText}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileCheck2 className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h5 className="font-serif-royal font-bold text-lg text-white">
                {t.documentsTitle}
              </h5>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {t.documentsText}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h5 className="font-serif-royal font-bold text-lg text-white">
                {t.deliveryTitle}
              </h5>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {t.deliveryText}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
