import { useState } from 'react';
import { Exhibition, ExhibitionAward, Dog } from '../../types/kennel';
import { Trophy, Calendar, Plus, Award, MapPin, X } from 'lucide-react';

interface ExhibitionManagerProps {
  exhibitions: Exhibition[];
  awards: ExhibitionAward[];
  dogs: Dog[];
  onAddExhibition: (exhibition: Exhibition) => void;
  onAddAward: (award: ExhibitionAward) => void;
}

export function ExhibitionManager({
  exhibitions,
  awards,
  dogs,
  onAddExhibition,
  onAddAward,
}: ExhibitionManagerProps) {
  const [isAddShowOpen, setIsAddShowOpen] = useState(false);
  const [isAddAwardOpen, setIsAddAwardOpen] = useState(false);

  // New Show state
  const [newShow, setNewShow] = useState<Partial<Exhibition>>({
    name: '',
    rank: 'CACIB',
    date: '2026-12-05',
    city: 'Bratislava',
    country: 'Slovakia',
    organizer: 'SKJ / FCI',
    judges: ['Tamás Jakkel (FCI)'],
    status: 'upcoming',
    registeredDogIds: [dogs[0]?.id || ''],
    description: '',
  });

  // New Award state
  const [newAward, setNewAward] = useState<Partial<ExhibitionAward>>({
    dogId: dogs[0]?.id || '',
    exhibitionId: exhibitions[0]?.id || '',
    judge: 'Tamás Jakkel',
    showClass: 'champion',
    evaluation: 'отлично',
    placement: 1,
    certificates: ['CW', 'CAC', 'CACIB', 'BOB'],
    critique: 'Отличный тип, великолепный костяк и движения.',
  });

  const handleSaveShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShow.name) return;

    const show: Exhibition = {
      id: `ex-${Date.now()}`,
      name: newShow.name,
      rank: newShow.rank as any,
      date: newShow.date || '2026-12-05',
      city: newShow.city || 'Vienna',
      country: newShow.country || 'Austria',
      organizer: newShow.organizer || 'ÖKV / FCI',
      judges: newShow.judges || ['Судья FCI'],
      status: (newShow.status as any) || 'upcoming',
      registeredDogIds: newShow.registeredDogIds || [],
      description: newShow.description,
    };

    onAddExhibition(show);
    setIsAddShowOpen(false);
  };

  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();
    const dog = dogs.find((d) => d.id === newAward.dogId);
    const ex = exhibitions.find((e) => e.id === newAward.exhibitionId);
    if (!dog || !ex) return;

    const award: ExhibitionAward = {
      id: `aw-${Date.now()}`,
      dogId: dog.id,
      dogName: dog.registeredName,
      exhibitionId: ex.id,
      exhibitionName: ex.name,
      date: ex.date,
      city: ex.city,
      judge: newAward.judge || 'Эксперт',
      showClass: (newAward.showClass as any) || 'champion',
      evaluation: (newAward.evaluation as any) || 'отлично',
      placement: Number(newAward.placement) || 1,
      certificates: newAward.certificates || ['CW', 'CAC'],
      critique: newAward.critique,
    };

    onAddAward(award);
    setIsAddAwardOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
            Выставочный реестр и протоколы наград
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Планирование графика рингов, регистрация собак по классам, учет сертификатов CACIB/BOB/BIS и судейских описаний.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddAwardOpen(true)}
            className="py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Внести диплом / награду</span>
          </button>

          <button
            onClick={() => setIsAddShowOpen(true)}
            className="py-2 px-4 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Запланировать выставку</span>
          </button>
        </div>
      </div>

      {/* Shows List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exhibitions */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-700" />
            Календарь выставок ({exhibitions.length})
          </h3>

          <div className="space-y-3">
            {exhibitions.map((ex) => (
              <div key={ex.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {ex.rank}
                    </span>
                    <h4 className="font-serif-royal font-bold text-stone-900 text-sm mt-1">
                      {ex.name}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    ex.status === 'upcoming' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ex.status === 'upcoming' ? 'Предстоит' : 'Завершена'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-stone-500 text-[11px]">
                  <span>{new Date(ex.date).toLocaleDateString('ru-RU')}</span>
                  <span>·</span>
                  <span>{ex.city}, {ex.country}</span>
                </div>

                <div className="text-[11px] text-stone-600">
                  Заявлено собак питомника: <strong>{ex.registeredDogIds.length}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards list */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-700" />
            Последние внесенные награды и дипломы ({awards.length})
          </h3>

          <div className="space-y-3">
            {awards.map((award) => (
              <div key={award.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-serif-royal font-bold text-stone-900 text-sm">
                      {award.dogName}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {award.exhibitionName} · {award.city}
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Эксперт: <strong>{award.judge}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {award.certificates.map((cert, idx) => (
                    <span key={idx} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {cert}
                    </span>
                  ))}
                </div>

                {award.critique && (
                  <p className="text-[11px] text-stone-600 italic bg-white p-2 rounded border border-stone-200">
                    "{award.critique}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD SHOW MODAL */}
      {isAddShowOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif-royal text-xl font-bold">Запланировать выставку</h3>
              <button onClick={() => setIsAddShowOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveShow} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Название выставки *</label>
                <input
                  type="text"
                  required
                  placeholder="Интернациональная выставка CACIB..."
                  value={newShow.name}
                  onChange={(e) => setNewShow({ ...newShow, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ранг</label>
                  <select
                    value={newShow.rank}
                    onChange={(e) => setNewShow({ ...newShow, rank: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="CACIB">CACIB (FCI International)</option>
                    <option value="CAC">CAC (National FCI / ÖKV / SKJ)</option>
                    <option value="Crufts">Crufts (The Kennel Club UK)</option>
                    <option value="European Dog Show">European Dog Show (EDS / FCI)</option>
                    <option value="World Dog Show">World Dog Show (WDS / FCI)</option>
                    <option value="Specialty">Specialty Sighthound Show</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={newShow.date}
                    onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Город</label>
                  <input
                    type="text"
                    value={newShow.city}
                    onChange={(e) => setNewShow({ ...newShow, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Организатор</label>
                  <input
                    type="text"
                    value={newShow.organizer}
                    onChange={(e) => setNewShow({ ...newShow, organizer: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddShowOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-950"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD AWARD MODAL */}
      {isAddAwardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif-royal text-xl font-bold">Внести диплом и результаты</h3>
              <button onClick={() => setIsAddAwardOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAward} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Собака *</label>
                <select
                  value={newAward.dogId}
                  onChange={(e) => setNewAward({ ...newAward, dogId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                >
                  {dogs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.registeredName} ({d.callName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Выставка *</label>
                <select
                  value={newAward.exhibitionId}
                  onChange={(e) => setNewAward({ ...newAward, exhibitionId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                >
                  {exhibitions.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Судья в ринге</label>
                  <input
                    type="text"
                    value={newAward.judge}
                    onChange={(e) => setNewAward({ ...newAward, judge: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Класс</label>
                  <select
                    value={newAward.showClass}
                    onChange={(e) => setNewAward({ ...newAward, showClass: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="champion">Класс чемпионов</option>
                    <option value="open">Открытый класс</option>
                    <option value="intermediate">Промежуточный</option>
                    <option value="junior">Юниоры</option>
                    <option value="veteran">Ветераны</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Судейское описание</label>
                <textarea
                  rows={2}
                  value={newAward.critique}
                  onChange={(e) => setNewAward({ ...newAward, critique: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAwardOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-950"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
