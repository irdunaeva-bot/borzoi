import { useState } from 'react';
import { Exhibition, ExhibitionAward, Dog } from '../../types/kennel';
import { Trophy, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface ShowsSectionProps {
  exhibitions: Exhibition[];
  awards: ExhibitionAward[];
  dogs: Dog[];
  onOpenDogById: (dogId: string) => void;
  lang?: Language;
}

export function ShowsSection({
  exhibitions,
  awards,
  dogs,
  onOpenDogById,
  lang = 'ru',
}: ShowsSectionProps) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const t = TRANSLATIONS[lang].showsSection;

  const upcomingShows = exhibitions.filter((e) => e.status === 'upcoming');
  const pastShows = exhibitions.filter((e) => e.status === 'completed');

  const dogMap = new Map<string, Dog>();
  dogs.forEach((d) => dogMap.set(d.id, d));

  return (
    <section id="shows" className="py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

          {/* Tab Selector */}
          <div className="inline-flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl mt-4">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                tab === 'upcoming'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.tabUpcoming} ({upcomingShows.length})</span>
            </button>
            <button
              onClick={() => setTab('past')}
              className={`px-5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                tab === 'past'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.tabPast} ({pastShows.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: UPCOMING SHOWS */}
        {tab === 'upcoming' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {upcomingShows.map((show) => {
              const displayName = lang === 'en' && show.nameEn ? show.nameEn : show.name;
              const displayDesc = lang === 'en' && show.descriptionEn ? show.descriptionEn : show.description;

              return (
                <div
                  key={show.id}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:border-amber-300 transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-1">
                        <span className="bg-amber-100 px-2.5 py-0.5 rounded text-amber-950">
                          {show.rank}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {show.city}, {show.country}
                        </span>
                      </div>
                      <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-stone-900">
                        {displayName}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xs text-stone-500">{lang === 'en' ? 'Date' : 'Дата проведения'}</div>
                      <div className="font-serif-royal font-bold text-stone-900 text-lg">
                        {new Date(show.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                    <div className="space-y-1">
                      <div className="font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                        {t.organizer} & {t.judge}:
                      </div>
                      <div>{show.organizer}</div>
                      <div className="text-stone-500 italic">
                        {show.judges.join(', ')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                        {t.participatingDogs}:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {show.registeredDogIds.map((dogId) => {
                          const dog = dogMap.get(dogId);
                          const dogCall = lang === 'en' && dog?.callNameEn ? dog.callNameEn : dog?.callName;
                          const dogName = lang === 'en' && dog?.registeredNameEn ? dog.registeredNameEn : dog?.registeredName;

                          return dog ? (
                            <button
                              key={dogId}
                              onClick={() => onOpenDogById(dogId)}
                              className="bg-stone-50 hover:bg-amber-100/70 border border-stone-200 text-amber-950 font-medium px-2 py-0.5 rounded text-xs transition-colors cursor-pointer"
                            >
                              {dogCall} ({dogName})
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  {displayDesc && (
                    <p className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      {displayDesc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: PAST SHOWS & AWARDS */}
        {tab === 'past' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {pastShows.map((show) => {
              const showAwards = awards.filter((a) => a.exhibitionId === show.id);
              const displayName = lang === 'en' && show.nameEn ? show.nameEn : show.name;
              const displaySummary = lang === 'en' && show.resultsSummaryEn ? show.resultsSummaryEn : show.resultsSummary;

              return (
                <div
                  key={show.id}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <div className="text-xs text-stone-500 mb-0.5">
                        {new Date(show.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU')} · {show.city}, {show.country} · {show.rank}
                      </div>
                      <h3 className="font-serif-royal text-2xl font-bold text-stone-900">
                        {displayName}
                      </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto">
                      {lang === 'en' ? 'Completed' : 'Завершена'}
                    </span>
                  </div>

                  {displaySummary && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 font-medium leading-relaxed flex items-start gap-2.5">
                      <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>{displaySummary}</div>
                    </div>
                  )}

                  {/* Individual Dog Awards Breakdown */}
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                      {t.results}:
                    </div>

                    {showAwards.map((award) => {
                      const displayCritique = lang === 'en' && award.critiqueEn ? award.critiqueEn : award.critique;

                      return (
                        <div
                          key={award.id}
                          className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              onClick={() => onOpenDogById(award.dogId)}
                              className="font-serif-royal font-bold text-stone-900 text-base hover:text-amber-900 hover:underline cursor-pointer"
                            >
                              {award.dogName}
                            </button>
                            <div className="text-stone-500">
                              {t.judge}: <span className="font-medium text-stone-800">{award.judge}</span>
                            </div>
                          </div>

                          {/* Certificates row */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {award.certificates.map((cert, cIdx) => (
                              <span
                                key={cIdx}
                                className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                {cert}
                              </span>
                            ))}
                          </div>

                          {displayCritique && (
                            <div className="text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 italic">
                              "{displayCritique}"
                            </div>
                          )}
                        </div>
                      );
                    })}
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
