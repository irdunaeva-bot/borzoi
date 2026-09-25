import { useState } from 'react';
import { DATABASE_SCHEMA_SPEC } from '../../data/mockData';
import { 
  Database, 
  Table, 
  Key, 
  Layers, 
  FileCode, 
  Copy, 
  Check, 
  ArrowLeft, 
  Dna, 
  Network,
  Share2,
  ShieldCheck,
  Code
} from 'lucide-react';

interface DatabaseConceptViewProps {
  onBackToApp: () => void;
  onSwitchToAdmin: () => void;
}

export function DatabaseConceptView({ onBackToApp, onSwitchToAdmin }: DatabaseConceptViewProps) {
  const [activeTab, setActiveTab] = useState<'erd' | 'dictionary' | 'sql' | 'rules'>('erd');
  const [copied, setCopied] = useState(false);

  const fullSqlScript = `-- ========================================================
-- Архитектура Реляционной Базы Данных Питомника Русских Борзых
-- Версия: 2.4 Enterprise (PostgreSQL 16 / Google Cloud SQL)
-- Автор: Зооинженер-кинолог & Database Architect
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ТАБЛИЦА: dogs (Реестр собак и племенная книга)
CREATE TABLE dogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rkf_number VARCHAR(32) UNIQUE NOT NULL,
    chip_number VARCHAR(20) UNIQUE,
    tattoo_number VARCHAR(12),
    registered_name VARCHAR(128) NOT NULL,
    call_name VARCHAR(64),
    sex VARCHAR(6) NOT NULL CHECK (sex IN ('male', 'female')),
    birth_date DATE NOT NULL,
    color VARCHAR(48) NOT NULL,
    height_cm NUMERIC(4, 1),
    sire_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
    dam_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
    inbreeding_fx NUMERIC(5, 2) DEFAULT 0.0,
    status VARCHAR(24) DEFAULT 'breeding' CHECK (status IN ('breeding', 'prospect', 'veteran', 'co_owned', 'retired', 'outside_stud')),
    photo_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dogs_sire ON dogs(sire_id);
CREATE INDEX idx_dogs_dam ON dogs(dam_id);
CREATE INDEX idx_dogs_rkf ON dogs(rkf_number);
CREATE INDEX idx_dogs_status ON dogs(status);

-- 2. ТАБЛИЦА: genetic_profiles (Генетические маркеры и здоровье)
CREATE TABLE genetic_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dog_id UUID UNIQUE NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    dm_code VARCHAR(12) NOT NULL CHECK (dm_code IN ('N/N', 'N/DM', 'DM/DM', 'Pending')),
    dm_lab VARCHAR(64),
    dm_certificate VARCHAR(64),
    dcm_status VARCHAR(16) NOT NULL CHECK (dcm_status IN ('clear', 'equivocal', 'affected', 'not_tested')),
    dcm_doppler_date DATE,
    mh_code VARCHAR(12) DEFAULT 'N/N',
    eyes_ecvo_status VARCHAR(16) DEFAULT 'clear',
    e_locus VARCHAR(8) DEFAULT 'E/E',
    k_locus VARCHAR(8) DEFAULT 'ky/ky',
    a_locus VARCHAR(8) DEFAULT 'Ay/Ay',
    dna_marker_profile TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ТАБЛИЦА: litters (Пометы и журнал вязок)
CREATE TABLE litters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter CHAR(1) NOT NULL,
    sire_id UUID NOT NULL REFERENCES dogs(id),
    dam_id UUID NOT NULL REFERENCES dogs(id),
    mating_date DATE NOT NULL,
    birth_date DATE,
    puppies_count INT DEFAULT 0,
    males_count INT DEFAULT 0,
    females_count INT DEFAULT 0,
    inbreeding_fx NUMERIC(5, 2) NOT NULL,
    status VARCHAR(24) NOT NULL CHECK (status IN ('planned', 'nursing', 'ready_for_new_home', 'completed')),
    act_inspection_number VARCHAR(64),
    description TEXT
);

CREATE INDEX idx_litters_parents ON litters(sire_id, dam_id);
CREATE INDEX idx_litters_status ON litters(status);

-- 4. ТАБЛИЦА: puppies (Щенки на продажу и учет)
CREATE TABLE puppies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    litter_id UUID NOT NULL REFERENCES litters(id) ON DELETE CASCADE,
    registered_name VARCHAR(128) NOT NULL,
    call_name VARCHAR(48),
    sex VARCHAR(6) NOT NULL CHECK (sex IN ('male', 'female')),
    color VARCHAR(48) NOT NULL,
    collar_color VARCHAR(32),
    status VARCHAR(24) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'staying_in_kennel', 'co_ownership')),
    price_rub NUMERIC(10, 2),
    microchip VARCHAR(20) UNIQUE,
    temperament TEXT,
    photo_url TEXT
);

CREATE INDEX idx_puppies_litter ON puppies(litter_id);
CREATE INDEX idx_puppies_status ON puppies(status);

-- 5. ТАБЛИЦА: exhibitions (Календарь выставок)
CREATE TABLE exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(160) NOT NULL,
    rank VARCHAR(32) NOT NULL,
    event_date DATE NOT NULL,
    city VARCHAR(64) NOT NULL,
    country VARCHAR(48) NOT NULL,
    organizer VARCHAR(128),
    status VARCHAR(16) NOT NULL CHECK (status IN ('upcoming', 'completed')),
    description TEXT
);

CREATE INDEX idx_exhibitions_date ON exhibitions(event_date);

-- 6. ТАБЛИЦА: dog_awards (Награды, сертификаты и судейские описания)
CREATE TABLE dog_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dog_id UUID NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    exhibition_id UUID NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
    judge VARCHAR(96) NOT NULL,
    show_class VARCHAR(24) NOT NULL,
    evaluation VARCHAR(32) NOT NULL,
    placement INT,
    certificates TEXT[],
    judge_critique TEXT
);

CREATE INDEX idx_awards_dog ON dog_awards(dog_id);
CREATE INDEX idx_awards_exhibition ON dog_awards(exhibition_id);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-stone-950 border-b border-stone-800 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на сайт</span>
          </button>

          <div className="h-4 w-px bg-stone-700" />

          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h1 className="font-serif-royal font-bold text-lg sm:text-xl text-stone-100">
              Концепция & Архитектура Базы Данных
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToAdmin}
            className="py-1.5 px-3 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            В систему управления (Уровень 1)
          </button>
        </div>
      </header>

      {/* Ribbon */}
      <div className="bg-stone-950/60 border-b border-stone-800 px-4 sm:px-8 flex gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('erd')}
          className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'erd'
              ? 'border-amber-400 text-amber-300 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Диаграмма сущностей (ERD)</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'dictionary'
              ? 'border-amber-400 text-amber-300 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Словарь данных (7 сущностей)</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sql'
              ? 'border-amber-400 text-amber-300 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>SQL DDL Скрипт (PostgreSQL)</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'rules'
              ? 'border-amber-400 text-amber-300 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Бизнес-правила и целостность</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* TAB 1: INTERACTIVE ERD */}
        {activeTab === 'erd' && (
          <div className="space-y-6">
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold">Схема реляционных связей:</strong> Центральная таблица <code className="text-amber-200 bg-stone-900 px-1.5 py-0.5 rounded">dogs</code> имеет самореферентные внешние ключи <code className="text-sky-300">sire_id</code> и <code className="text-rose-300">dam_id</code> для рекурсивного построения древа предков любой глубины. С ней связаны генетический профиль (1:1), пометы (1:N), выставки и награды (N:M).
            </div>

            {/* Visual ERD Diagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: DOGS (Core) */}
              <div className="bg-stone-800 rounded-2xl border-2 border-amber-500/70 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300 font-serif-royal text-lg">
                    <Table className="w-4 h-4 text-amber-400" />
                    <span>dogs (Ядро)</span>
                  </div>
                  <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-mono">
                    PK: id (UUID)
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>* id</span>
                    <span className="text-stone-500">UUID (PK)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>rkf_number</span>
                    <span className="text-stone-500">VARCHAR(32) UNQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>registered_name</span>
                    <span className="text-stone-500">VARCHAR(128)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>sex</span>
                    <span className="text-stone-500">male | female</span>
                  </div>
                  <div className="flex justify-between text-sky-400">
                    <span>sire_id</span>
                    <span className="text-stone-500">FK → dogs.id</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>dam_id</span>
                    <span className="text-stone-500">FK → dogs.id</span>
                  </div>
                  <div className="flex justify-between">
                    <span>inbreeding_fx</span>
                    <span className="text-stone-500">NUMERIC(5,2)</span>
                  </div>
                </div>
              </div>

              {/* Box 2: GENETIC PROFILES */}
              <div className="bg-stone-800 rounded-2xl border border-emerald-500/50 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 font-serif-royal text-lg">
                    <Dna className="w-4 h-4 text-emerald-400" />
                    <span>genetic_profiles (1:1)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    FK: dog_id
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between text-emerald-400">
                    <span>* dog_id</span>
                    <span className="text-stone-500">FK → dogs.id (1:1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>dm_code</span>
                    <span className="text-stone-500">N/N | N/DM | DM/DM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>dcm_status</span>
                    <span className="text-stone-500">clear | equivocal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>mh_code</span>
                    <span className="text-stone-500">N/N | N/MH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>coat_loci</span>
                    <span className="text-stone-500">E/K/A/B/D loci</span>
                  </div>
                </div>
              </div>

              {/* Box 3: LITTERS */}
              <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-stone-200 font-serif-royal text-lg">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>litters (Пометы)</span>
                  </div>
                  <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded font-mono">
                    PK: id
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between">
                    <span>letter</span>
                    <span className="text-stone-500">CHAR(1)</span>
                  </div>
                  <div className="flex justify-between text-sky-400">
                    <span>sire_id</span>
                    <span className="text-stone-500">FK → dogs.id</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>dam_id</span>
                    <span className="text-stone-500">FK → dogs.id</span>
                  </div>
                  <div className="flex justify-between">
                    <span>inbreeding_fx</span>
                    <span className="text-stone-500">Райт Fx %</span>
                  </div>
                  <div className="flex justify-between">
                    <span>status</span>
                    <span className="text-stone-500">planned | ready</span>
                  </div>
                </div>
              </div>

              {/* Box 4: PUPPIES */}
              <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-stone-200 font-serif-royal text-lg">
                    <Table className="w-4 h-4 text-amber-400" />
                    <span>puppies (Щенки)</span>
                  </div>
                  <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded font-mono">
                    FK: litter_id
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between text-amber-300">
                    <span>* litter_id</span>
                    <span className="text-stone-500">FK → litters.id</span>
                  </div>
                  <div className="flex justify-between">
                    <span>registered_name</span>
                    <span className="text-stone-500">VARCHAR(128)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>status</span>
                    <span className="text-stone-500">available | reserved</span>
                  </div>
                  <div className="flex justify-between">
                    <span>price_rub</span>
                    <span className="text-stone-500">NUMERIC(10,2)</span>
                  </div>
                </div>
              </div>

              {/* Box 5: EXHIBITIONS */}
              <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-stone-200 font-serif-royal text-lg">
                    <Table className="w-4 h-4 text-amber-400" />
                    <span>exhibitions (Выставки)</span>
                  </div>
                  <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded font-mono">
                    PK: id
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between">
                    <span>name</span>
                    <span className="text-stone-500">VARCHAR(160)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>rank</span>
                    <span className="text-stone-500">CACIB | CAC | ЧК</span>
                  </div>
                  <div className="flex justify-between">
                    <span>event_date</span>
                    <span className="text-stone-500">DATE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>city, country</span>
                    <span className="text-stone-500">VARCHAR</span>
                  </div>
                </div>
              </div>

              {/* Box 6: DOG_AWARDS */}
              <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 font-bold text-stone-200 font-serif-royal text-lg">
                    <Table className="w-4 h-4 text-amber-400" />
                    <span>dog_awards (Награды)</span>
                  </div>
                  <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded font-mono">
                    N:M Junction
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-stone-300">
                  <div className="flex justify-between text-amber-300">
                    <span>* dog_id</span>
                    <span className="text-stone-500">FK → dogs.id</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>* exhibition_id</span>
                    <span className="text-stone-500">FK → exhibitions.id</span>
                  </div>
                  <div className="flex justify-between">
                    <span>certificates</span>
                    <span className="text-stone-500">TEXT[] (CACIB, BOB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>critique</span>
                    <span className="text-stone-500">TEXT</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: DATA DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            {DATABASE_SCHEMA_SPEC.tables.map((table) => (
              <div key={table.name} className="bg-stone-800 rounded-2xl border border-stone-700 overflow-hidden shadow-xs">
                <div className="bg-stone-950 px-6 py-3 border-b border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
                    <Table className="w-4 h-4" />
                    <span>{table.name}</span>
                  </div>
                  <span className="text-xs text-stone-400">{table.description}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/70 border-b border-stone-700 text-stone-400 font-mono">
                      <tr>
                        <th className="py-2.5 px-4">Колонка</th>
                        <th className="py-2.5 px-4">Тип данных & Constraints</th>
                        <th className="py-2.5 px-4">Семантическое описание</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-700/60 font-mono">
                      {table.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-stone-750">
                          <td className="py-2.5 px-4 font-semibold text-amber-200">{col.name}</td>
                          <td className="py-2.5 px-4 text-stone-300">{col.type}</td>
                          <td className="py-2.5 px-4 font-sans text-stone-400">{col.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SQL DDL SCRIPT */}
        {activeTab === 'sql' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-royal text-xl font-bold text-white">
                  Скрипт создания структуры таблиц (SQL DDL)
                </h3>
                <p className="text-xs text-stone-400">
                  Совместимо с PostgreSQL 15/16, Google Cloud SQL, Neon, Supabase.
                </p>
              </div>

              <button
                onClick={copyToClipboard}
                className="py-2 px-4 bg-amber-800 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Скопировано!' : 'Копировать SQL'}</span>
              </button>
            </div>

            <pre className="p-6 bg-stone-950 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
              <code>{fullSqlScript}</code>
            </pre>
          </div>
        )}

        {/* TAB 4: BUSINESS RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 space-y-3">
                <div className="text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  Правило 1: ДНК-безопасность
                </div>
                <h4 className="font-serif-royal font-bold text-lg text-white">
                  Контроль аутосомно-рецессивных мутаций (DM SOD1)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Система на уровне триггера и UI запрещает создание помета, где оба родителя имеют статус <code className="text-rose-400">N/DM</code> или <code className="text-rose-400">DM/DM</code>. Это предотвращает рождение гомозигот по дегенеративной миелопатии.
                </p>
              </div>

              <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 space-y-3">
                <div className="text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  Правило 2: Инбридинг Райта
                </div>
                <h4 className="font-serif-royal font-bold text-lg text-white">
                  Коэффициент Fx не выше критического порога
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  При коэффициенте выше 12.5% система генерирует селекционное предупреждение о рисках инбредной депрессии и снижения плодовитости борзых.
                </p>
              </div>

              <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 space-y-3">
                <div className="text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  Правило 3: Целостность пометов
                </div>
                <h4 className="font-serif-royal font-bold text-lg text-white">
                  Сквозной учет литер и актировки
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Каждый щенок жестко привязан к родительской паре через помет, получая уникальный номер микрочипа и клеймо питомника с сохранением архива даже после продажи.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
