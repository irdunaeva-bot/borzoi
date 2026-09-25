import { useState } from 'react';
import { Dog, Litter, Exhibition, ExhibitionAward, Puppy } from '../../types/kennel';
import { DogRegistry } from './DogRegistry';
import { BreedingCompatibilityTool } from './BreedingCompatibilityTool';
import { GeneticsManager } from './GeneticsManager';
import { LitterManager } from './LitterManager';
import { ExhibitionManager } from './ExhibitionManager';
import { KennelLogo } from '../common/KennelLogo';
import { KENNEL_BRAND } from '../../assets/logo';
import { 
  Database, 
  Dna, 
  Trophy, 
  Baby, 
  Compass, 
  LayoutDashboard, 
  ArrowLeft, 
  ShieldCheck, 
  FileSpreadsheet,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  dogs: Dog[];
  litters: Litter[];
  exhibitions: Exhibition[];
  awards: ExhibitionAward[];
  onAddDog: (dog: Dog) => void;
  onUpdateDog: (dog: Dog) => void;
  onDeleteDog: (dogId: string) => void;
  onSelectDog: (dog: Dog) => void;
  onUpdateLitter: (litter: Litter) => void;
  onAddLitter: (litter: Partial<Litter>) => void;
  onAddExhibition: (exhibition: Exhibition) => void;
  onAddAward: (award: ExhibitionAward) => void;
  onSwitchToPublic: () => void;
  onSwitchToSchema: () => void;
}

export function AdminDashboard({
  dogs,
  litters,
  exhibitions,
  awards,
  onAddDog,
  onUpdateDog,
  onDeleteDog,
  onSelectDog,
  onUpdateLitter,
  onAddLitter,
  onAddExhibition,
  onAddAward,
  onSwitchToPublic,
  onSwitchToSchema,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'registry' | 'compatibility' | 'genetics' | 'litters' | 'shows'
  >('overview');

  const breedingMales = dogs.filter((d) => d.sex === 'male' && d.status === 'breeding').length;
  const breedingFemales = dogs.filter((d) => d.sex === 'female' && d.status === 'breeding').length;
  
  // Puppies count
  let availablePuppies = 0;
  litters.forEach((l) => {
    l.puppies.forEach((p) => {
      if (p.status === 'available') availablePuppies++;
    });
  });

  const upcomingShows = exhibitions.filter((e) => e.status === 'upcoming');
  const dmCleanCount = dogs.filter((d) => d.genetics.dm.code === 'N/N').length;
  const dmCleanPercent = Math.round((dmCleanCount / dogs.length) * 100);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900">
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToPublic}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
              title="Перейти на публичный сайт"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Публичный портал</span>
            </button>

            <div className="h-5 w-px bg-stone-700 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <KennelLogo size="xs" showText={false} />
              <div className="flex items-center gap-2">
                <span className="font-serif-royal font-bold text-lg sm:text-xl text-amber-200">
                  {KENNEL_BRAND.name}
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800/80 px-2 py-0.5 rounded font-mono uppercase font-semibold">
                  Уровень 1: База данных ({KENNEL_BRAND.subName})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToSchema}
              className="px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Схема & Архитектура БД (ERD)</span>
              <span className="sm:hidden">Схема БД</span>
            </button>
            <button
              onClick={onSwitchToPublic}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              Сайт питомника →
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="bg-stone-950/80 border-t border-stone-800 px-4 sm:px-8 flex gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Сводка и метрики</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'registry'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Племенная книга ({dogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compatibility')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'compatibility'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Совместимость вязок & Fx</span>
          </button>

          <button
            onClick={() => setActiveTab('genetics')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'genetics'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Генетические паспорта</span>
          </button>

          <button
            onClick={() => setActiveTab('litters')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'litters'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Пометы & Щенки ({litters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shows')}
            className={`py-2.5 px-3.5 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'shows'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Выставки & Награды</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setActiveTab('registry')}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-semibold text-stone-500 uppercase">Всего собак в базе</div>
                <div className="font-serif-royal text-3xl font-bold text-stone-900">{dogs.length}</div>
                <div className="text-[11px] text-stone-500">
                  {breedingMales} кобелей · {breedingFemales} сук
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('genetics')}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-semibold text-stone-500 uppercase">DM N/N Чистые</div>
                <div className="font-serif-royal text-3xl font-bold text-emerald-700">{dmCleanPercent}%</div>
                <div className="text-[11px] text-stone-500">
                  {dmCleanCount} из {dogs.length} протестированы
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('litters')}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-semibold text-stone-500 uppercase">Щенков на продажу</div>
                <div className="font-serif-royal text-3xl font-bold text-amber-900">{availablePuppies}</div>
                <div className="text-[11px] text-stone-500">
                  В активных пометах
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('shows')}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-semibold text-stone-500 uppercase">Предстоящие выставки</div>
                <div className="font-serif-royal text-3xl font-bold text-sky-900">{upcomingShows.length}</div>
                <div className="text-[11px] text-stone-500">
                  Ближайшая: «Crufts 2026 (Birmingham UK)»
                </div>
              </div>
            </div>

            {/* Quick Actions & Shortcut Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Shortcut to Genetic Compatibility Tool */}
              <div className="bg-gradient-to-br from-amber-950 to-stone-900 text-white rounded-2xl p-6 shadow-md space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Dna className="w-4 h-4" />
                    <span>Флагманский инструмент зоотехника</span>
                  </div>
                  <h3 className="font-serif-royal text-2xl font-bold text-white">
                    Калькулятор генетической совместимости вязок
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                    Подберите пару «Кобель × Сука» и рассчитайте в реальном времени риск Дегенеративной миелопатии (DM), коэффициент инбридинга Райта по общим предкам и вероятности окрасов щенков.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-amber-200/80">
                    Автоматическая блокировка опасных сочетаний (N/DM × N/DM)
                  </span>
                  <button
                    onClick={() => setActiveTab('compatibility')}
                    className="py-2 px-4 bg-amber-800 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Запустить расчет →
                  </button>
                </div>
              </div>

              {/* Upcoming Show Reminder */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ближайший выставочный ринг</span>
                  </div>
                  <h3 className="font-serif-royal text-2xl font-bold text-stone-900">
                    {upcomingShows[0]?.name || 'Интернациональная выставка собак CACIB'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2">
                    Дата: <strong>{new Date(upcomingShows[0]?.date || '2026-10-18').toLocaleDateString('ru-RU')}</strong> · Город: {upcomingShows[0]?.city} · Ранг: {upcomingShows[0]?.rank}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Заявлено борзых: {upcomingShows[0]?.registeredDogIds.length || 3} собаки
                  </span>
                  <button
                    onClick={() => setActiveTab('shows')}
                    className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Открыть ринги →
                  </button>
                </div>
              </div>

            </div>

            {/* Recent Litters Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Baby className="w-5 h-5 text-amber-700" />
                  Текущие пометы питомника
                </h3>
                <button
                  onClick={() => setActiveTab('litters')}
                  className="text-xs text-amber-900 font-semibold hover:underline"
                >
                  Все пометы ({litters.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {litters.map((litter) => (
                  <div key={litter.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">Помет «{litter.letter}»</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        litter.status === 'ready_for_new_home' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {litter.status === 'ready_for_new_home' ? 'Готовы к переезду' : 'Планируется'}
                      </span>
                    </div>

                    <div className="font-serif-royal font-bold text-stone-900 text-sm">
                      {litter.sireName} × {litter.damName}
                    </div>

                    <div className="text-stone-500">
                      Щенков в помете: <strong>{litter.puppies.length}</strong> · Инбридинг: <strong>{litter.inbreedingCoeff}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'registry' && (
          <DogRegistry
            dogs={dogs}
            onAddDog={onAddDog}
            onUpdateDog={onUpdateDog}
            onDeleteDog={onDeleteDog}
            onSelectDog={onSelectDog}
          />
        )}

        {activeTab === 'compatibility' && (
          <BreedingCompatibilityTool
            dogs={dogs}
            onAddLitter={onAddLitter}
          />
        )}

        {activeTab === 'genetics' && (
          <GeneticsManager
            dogs={dogs}
            onUpdateDog={onUpdateDog}
          />
        )}

        {activeTab === 'litters' && (
          <LitterManager
            litters={litters}
            dogs={dogs}
            onUpdateLitter={onUpdateLitter}
            onAddLitter={onAddLitter}
          />
        )}

        {activeTab === 'shows' && (
          <ExhibitionManager
            exhibitions={exhibitions}
            awards={awards}
            dogs={dogs}
            onAddExhibition={onAddExhibition}
            onAddAward={onAddAward}
          />
        )}
      </main>
    </div>
  );
}
