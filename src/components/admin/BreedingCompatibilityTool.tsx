import { useState, useMemo } from 'react';
import { Dog, BreedingCompatibilityResult, Litter } from '../../types/kennel';
import { calculateBreedingCompatibility } from '../../utils/genetics';
import { 
  Dna, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  PlusCircle, 
  Trophy,
  Scale
} from 'lucide-react';

interface BreedingCompatibilityToolProps {
  dogs: Dog[];
  onAddLitter?: (litterData: Partial<Litter>) => void;
}

export function BreedingCompatibilityTool({ dogs, onAddLitter }: BreedingCompatibilityToolProps) {
  // Potential sires (males) and dams (females)
  const sires = dogs.filter((d) => d.sex === 'male');
  const dams = dogs.filter((d) => d.sex === 'female');

  const [selectedSireId, setSelectedSireId] = useState<string>(sires[0]?.id || '');
  const [selectedDamId, setSelectedDamId] = useState<string>(dams[0]?.id || '');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedSire = dogs.find((d) => d.id === selectedSireId);
  const selectedDam = dogs.find((d) => d.id === selectedDamId);

  const compatibilityResult: BreedingCompatibilityResult | null = useMemo(() => {
    if (!selectedSire || !selectedDam) return null;
    return calculateBreedingCompatibility(selectedSire, selectedDam, dogs);
  }, [selectedSire, selectedDam, dogs]);

  const handlePlanLitter = () => {
    if (!compatibilityResult || !onAddLitter) return;
    const { sire, dam, inbreedingCoeff } = compatibilityResult;

    const newLitter: Partial<Litter> = {
      letter: 'Д',
      matingDate: new Date().toISOString().split('T')[0],
      birthDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sireId: sire.id,
      sireName: sire.registeredName,
      damId: dam.id,
      damName: dam.registeredName,
      inbreedingCoeff,
      puppiesCount: 0,
      malesCount: 0,
      femalesCount: 0,
      status: 'planned',
      description: `Планируемый помет от пары ${sire.callName} × ${dam.callName}. Расчетный инбридинг: ${inbreedingCoeff.toFixed(2)}%. Генетика DM: ${sire.genetics.dm.code} × ${dam.genetics.dm.code}.`,
      puppies: [],
    };

    onAddLitter(newLitter);
    setSuccessToast(`Помет от пары ${sire.callName} и ${dam.callName} успешно внесен в селекционный план!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-800 mb-1">
          <Dna className="w-4 h-4 text-amber-700" />
          <span>Зоотехнический калькулятор вязок и совместимости</span>
        </div>
        <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-stone-900">
          Анализ генетической совместимости пары
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Автоматический расчет наследования дегенеративной миелопатии (DM), кардиоскрининга (DCM), коэффициента инбридинга Райта (Fx) по 4 коленам предков и вероятности окрасов щенков.
        </p>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* PAIR SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sire Selector */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              Выбор кобеля (Sire / Отец)
            </label>
            <span className="text-[11px] text-stone-500">Доступно: {sires.length} кобелей</span>
          </div>

          <select
            value={selectedSireId}
            onChange={(e) => setSelectedSireId(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-hidden font-medium text-stone-800"
          >
            {sires.map((s) => (
              <option key={s.id} value={s.id}>
                {s.registeredName} ({s.callName}) · DM: {s.genetics.dm.code}
              </option>
            ))}
          </select>

          {selectedSire && (
            <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center gap-3">
              <img
                src={selectedSire.photoUrl}
                alt={selectedSire.registeredName}
                className="w-16 h-16 rounded-xl object-cover border border-sky-200"
              />
              <div className="text-xs space-y-0.5">
                <div className="font-serif-royal font-bold text-stone-900 text-sm">
                  {selectedSire.registeredName}
                </div>
                <div className="text-stone-600">
                  Окрас: <span className="font-medium text-stone-800">{selectedSire.color}</span> · Рост: {selectedSire.heightCm} см
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    selectedSire.genetics.dm.code === 'N/N' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    DM: {selectedSire.genetics.dm.code}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    FCI: {selectedSire.rkfNumber}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dam Selector */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Выбор суки (Dam / Мать)
            </label>
            <span className="text-[11px] text-stone-500">Доступно: {dams.length} сук</span>
          </div>

          <select
            value={selectedDamId}
            onChange={(e) => setSelectedDamId(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-600 focus:outline-hidden font-medium text-stone-800"
          >
            {dams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.registeredName} ({d.callName}) · DM: {d.genetics.dm.code}
              </option>
            ))}
          </select>

          {selectedDam && (
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center gap-3">
              <img
                src={selectedDam.photoUrl}
                alt={selectedDam.registeredName}
                className="w-16 h-16 rounded-xl object-cover border border-rose-200"
              />
              <div className="text-xs space-y-0.5">
                <div className="font-serif-royal font-bold text-stone-900 text-sm">
                  {selectedDam.registeredName}
                </div>
                <div className="text-stone-600">
                  Окрас: <span className="font-medium text-stone-800">{selectedDam.color}</span> · Рост: {selectedDam.heightCm} см
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                    selectedDam.genetics.dm.code === 'N/N' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    DM: {selectedDam.genetics.dm.code}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    FCI: {selectedDam.rkfNumber}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPATIBILITY RESULTS VIEW */}
      {compatibilityResult && (
        <div className="space-y-6">
          
          {/* VERDICT BANNER */}
          <div className={`p-6 rounded-2xl border shadow-xs ${
            compatibilityResult.overallRating === 'recommended'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : compatibilityResult.overallRating === 'acceptable'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {compatibilityResult.overallRating === 'recommended' ? (
                  <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                ) : compatibilityResult.overallRating === 'acceptable' ? (
                  <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div>
                  <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                    Зоотехнический вердикт подбора:
                  </div>
                  <h3 className="font-serif-royal text-2xl font-bold">
                    {compatibilityResult.overallRating === 'recommended'
                      ? 'Вязка рекомендована · Идеальная генетическая совместимость'
                      : compatibilityResult.overallRating === 'acceptable'
                      ? 'Вязка допустима с обязательным контролем потомства'
                      : 'ВЯЗКА ЗАПРЕЩЕНА ИЛИ КРИТИЧЕСКИ ОПАСНА!'}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 opacity-90">
                    {compatibilityResult.isSafeMating
                      ? 'В данном сочетании исключено появление щенков, генетически больных дегенеративной миелопатией или тяжелыми пороками сердца.'
                      : 'Внимание: выявлен высокий риск передачи тяжелых наследственных мутаций потомству.'}
                  </p>
                </div>
              </div>

              {compatibilityResult.isSafeMating && onAddLitter && (
                <button
                  onClick={handlePlanLitter}
                  className="py-3 px-5 bg-stone-900 hover:bg-stone-950 text-white font-medium text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Внести помет в план вязок</span>
                </button>
              )}
            </div>

            {/* Warnings list if any */}
            {compatibilityResult.warnings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-rose-200/60 space-y-1.5 text-xs text-rose-900">
                {compatibilityResult.warnings.map((warn, wIdx) => (
                  <div key={wIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                    <span className="font-medium">{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TWO COLUMNS: HEALTH GENETICS vs INBREEDING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Health Risks Table */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Наследственные заболевания & Риски
                </h4>
                <span className="text-xs text-stone-500 font-mono">Менделевский прогноз</span>
              </div>

              <div className="space-y-3">
                {compatibilityResult.geneticHealthRisks.map((risk, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{risk.disease}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        risk.severity === 'safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : risk.severity === 'caution'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {risk.severity === 'safe' ? 'Безопасно' : risk.severity === 'caution' ? 'Внимание' : 'Опасно'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-stone-600 text-[11px]">
                      <span>Отец: <strong className="font-mono text-stone-800">{risk.sireStatus}</strong></span>
                      <span>Мать: <strong className="font-mono text-stone-800">{risk.damStatus}</strong></span>
                    </div>

                    <div className="text-stone-800 font-medium bg-white p-2 rounded border border-stone-200/80">
                      Прогноз щенков: {risk.offspringRisk}
                    </div>

                    <p className="text-stone-500 text-[11px] leading-relaxed">
                      {risk.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Wright's Inbreeding & Ancestors */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-700" />
                  Коэффициент инбридинга Райта (Fx)
                </h4>
                <div className="font-serif-royal text-2xl font-bold text-stone-900">
                  {compatibilityResult.inbreedingCoeff.toFixed(2)}%
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Классификация инбридинга:</span>
                  <span className="font-bold text-stone-900">
                    {compatibilityResult.inbreedingCoeff < 3
                      ? 'Ауткросс (Неродственный подбор)'
                      : compatibilityResult.inbreedingCoeff < 6.25
                      ? 'Умеренный инбридинг (Лайнбридинг)'
                      : compatibilityResult.inbreedingCoeff < 12.5
                      ? 'Средний инбридинг (на предка III-III)'
                      : 'Тесный инбридинг (Высокая концентрация кровей)'}
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      compatibilityResult.inbreedingCoeff < 6.25
                        ? 'bg-emerald-500'
                        : compatibilityResult.inbreedingCoeff < 12.5
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(compatibilityResult.inbreedingCoeff * 5, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Оптимальный селекционный диапазон для русской борзой: 1.5% - 6.25% для закрепления правильного типа псовины и головы без риска инбредной депрессии.
                </p>
              </div>

              {/* Common Ancestors List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                  Общие предки в 4 коленах родословной:
                </div>
                {compatibilityResult.commonAncestors.length === 0 ? (
                  <div className="p-3 text-center text-xs text-stone-500 bg-stone-50 rounded-lg">
                    Общих предков в пределах 4 поколений не обнаружено (чистый ауткросс).
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {compatibilityResult.commonAncestors.map((anc, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                      >
                        <div className="truncate max-w-[240px]">
                          <span className="font-semibold text-stone-900">{anc.dogName}</span>
                          <div className="text-[10px] text-stone-500">
                            Колено отца: {anc.generationSire} · Колено матери: {anc.generationDam}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-900">
                          +{anc.contribution}% Fx
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* COAT COLOR PROBABILITIES */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-serif-royal text-xl font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Прогноз наследования окрасов щенков
              </h4>
              <span className="text-xs text-stone-500">
                Отец: {compatibilityResult.sire.color} × Мать: {compatibilityResult.dam.color}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {compatibilityResult.colorPredictions.map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-royal font-bold text-stone-900 text-base">
                      {col.color}
                    </span>
                    <span className="font-mono font-bold text-amber-900 text-sm bg-amber-100 px-2 py-0.5 rounded">
                      {col.probability}%
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {col.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
