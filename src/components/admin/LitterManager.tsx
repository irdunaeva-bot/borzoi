import { useState } from 'react';
import { Litter, Puppy, Dog, BorzoiCoatColor } from '../../types/kennel';
import { Plus, Sparkles, CheckCircle, Edit, Tag, DollarSign, X } from 'lucide-react';

interface LitterManagerProps {
  litters: Litter[];
  dogs: Dog[];
  onUpdateLitter: (litter: Litter) => void;
  onAddLitter: (litter: Partial<Litter>) => void;
}

export function LitterManager({ litters, dogs, onUpdateLitter, onAddLitter }: LitterManagerProps) {
  const [selectedLitterId, setSelectedLitterId] = useState<string>(litters[0]?.id || '');
  const [isAddPuppyModalOpen, setIsAddPuppyModalOpen] = useState(false);

  const selectedLitter = litters.find((l) => l.id === selectedLitterId) || litters[0];

  const [newPuppy, setNewPuppy] = useState<Partial<Puppy>>({
    registeredName: 'Monterun Star ',
    callName: '',
    sex: 'male',
    color: 'Полово-пегий',
    collarColor: 'Красный',
    status: 'available',
    priceEur: 2200,
    priceGbp: 1900,
    photoUrl: '/borzoi_puppy_single.jpg',
    temperament: 'Активный, смелый щенок с крепким костяком.',
    features: ['Шоу-перспектива', 'Для выставок и курсинга'],
    vaccinated: true,
  });

  const handleUpdatePuppyStatus = (puppyId: string, newStatus: Puppy['status']) => {
    if (!selectedLitter) return;
    const updatedPuppies = selectedLitter.puppies.map((p) =>
      p.id === puppyId ? { ...p, status: newStatus } : p
    );
    const updatedLitter = { ...selectedLitter, puppies: updatedPuppies };
    onUpdateLitter(updatedLitter);
  };

  const handleAddPuppy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLitter || !newPuppy.registeredName) return;

    const puppy: Puppy = {
      id: `pup-${Date.now()}`,
      litterId: selectedLitter.id,
      registeredName: newPuppy.registeredName,
      callName: newPuppy.callName || 'Щенок',
      sex: newPuppy.sex as any,
      color: (newPuppy.color as BorzoiCoatColor) || 'Белый',
      collarColor: newPuppy.collarColor || 'Синий',
      status: newPuppy.status as any,
      priceEur: Number(newPuppy.priceEur) || 2200,
      priceGbp: Number(newPuppy.priceGbp) || 1900,
      photoUrl: newPuppy.photoUrl || '/borzoi_puppy_single.jpg',
      temperament: newPuppy.temperament || '',
      features: newPuppy.features || ['Шоу-класс'],
      vaccinated: true,
    };

    const updatedPuppies = [...selectedLitter.puppies, puppy];
    const updatedLitter: Litter = {
      ...selectedLitter,
      puppies: updatedPuppies,
      puppiesCount: updatedPuppies.length,
      malesCount: updatedPuppies.filter((p) => p.sex === 'male').length,
      femalesCount: updatedPuppies.filter((p) => p.sex === 'female').length,
    };

    onUpdateLitter(updatedLitter);
    setIsAddPuppyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
            Учет пометов и витрина щенков
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Регистрация вязок, актировка пометов, назначение кличек по литерам и управление статусами продажи щенков.
          </p>
        </div>
      </div>

      {/* Litters Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {litters.map((litter) => (
          <button
            key={litter.id}
            onClick={() => setSelectedLitterId(litter.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedLitter?.id === litter.id
                ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            Помет «{litter.letter}» ({litter.status === 'ready_for_new_home' ? 'Доступны щенки' : litter.status === 'planned' ? 'Планируется' : 'В яслях'})
          </button>
        ))}
      </div>

      {/* Selected Litter Details */}
      {selectedLitter && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider mb-1">
                Помет «{selectedLitter.letter}» · Рождение: {new Date(selectedLitter.birthDate).toLocaleDateString('ru-RU')}
              </div>
              <h3 className="font-serif-royal text-2xl font-bold text-stone-900">
                {selectedLitter.sireName} × {selectedLitter.damName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <div className="text-stone-500">Инбридинг помета Fx:</div>
                <div className="font-bold text-stone-900">{selectedLitter.inbreedingCoeff}%</div>
              </div>

              {selectedLitter.status !== 'planned' && (
                <button
                  onClick={() => setIsAddPuppyModalOpen(true)}
                  className="py-2 px-3 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить щенка в помет</span>
                </button>
              )}
            </div>
          </div>

          {/* Puppies Grid */}
          <div>
            <h4 className="font-serif-royal text-lg font-bold text-stone-900 mb-4">
              Щенки помета ({selectedLitter.puppies.length})
            </h4>

            {selectedLitter.puppies.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                {selectedLitter.status === 'planned'
                  ? 'Помет находится в стадии планирования (ожидается рождение).'
                  : 'Щенки еще не внесены в данный помет.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedLitter.puppies.map((pup) => (
                  <div
                    key={pup.id}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={pup.photoUrl}
                        alt={pup.registeredName}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="text-xs space-y-1">
                        <div className="font-serif-royal font-bold text-stone-900 text-sm">
                          {pup.registeredName}
                        </div>
                        <div className="text-stone-500">
                          {pup.sex === 'male' ? 'Кобель' : 'Сука'} · {pup.color}
                        </div>
                        <div className="text-[11px] text-stone-600 font-medium">
                          Ошейник: {pup.collarColor}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 italic line-clamp-2">
                      "{pup.temperament}"
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <div className="font-semibold text-stone-900 text-xs">
                        {pup.priceRub ? `${pup.priceRub.toLocaleString('ru-RU')} ₽` : 'Договорная'}
                      </div>

                      {/* Status Selector */}
                      <select
                        value={pup.status}
                        onChange={(e) => handleUpdatePuppyStatus(pup.id, e.target.value as any)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border cursor-pointer ${
                          pup.status === 'available'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : pup.status === 'reserved'
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : pup.status === 'sold'
                            ? 'bg-stone-200 border-stone-300 text-stone-700'
                            : 'bg-purple-100 border-purple-300 text-purple-900'
                        }`}
                      >
                        <option value="available">Свободен</option>
                        <option value="reserved">В резерве</option>
                        <option value="sold">Продан</option>
                        <option value="staying_in_kennel">В питомнике</option>
                        <option value="co_ownership">Совладение</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD PUPPY MODAL */}
      {isAddPuppyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif-royal text-xl font-bold">
                Добавить щенка в помет «{selectedLitter?.letter}»
              </h3>
              <button
                onClick={() => setIsAddPuppyModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPuppy} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Официальная кличка *
                </label>
                <input
                  type="text"
                  required
                  value={newPuppy.registeredName}
                  onChange={(e) => setNewPuppy({ ...newPuppy, registeredName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Пол</label>
                  <select
                    value={newPuppy.sex}
                    onChange={(e) => setNewPuppy({ ...newPuppy, sex: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="male">Кобель</option>
                    <option value="female">Сука</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Окрас</label>
                  <select
                    value={newPuppy.color}
                    onChange={(e) => setNewPuppy({ ...newPuppy, color: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="Белый">Белый</option>
                    <option value="Полово-пегий">Полово-пегий</option>
                    <option value="Бурматный">Бурматный</option>
                    <option value="Муругий">Муругий</option>
                    <option value="Чубарый">Чубарый</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Цвет ошейника</label>
                  <input
                    type="text"
                    value={newPuppy.collarColor}
                    onChange={(e) => setNewPuppy({ ...newPuppy, collarColor: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Стоимость (₽)</label>
                  <input
                    type="number"
                    value={newPuppy.priceRub}
                    onChange={(e) => setNewPuppy({ ...newPuppy, priceRub: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Темперамент и характер</label>
                <textarea
                  rows={2}
                  value={newPuppy.temperament}
                  onChange={(e) => setNewPuppy({ ...newPuppy, temperament: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPuppyModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-950"
                >
                  Добавить щенка
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
