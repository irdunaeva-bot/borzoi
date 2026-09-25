import { useState } from 'react';
import { Dog } from '../../types/kennel';
import { Trophy, Dna, Compass, Sparkles, Search } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface OurDogsSectionProps {
  dogs: Dog[];
  onOpenDog: (dog: Dog) => void;
  lang?: Language;
}

export function OurDogsSection({ dogs, onOpenDog, lang = 'ru' }: OurDogsSectionProps) {
  const [filterSex, setFilterSex] = useState<'all' | 'male' | 'female' | 'veteran'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[lang].dogsSection;

  // Only display current kennel dogs (exclude retired ancestors unless veteran)
  const currentDogs = dogs.filter((d) => d.status !== 'retired');

  const filteredDogs = currentDogs.filter((dog) => {
    const matchesSex =
      filterSex === 'all'
        ? true
        : filterSex === 'veteran'
        ? dog.status === 'veteran'
        : dog.sex === filterSex && dog.status !== 'veteran';

    const matchesSearch =
      dog.registeredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.callName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dog.registeredNameEn && dog.registeredNameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dog.callNameEn && dog.callNameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dog.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.rkfNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSex && matchesSearch;
  });

  return (
    <section id="dogs" className="py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterSex('all')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterSex === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterAll} ({currentDogs.length})
            </button>
            <button
              onClick={() => setFilterSex('male')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterSex === 'male'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterMales}
            </button>
            <button
              onClick={() => setFilterSex('female')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterSex === 'female'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterFemales}
            </button>
            <button
              onClick={() => setFilterSex('veteran')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterSex === 'veteran'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filterVeterans}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Dogs Grid */}
        {filteredDogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
            {lang === 'en' ? 'No dogs matched your search criteria.' : 'По заданным критериям поиска собаки не найдены.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDogs.map((dog) => {
              const displayName = lang === 'en' && dog.registeredNameEn ? dog.registeredNameEn : dog.registeredName;
              const displayCallName = lang === 'en' && dog.callNameEn ? dog.callNameEn : dog.callName;
              const displayColor = lang === 'en' && dog.colorEn ? dog.colorEn : dog.color;
              const displayDesc = lang === 'en' && dog.descriptionEn ? dog.descriptionEn : dog.description;
              const primaryTitle = (lang === 'en' && dog.titlesEn && dog.titlesEn[0]) ? dog.titlesEn[0] : dog.titles[0];
              const primaryDiploma = (lang === 'en' && dog.huntingDiplomasEn && dog.huntingDiplomasEn[0]) ? dog.huntingDiplomasEn[0] : dog.huntingDiplomas[0];

              return (
                <div
                  key={dog.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
                >
                  {/* Image Box with genuine Russian Borzoi */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={dog.photoUrl}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                      {dog.sex === 'male' ? (lang === 'en' ? 'Male (Sire)' : 'Кобель') : (lang === 'en' ? 'Female (Dam)' : 'Сука')} · {dog.heightCm} {t.height}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 text-[11px] font-mono px-2 py-0.5 rounded-md font-medium">
                      DM: {dog.genetics.dm.code}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-gradient-to-t from-stone-950/85 to-transparent p-2 rounded text-white text-xs">
                      {lang === 'en' ? 'Call Name' : 'Домашнее имя'}: <span className="font-semibold text-amber-200">{displayCallName}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-stone-500 mb-1">
                        {dog.rkfNumber} · {displayColor}
                      </div>
                      <h3 
                        onClick={() => onOpenDog(dog)}
                        className="font-serif-royal text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors cursor-pointer line-clamp-1"
                      >
                        {displayName}
                      </h3>
                      <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    {/* Top Title Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                      {primaryTitle && (
                        <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                          <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{primaryTitle}</span>
                        </div>
                      )}
                      {primaryDiploma && (
                        <div className="flex items-center gap-1.5 text-emerald-800 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{primaryDiploma}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onOpenDog(dog)}
                        className="flex-1 py-2 px-3 bg-stone-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.btnPedigree}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
