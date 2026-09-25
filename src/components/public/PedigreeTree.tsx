import { useState } from 'react';
import { Dog } from '../../types/kennel';
import { Info, Dna } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface PedigreeTreeProps {
  dog: Dog;
  allDogs: Dog[];
  onSelectDog?: (dog: Dog) => void;
  lang?: Language;
}

export function PedigreeTree({ dog, allDogs, onSelectDog, lang = 'ru' }: PedigreeTreeProps) {
  const [hoveredDog, setHoveredDog] = useState<Dog | null>(null);

  const dogMap = new Map<string, Dog>();
  allDogs.forEach((d) => dogMap.set(d.id, d));

  const sire = dog.sireId ? dogMap.get(dog.sireId) : undefined;
  const dam = dog.damId ? dogMap.get(dog.damId) : undefined;

  const paternalGrandSire = sire?.sireId ? dogMap.get(sire.sireId) : undefined;
  const paternalGrandDam = sire?.damId ? dogMap.get(sire.damId) : undefined;

  const maternalGrandSire = dam?.sireId ? dogMap.get(dam.sireId) : undefined;
  const maternalGrandDam = dam?.damId ? dogMap.get(dam.damId) : undefined;

  // Render ancestor card
  const renderCard = (
    ancestor: Dog | undefined,
    fallbackName: string | undefined,
    role: string,
    side: 'sire' | 'dam' | 'root'
  ) => {
    const isInteractive = Boolean(ancestor);
    const borderColor =
      side === 'sire'
        ? 'border-sky-200 hover:border-sky-400 bg-sky-50/40'
        : side === 'dam'
        ? 'border-rose-200 hover:border-rose-400 bg-rose-50/40'
        : 'border-amber-300 bg-amber-50/60 shadow-xs';

    const displayName = ancestor 
      ? (lang === 'en' && ancestor.registeredNameEn ? ancestor.registeredNameEn : ancestor.registeredName)
      : (fallbackName || (lang === 'en' ? 'FCI Certified Ancestor' : 'Предок в племенной книге'));

    return (
      <div
        onClick={() => ancestor && onSelectDog && onSelectDog(ancestor)}
        onMouseEnter={() => ancestor && setHoveredDog(ancestor)}
        onMouseLeave={() => setHoveredDog(null)}
        className={`p-2.5 rounded-lg border transition-all duration-150 flex flex-col justify-between ${borderColor} ${
          isInteractive ? 'cursor-pointer hover:shadow-md' : 'opacity-85'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {role}
            </span>
            {ancestor?.genetics.dm.code && (
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded font-medium ${
                ancestor.genetics.dm.code === 'N/N' 
                  ? 'text-emerald-700 bg-emerald-100/70' 
                  : 'text-amber-800 bg-amber-100'
              }`}>
                DM: {ancestor.genetics.dm.code}
              </span>
            )}
          </div>
          <div className="font-serif-royal font-bold text-stone-900 text-sm leading-snug line-clamp-2">
            {displayName}
          </div>
        </div>

        {ancestor && (
          <div className="mt-2 text-[10px] font-mono text-stone-500 truncate">
            {ancestor.rkfNumber} · {lang === 'en' && ancestor.colorEn ? ancestor.colorEn : ancestor.color}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-amber-700" />
          <span>
            {lang === 'en' 
              ? '4-Generation Interactive Pedigree Tree (FCI / Europe & The Kennel Club UK)' 
              : 'Интерактивная 4-коленная родословная (FCI / Европа & The Kennel Club UK)'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-stone-500">
          Fx: <strong className="text-amber-900 font-semibold">{dog.inbreedingCoeff || 2.1}%</strong>
        </div>
      </div>

      {/* Visual Pedigree Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        
        {/* Column 1: Root Dog */}
        <div className="flex flex-col justify-center">
          <div className="text-[10px] uppercase font-semibold text-stone-400 mb-1">
            {lang === 'en' ? 'Subject Dog' : 'Пробанд'}
          </div>
          {renderCard(dog, dog.registeredName, lang === 'en' ? 'Proband' : 'Исследуемая собака', 'root')}
        </div>

        {/* Column 2: Parents */}
        <div className="flex flex-col justify-around gap-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-semibold text-sky-700">
              {lang === 'en' ? 'Sire (Father)' : 'Отец (Sire)'}
            </div>
            {renderCard(sire, dog.sireName, lang === 'en' ? 'Sire' : 'Отец', 'sire')}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-semibold text-rose-700">
              {lang === 'en' ? 'Dam (Mother)' : 'Мать (Dam)'}
            </div>
            {renderCard(dam, dog.damName, lang === 'en' ? 'Dam' : 'Мать', 'dam')}
          </div>
        </div>

        {/* Column 3: Grandparents */}
        <div className="flex flex-col justify-between gap-2">
          {renderCard(paternalGrandSire, 'Star of Danubia White Falcon', lang === 'en' ? 'Paternal Grandsire' : 'Дед по отцу', 'sire')}
          {renderCard(paternalGrandDam, 'Imperial Pearl Metelitsa', lang === 'en' ? 'Paternal Granddam' : 'Бабка по отцу', 'sire')}
          {renderCard(maternalGrandSire, 'Alpen Royal Svyatogor', lang === 'en' ? 'Maternal Grandsire' : 'Дед по матери', 'dam')}
          {renderCard(maternalGrandDam, 'Silver Breeze Lada', lang === 'en' ? 'Maternal Granddam' : 'Бабка по матери', 'dam')}
        </div>

        {/* Column 4: Great-Grandparents (Generation 4) */}
        <div className="flex flex-col justify-between gap-1 text-[11px]">
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-sky-700 font-semibold">{lang === 'en' ? 'Great-Grandsire (P.P.)' : 'Прадед (О.О.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Danube Royal Monarch</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-sky-700 font-semibold">{lang === 'en' ? 'Great-Granddam (P.P.)' : 'Прабабка (О.О.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Star of Danubia Aurora</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-sky-700 font-semibold">{lang === 'en' ? 'Great-Grandsire (P.M.)' : 'Прадед (О.М.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Imperial Crown Sterling</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-sky-700 font-semibold">{lang === 'en' ? 'Great-Granddam (P.M.)' : 'Прабабка (О.М.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Vienna Snow Pearl</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-rose-700 font-semibold">{lang === 'en' ? 'Great-Grandsire (M.P.)' : 'Прадед (М.О.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Alpen Snow Knight</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-rose-700 font-semibold">{lang === 'en' ? 'Great-Granddam (M.P.)' : 'Прабабка (М.О.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Bavarian Star Otrada</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-rose-700 font-semibold">{lang === 'en' ? 'Great-Grandsire (M.M.)' : 'Прадед (М.М.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Silver Falcon of Danube</div>
          </div>
          <div className="p-2 rounded border border-stone-200 bg-stone-50/80">
            <div className="text-[9px] text-rose-700 font-semibold">{lang === 'en' ? 'Great-Granddam (M.M.)' : 'Прабабка (М.М.)'}</div>
            <div className="font-serif-royal font-semibold text-stone-900 truncate">Danube Breeze Metelitsa</div>
          </div>
        </div>
      </div>

      {hoveredDog && (
        <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-semibold text-stone-900">
                {lang === 'en' && hoveredDog.registeredNameEn ? hoveredDog.registeredNameEn : hoveredDog.registeredName}
              </span>
              <span className="text-stone-600">
                {' '}· {lang === 'en' ? 'Color' : 'Окрас'}: {lang === 'en' && hoveredDog.colorEn ? hoveredDog.colorEn : hoveredDog.color} 
                {' '}· {lang === 'en' ? 'Height' : 'Рост'}: {hoveredDog.heightCm} cm 
                {' '}· FCI: {hoveredDog.rkfNumber}
              </span>
            </div>
          </div>
          <span className="text-amber-900 font-medium underline">
            {lang === 'en' ? 'Click to view profile' : 'Нажмите для просмотра'}
          </span>
        </div>
      )}
    </div>
  );
}
