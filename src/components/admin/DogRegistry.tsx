import { useState } from 'react';
import { Dog, DogSex, DogStatus, BorzoiCoatColor } from '../../types/kennel';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Eye, 
  Trash2, 
  ShieldCheck, 
  Trophy, 
  X,
  CheckCircle,
  Compass
} from 'lucide-react';

interface DogRegistryProps {
  dogs: Dog[];
  onAddDog: (dog: Dog) => void;
  onUpdateDog: (dog: Dog) => void;
  onDeleteDog: (dogId: string) => void;
  onSelectDog: (dog: Dog) => void;
}

export function DogRegistry({
  dogs,
  onAddDog,
  onUpdateDog,
  onDeleteDog,
  onSelectDog,
}: DogRegistryProps) {
  const [search, setSearch] = useState('');
  const [sexFilter, setSexFilter] = useState<'all' | 'male' | 'female'>('all');
  const [dmFilter, setDmFilter] = useState<'all' | 'N/N' | 'N/DM'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New dog form state
  const [newDog, setNewDog] = useState<Partial<Dog>>({
    registeredName: '',
    callName: '',
    rkfNumber: '',
    chipNumber: '',
    tattooNumber: '',
    sex: 'male',
    birthDate: '2023-01-01',
    color: 'Полово-пегий',
    heightCm: 82,
    status: 'breeding',
    photoUrl: '/borzoi_hero.jpg',
    description: '',
    titles: ['Чемпион Словакии (SK CH)', 'Crufts Class Winner'],
    huntingDiplomas: ['Курсинг CACIL'],
    genetics: {
      dm: { code: 'N/N', status: 'clean', laboratory: 'Laboklin Germany / UK' },
      dcm: { status: 'clear' },
      mh: { code: 'N/N', status: 'clean' },
      eyes_ecvo: { status: 'clear' },
      coat_genetics: {
        e_locus: 'E/E',
        k_locus: 'ky/ky',
        a_locus: 'Ay/Ay',
        b_locus: 'B/B',
        d_locus: 'D/D',
      },
    },
    owner: {
      name: 'Питомник MONTERUN STAR (Bela SK)',
      city: 'Bela / Bratislava (FCI)',
      isKennelOwned: true,
    },
  });

  const filteredDogs = dogs.filter((d) => {
    const matchesSearch =
      d.registeredName.toLowerCase().includes(search.toLowerCase()) ||
      d.callName.toLowerCase().includes(search.toLowerCase()) ||
      d.rkfNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.chipNumber.toLowerCase().includes(search.toLowerCase());

    const matchesSex = sexFilter === 'all' || d.sex === sexFilter;
    const matchesDm = dmFilter === 'all' || d.genetics.dm.code === dmFilter;

    return matchesSearch && matchesSex && matchesDm;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `borzoi_kennel_database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveNewDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDog.registeredName || !newDog.rkfNumber) return;

    const dogToAdd: Dog = {
      id: `dog-${Date.now()}`,
      registeredName: newDog.registeredName,
      callName: newDog.callName || 'Без клички',
      rkfNumber: newDog.rkfNumber,
      chipNumber: newDog.chipNumber || `643098${Date.now()}`,
      tattooNumber: newDog.tattooNumber || 'SVR',
      sex: newDog.sex as DogSex,
      birthDate: newDog.birthDate || '2023-01-01',
      color: (newDog.color as BorzoiCoatColor) || 'Белый',
      heightCm: Number(newDog.heightCm) || 80,
      status: (newDog.status as DogStatus) || 'breeding',
      photoUrl: newDog.photoUrl || '/borzoi_hero.jpg',
      galleryUrls: [],
      description: newDog.description || 'Породная русская борзая хорошего сложения.',
      titles: newDog.titles || [],
      huntingDiplomas: newDog.huntingDiplomas || [],
      inbreedingCoeff: 1.5,
      genetics: newDog.genetics as any,
      owner: newDog.owner as any,
    };

    onAddDog(dogToAdd);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
            Племенная книга и реестр собак
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Всего в базе: <strong className="text-stone-800">{dogs.length} собак</strong> · Из них производителей: {dogs.filter(d => d.status === 'breeding').length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="py-2 px-3 text-xs bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Экспорт базы в JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт JSON</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2 px-4 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить собаку в базу</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по кличке, номеру FCI, чипу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs">
          {/* Sex filter */}
          <div className="flex items-center gap-1">
            <span className="text-stone-500">Пол:</span>
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value as any)}
              className="px-2 py-1 bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-700"
            >
              <option value="all">Все</option>
              <option value="male">Кобели</option>
              <option value="female">Суки</option>
            </select>
          </div>

          {/* DM filter */}
          <div className="flex items-center gap-1">
            <span className="text-stone-500">Генетика DM:</span>
            <select
              value={dmFilter}
              onChange={(e) => setDmFilter(e.target.value as any)}
              className="px-2 py-1 bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-700"
            >
              <option value="all">Все статусы</option>
              <option value="N/N">N/N (Чистые)</option>
              <option value="N/DM">N/DM (Носители)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Собака</th>
                <th className="py-3 px-3">Пол / Возраст</th>
                <th className="py-3 px-3">Окрас & Рост</th>
                <th className="py-3 px-3">FCI / Клеймо / Чип</th>
                <th className="py-3 px-3">ДНК DM</th>
                <th className="py-3 px-3">Статус</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDogs.map((dog) => (
                <tr key={dog.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={dog.photoUrl}
                        alt={dog.registeredName}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <div 
                          onClick={() => onSelectDog(dog)}
                          className="font-serif-royal font-bold text-stone-900 text-sm hover:text-amber-900 hover:underline cursor-pointer"
                        >
                          {dog.registeredName}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {dog.callName} · {dog.titles[0] || 'Без титулов'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-stone-700">
                    <div>{dog.sex === 'male' ? 'Кобель' : 'Сука'}</div>
                    <div className="text-[10px] text-stone-400">
                      {new Date(dog.birthDate).toLocaleDateString('ru-RU')}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-stone-700">
                    <div className="font-medium">{dog.color}</div>
                    <div className="text-[10px] text-stone-400">{dog.heightCm} см в холке</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-stone-600">
                    <div>{dog.rkfNumber}</div>
                    <div className="text-[10px] text-stone-400">Кл: {dog.tattooNumber}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      dog.genetics.dm.code === 'N/N'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {dog.genetics.dm.code}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-stone-700 text-[11px]">
                      {dog.status === 'breeding' ? 'Производитель' :
                       dog.status === 'veteran' ? 'Ветеран' :
                       dog.status === 'prospect' ? 'Молодняк' :
                       dog.status === 'co_owned' ? 'Совладение' : 'Архив'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectDog(dog)}
                        className="p-1.5 text-stone-600 hover:text-amber-900 hover:bg-stone-100 rounded-md transition-colors"
                        title="Просмотр профиля и родословной"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить собаку ${dog.registeredName} из базы?`)) {
                            onDeleteDog(dog.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DOG MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif-royal text-xl font-bold">
                Регистрация новой борзой в племенную книгу
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewDog} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Официальная кличка по FCI / Родословной *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Monterun Star Dobrynya"
                    value={newDog.registeredName}
                    onChange={(e) => setNewDog({ ...newDog, registeredName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Домашнее имя (обиходная кличка)
                  </label>
                  <input
                    type="text"
                    placeholder="Добрыня"
                    value={newDog.callName}
                    onChange={(e) => setNewDog({ ...newDog, callName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Номер родословной FCI / KC *</label>
                  <input
                    type="text"
                    required
                    placeholder="SPKP 650/23 / KCSB 1234AB"
                    value={newDog.rkfNumber}
                    onChange={(e) => setNewDog({ ...newDog, rkfNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Клеймо</label>
                  <input
                    type="text"
                    placeholder="SVR 145"
                    value={newDog.tattooNumber}
                    onChange={(e) => setNewDog({ ...newDog, tattooNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Микрочип</label>
                  <input
                    type="text"
                    placeholder="643098100..."
                    value={newDog.chipNumber}
                    onChange={(e) => setNewDog({ ...newDog, chipNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Пол</label>
                  <select
                    value={newDog.sex}
                    onChange={(e) => setNewDog({ ...newDog, sex: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="male">Кобель (Male)</option>
                    <option value="female">Сука (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Окрас</label>
                  <select
                    value={newDog.color}
                    onChange={(e) => setNewDog({ ...newDog, color: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="Белый">Белый</option>
                    <option value="Полово-пегий">Полово-пегий</option>
                    <option value="Бурматный">Бурматный</option>
                    <option value="Муругий">Муругий</option>
                    <option value="Чубарый">Чубарый</option>
                    <option value="Серо-подпалый">Серо-подпалый</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Рост в холке (см)</label>
                  <input
                    type="number"
                    value={newDog.heightCm}
                    onChange={(e) => setNewDog({ ...newDog, heightCm: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Генетика DM (SOD1)</label>
                  <select
                    value={newDog.genetics?.dm.code}
                    onChange={(e) => {
                      const code = e.target.value as any;
                      setNewDog({
                        ...newDog,
                        genetics: {
                          ...newDog.genetics!,
                          dm: {
                            ...newDog.genetics!.dm,
                            code,
                            status: code === 'N/N' ? 'clean' : 'carrier',
                          },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="N/N">N/N (Свободен / Чист)</option>
                    <option value="N/DM">N/DM (Носитель)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Статус в питомнике</label>
                  <select
                    value={newDog.status}
                    onChange={(e) => setNewDog({ ...newDog, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm"
                  >
                    <option value="breeding">Активный производитель</option>
                    <option value="prospect">Племенная надежда</option>
                    <option value="co_owned">В совладении</option>
                    <option value="veteran">Ветеран</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ссылка на фото</label>
                <input
                  type="url"
                  value={newDog.photoUrl}
                  onChange={(e) => setNewDog({ ...newDog, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Описание экстерьера</label>
                <textarea
                  rows={2}
                  value={newDog.description}
                  onChange={(e) => setNewDog({ ...newDog, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-950"
                >
                  Сохранить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
