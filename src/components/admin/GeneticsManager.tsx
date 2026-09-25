import { useState } from 'react';
import { Dog } from '../../types/kennel';
import { ShieldCheck, Dna, AlertCircle, Heart, FileCheck, Search, Filter } from 'lucide-react';

interface GeneticsManagerProps {
  dogs: Dog[];
  onUpdateDog: (dog: Dog) => void;
}

export function GeneticsManager({ dogs, onUpdateDog }: GeneticsManagerProps) {
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<'dm' | 'dcm' | 'coat'>('dm');

  const totalDogs = dogs.length;
  const dmCleanCount = dogs.filter((d) => d.genetics.dm.code === 'N/N').length;
  const dmCarrierCount = dogs.filter((d) => d.genetics.dm.code === 'N/DM').length;
  const dcmClearCount = dogs.filter((d) => d.genetics.dcm.status === 'clear').length;

  const dmCleanPercent = Math.round((dmCleanCount / totalDogs) * 100);
  const dmCarrierPercent = Math.round((dmCarrierCount / totalDogs) * 100);

  const filteredDogs = dogs.filter((d) =>
    d.registeredName.toLowerCase().includes(search.toLowerCase()) ||
    d.callName.toLowerCase().includes(search.toLowerCase()) ||
    d.rkfNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-800 mb-1">
          <Dna className="w-4 h-4 text-emerald-700" />
          <span>Генетический регистр и сертификация здоровья</span>
        </div>
        <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
          Учет ДНК-анализов и локусов борзых
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Мониторинг генетических маркеров дегенеративной миелопатии (SOD1), кардиоскрининга (DCM), злокачественной гипертермии (MH) и локусов окраса псовины.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* DM Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 uppercase">DM SOD1 Здоровье</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {dmCleanPercent}% Чистые
            </span>
          </div>
          <div className="font-serif-royal text-3xl font-bold text-stone-900">
            {dmCleanCount} <span className="text-sm font-sans font-normal text-stone-500">/ {totalDogs} собак</span>
          </div>
          <div className="text-xs text-stone-500">
            Носителей мутации (N/DM): <strong className="text-amber-800">{dmCarrierCount}</strong> · Больных (DM/DM): <strong className="text-emerald-700">0</strong>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${dmCleanPercent}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${dmCarrierPercent}%` }} />
          </div>
        </div>

        {/* DCM Cardio Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 uppercase">ЭхоКГ / Допплер сердца</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-serif-royal text-3xl font-bold text-stone-900">
            {dcmClearCount} <span className="text-sm font-sans font-normal text-stone-500">/ {totalDogs} с допуском</span>
          </div>
          <p className="text-xs text-stone-500">
            Все активные производители проходят ежегодный кардиомониторинг в сертифицированных клиниках.
          </p>
        </div>

        {/* Breeding rule */}
        <div className="bg-emerald-950 text-emerald-50 p-5 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Золотое правило селекции</span>
          </div>
          <div className="font-serif-royal text-lg font-bold text-white leading-snug">
            Носитель вяжется исключительно с чистым партнером (N/DM × N/N)
          </div>
          <p className="text-[11px] text-emerald-300/80">
            Такая схема гарантирует рождение 0% больных потомков и сохраняет ценнейший генетический пул старинных линий.
          </p>
        </div>
      </div>

      {/* Switcher & Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setSelectedDisease('dm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDisease === 'dm'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Дегенеративная миелопатия (DM)
            </button>
            <button
              onClick={() => setSelectedDisease('dcm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDisease === 'dcm'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Кардиоскрининг (DCM)
            </button>
            <button
              onClick={() => setSelectedDisease('coat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDisease === 'coat'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Локусы окрасов (E, K, A)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск собаки..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Собака</th>
                <th className="py-3 px-3">Пол</th>
                {selectedDisease === 'dm' && (
                  <>
                    <th className="py-3 px-3">Генотип DM</th>
                    <th className="py-3 px-3">Статус</th>
                    <th className="py-3 px-3">Лаборатория</th>
                    <th className="py-3 px-3">№ Сертификата</th>
                  </>
                )}
                {selectedDisease === 'dcm' && (
                  <>
                    <th className="py-3 px-3">Статус DCM</th>
                    <th className="py-3 px-3">Дата обследования</th>
                    <th className="py-3 px-3">Клиника</th>
                    <th className="py-3 px-3">Заключение кардиолога</th>
                  </>
                )}
                {selectedDisease === 'coat' && (
                  <>
                    <th className="py-3 px-3">E-locus</th>
                    <th className="py-3 px-3">K-locus</th>
                    <th className="py-3 px-3">A-locus</th>
                    <th className="py-3 px-3">Фенотипический окрас</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDogs.map((dog) => (
                <tr key={dog.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4">
                    <div className="font-serif-royal font-bold text-stone-900 text-sm">
                      {dog.registeredName}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {dog.callName} · FCI {dog.rkfNumber}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-stone-600">
                    {dog.sex === 'male' ? 'Кобель' : 'Сука'}
                  </td>

                  {selectedDisease === 'dm' && (
                    <>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          dog.genetics.dm.code === 'N/N'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {dog.genetics.dm.code}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-700">
                        {dog.genetics.dm.status === 'clean' ? 'Здоров (Clean)' : 'Носитель (Carrier)'}
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {dog.genetics.dm.laboratory || 'Laboklin Germany / UK'}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-500">
                        {dog.genetics.dm.certificateNumber || '—'}
                      </td>
                    </>
                  )}

                  {selectedDisease === 'dcm' && (
                    <>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-xs">
                          {dog.genetics.dcm.status === 'clear' ? 'Чисто (Норма)' : dog.genetics.dcm.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {dog.genetics.dcm.dopplerDate || 'Ежегодно'}
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {dog.genetics.dcm.clinic || 'ВетКлиника'}
                      </td>
                      <td className="py-3 px-3 text-stone-500 italic max-w-xs truncate">
                        {dog.genetics.dcm.verdict || 'Патологий миокарда не выявлено'}
                      </td>
                    </>
                  )}

                  {selectedDisease === 'coat' && (
                    <>
                      <td className="py-3 px-3 font-mono font-semibold text-stone-800">
                        {dog.genetics.coat_genetics.e_locus}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-stone-800">
                        {dog.genetics.coat_genetics.k_locus}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-stone-800">
                        {dog.genetics.coat_genetics.a_locus}
                      </td>
                      <td className="py-3 px-3 font-medium text-amber-950">
                        {dog.color}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
