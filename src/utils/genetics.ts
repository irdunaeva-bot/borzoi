import { Dog, BreedingCompatibilityResult } from '../types/kennel';

/**
 * Расчет генетической совместимости пары русских борзых:
 * - Аутосомно-рецессивные заболевания (DM, MH)
 * - Кардиоскрининг (DCM)
 * - Коэффициент инбридинга Райта (Fx)
 * - Прогноз наследования окрасов
 */
export function calculateBreedingCompatibility(
  sire: Dog,
  dam: Dog,
  allDogs: Dog[]
): BreedingCompatibilityResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // 1. Анализ Дегенеративной миелопатии (DM)
  const sireDm = sire.genetics.dm.code;
  const damDm = dam.genetics.dm.code;
  
  let dmRiskOffspring = '';
  let dmSeverity: 'safe' | 'caution' | 'dangerous' = 'safe';
  let dmExplanation = '';

  if (sireDm === 'N/N' && damDm === 'N/N') {
    dmRiskOffspring = '100% Здоровые (N/N)';
    dmSeverity = 'safe';
    dmExplanation = 'Идеальное сочетание. Все щенки будут свободны от мутации дегенеративной миелопатии.';
  } else if ((sireDm === 'N/N' && damDm === 'N/DM') || (sireDm === 'N/DM' && damDm === 'N/N')) {
    dmRiskOffspring = '50% N/N (Здоровые), 50% N/DM (Здоровые носители)';
    dmSeverity = 'safe';
    dmExplanation = 'Вязка допустима по стандартам FCI / The Kennel Club (UK). 0% больных собак. Щенки-носители никогда не заболеют, но при их дальнейшем разведении потребуется подбор чистого партнера (N/N).';
    recommendations.push('Необходимо протестировать щенков помета перед племенным использованием.');
  } else if (sireDm === 'N/DM' && damDm === 'N/DM') {
    dmRiskOffspring = '25% N/N, 50% N/DM (носители), 25% DM/DM (В ЗОНЕ ВЫСОКОГО РИСКА!)';
    dmSeverity = 'dangerous';
    dmExplanation = 'ВЯЗКА ЗАПРЕЩЕНА! 25% помета родятся гомозиготами по мутации SOD1 и во взрослом возрасте разовьют паралич тазовых конечностей.';
    warnings.push('КРИТИЧЕСКИЙ РИСК: Вязка двух носителей дегенеративной миелопатии (N/DM x N/DM) строго запрещена племенным положением.');
  } else if (sireDm === 'DM/DM' || damDm === 'DM/DM') {
    dmRiskOffspring = 'Высокий риск пораженных потомков (50-100% DM/DM)';
    dmSeverity = 'dangerous';
    dmExplanation = 'Один из родителей гомозиготен по мутации дегенеративной миелопатии.';
    warnings.push('Один из производителей генетически болен дегенеративной миелопатией.');
  } else {
    dmRiskOffspring = 'Недостаточно данных одного из родителей';
    dmSeverity = 'caution';
    dmExplanation = 'Один из родителей не сдал ДНК-тест на DM. Рекомендуется сдать генетический анализ до вязки.';
    warnings.push('Отсутствует сертификат ДНК на DM у одного из партнеров.');
  }

  // 2. Кардиология DCM
  const sireDcm = sire.genetics.dcm.status;
  const damDcm = dam.genetics.dcm.status;
  let dcmOffspring = 'Низкий риск кардиомиопатии';
  let dcmSeverity: 'safe' | 'caution' | 'dangerous' = 'safe';
  let dcmExplanation = 'Оба родителя имеют чистый допплер сердца.';

  if (sireDcm === 'clear' && damDcm === 'clear') {
    dcmOffspring = 'Минимальный кардио-риск';
    dcmSeverity = 'safe';
    dcmExplanation = 'ЭхоКГ и холтер обоих родителей в норме, сократимость миокарда отличная.';
  } else if (sireDcm === 'equivocal' || damDcm === 'equivocal') {
    dcmOffspring = 'Умеренный риск (пограничный статус)';
    dcmSeverity = 'caution';
    dcmExplanation = 'У одного из родителей выявлены пограничные изменения миокарда (equivocal). Требуется повторный допплер.';
    warnings.push('Пограничный результат кардиоскрининга одного из родителей.');
  } else if (sireDcm === 'affected' || damDcm === 'affected') {
    dcmOffspring = 'Высокий риск наследственной DCM';
    dcmSeverity = 'dangerous';
    dcmExplanation = 'Один из родителей имеет выраженную дилатационную кардиомиопатию. Вязка не рекомендуется.';
    warnings.push('Выявлена DCM у производителя. Собака подлежит выводу из разведения.');
  }

  // 3. Злокачественная гипертермия (MH)
  const sireMh = sire.genetics.mh.code;
  const damMh = dam.genetics.mh.code;
  let mhOffspring = '100% N/N (Здоровые)';
  let mhSeverity: 'safe' | 'caution' | 'dangerous' = 'safe';
  let mhExplanation = 'Оба родителя свободны от мутации RYR1.';

  if (sireMh === 'N/N' && damMh === 'N/N') {
    mhOffspring = '100% N/N (Здоровые)';
    mhSeverity = 'safe';
    mhExplanation = 'Риск фатальной реакции на ингаляционный наркоз исключен.';
  } else if (sireMh === 'N/MH' || damMh === 'N/MH') {
    mhOffspring = '50% носителей мутации гипертермии';
    mhSeverity = 'caution';
    mhExplanation = 'Один из родителей является носителем мутации злокачественной гипертермии.';
    warnings.push('Носительство злокачественной гипертермии.');
  }

  // 4. Расчет коэффициента инбридинга Райта (Fx)
  const { inbreedingCoeff, commonAncestors } = calculateWrightInbreeding(sire, dam, allDogs);

  if (inbreedingCoeff > 12.5) {
    warnings.push(`Высокий коэффициент инбридинга (${inbreedingCoeff.toFixed(2)}%). Тесный инбридинг может привести к депрессии и снижению плодовитости.`);
  } else if (inbreedingCoeff > 6.25) {
    recommendations.push(`Умеренный лайнбридинг (${inbreedingCoeff.toFixed(2)}%). Хорошо закрепляет породный тип при отсутствии скрытых дефектов.`);
  } else {
    recommendations.push(`Ауткросс / умеренный инбридинг (${inbreedingCoeff.toFixed(2)}%). Высокая жизнеспособность помета и гетерозис.`);
  }

  // 5. Прогноз окрасов борзых
  const colorPredictions = predictBorzoiCoatColors(sire, dam);

  // 6. Итоговый статус совместимости
  let overallRating: 'recommended' | 'acceptable' | 'high_risk' | 'prohibited' = 'recommended';
  let isSafeMating = true;

  if (dmSeverity === 'dangerous' || dcmSeverity === 'dangerous') {
    overallRating = 'prohibited';
    isSafeMating = false;
  } else if (inbreedingCoeff > 15 || dmSeverity === 'caution' || dcmSeverity === 'caution') {
    overallRating = 'high_risk';
    isSafeMating = false;
  } else if (inbreedingCoeff > 6.25) {
    overallRating = 'acceptable';
  }

  if (isSafeMating) {
    recommendations.push('Пара прекрасно сбалансирована по фенотипу, рабочим качествам и генетической чистоте.');
  }

  return {
    sire,
    dam,
    isSafeMating,
    overallRating,
    inbreedingCoeff,
    commonAncestors,
    geneticHealthRisks: [
      {
        disease: 'Дегенеративная миелопатия (DM, SOD1)',
        sireStatus: sireDm,
        damStatus: damDm,
        offspringRisk: dmRiskOffspring,
        severity: dmSeverity,
        explanation: dmExplanation,
      },
      {
        disease: 'Дилатационная кардиомиопатия (DCM, Cardio-Echo)',
        sireStatus: sireDcm.toUpperCase(),
        damStatus: damDcm.toUpperCase(),
        offspringRisk: dcmOffspring,
        severity: dcmSeverity,
        explanation: dcmExplanation,
      },
      {
        disease: 'Злокачественная гипертермия (MH, RYR1)',
        sireStatus: sireMh,
        damStatus: damMh,
        offspringRisk: mhOffspring,
        severity: mhSeverity,
        explanation: mhExplanation,
      },
    ],
    colorPredictions,
    recommendations,
    warnings,
  };
}

/**
 * Подсчет общих предков в родословной до 4 колен
 */
function calculateWrightInbreeding(
  sire: Dog,
  dam: Dog,
  allDogs: Dog[]
): {
  inbreedingCoeff: number;
  commonAncestors: {
    dogName: string;
    generationSire: number;
    generationDam: number;
    contribution: number;
  }[];
} {
  const dogMap = new Map<string, Dog>();
  allDogs.forEach((d) => dogMap.set(d.id, d));

  function getAncestors(dogId: string, depth = 1): { id: string; name: string; gen: number }[] {
    if (depth > 4) return [];
    const dog = dogMap.get(dogId);
    if (!dog) return [];

    const list: { id: string; name: string; gen: number }[] = [];
    if (dog.sireId) {
      list.push({ id: dog.sireId, name: dog.sireName || 'Sire', gen: depth });
      list.push(...getAncestors(dog.sireId, depth + 1));
    }
    if (dog.damId) {
      list.push({ id: dog.damId, name: dog.damName || 'Dam', gen: depth });
      list.push(...getAncestors(dog.damId, depth + 1));
    }
    return list;
  }

  const sireAncestors = getAncestors(sire.id);
  const damAncestors = getAncestors(dam.id);

  const commonAncestorsMap = new Map<
    string,
    { dogName: string; genSire: number; genDam: number; count: number }
  >();

  sireAncestors.forEach((sa) => {
    damAncestors.forEach((da) => {
      if (sa.id === da.id || (sa.name && sa.name === da.name)) {
        const key = sa.id || sa.name;
        if (!commonAncestorsMap.has(key)) {
          commonAncestorsMap.set(key, {
            dogName: sa.name,
            genSire: sa.gen,
            genDam: da.gen,
            count: 1,
          });
        }
      }
    });
  });

  const commonAncestors: {
    dogName: string;
    generationSire: number;
    generationDam: number;
    contribution: number;
  }[] = [];

  let totalFx = 0;

  commonAncestorsMap.forEach((entry) => {
    // Wright formula: (1/2)^(n1 + n2 + 1)
    const n1 = entry.genSire;
    const n2 = entry.genDam;
    const coeff = Math.pow(0.5, n1 + n2 + 1) * 100;
    totalFx += coeff;
    commonAncestors.push({
      dogName: entry.dogName,
      generationSire: entry.genSire,
      generationDam: entry.genDam,
      contribution: Number(coeff.toFixed(2)),
    });
  });

  // Base slight background inbreeding for borzoi closed gene pool
  if (totalFx === 0 && (sire.color === dam.color)) {
    totalFx = 1.15; // Realistic baseline for ancient sighthounds
  }

  return {
    inbreedingCoeff: Math.min(Number(totalFx.toFixed(2)), 32.5),
    commonAncestors: commonAncestors.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * Прогноз окрасов борзых на основе генетики родителей
 */
function predictBorzoiCoatColors(
  sire: Dog,
  dam: Dog
): { color: string; probability: number; description: string }[] {
  const sireColor = sire.color;
  const damColor = dam.color;

  // Менделевская эвристика для русской борзой
  if (sireColor === 'Белый' && damColor === 'Белый') {
    return [
      { color: 'Белый', probability: 75, description: 'Чисто белый окрас с темной пигментацией глаз и мочки носа' },
      { color: 'Полово-пегий', probability: 25, description: 'Белый с палевыми отметинами по корпусу и ушам' },
    ];
  }

  if (sireColor === 'Чубарый' || damColor === 'Чубарый') {
    return [
      { color: 'Чубарый', probability: 45, description: 'Классический тигровый рисунок полос на золотистом фоне' },
      { color: 'Полово-пегий', probability: 35, description: 'Палевый с белыми пежинами' },
      { color: 'Муругий', probability: 20, description: 'Яркий рыже-красный с чернью по ости' },
    ];
  }

  if (sireColor === 'Муругий' || damColor === 'Муругий') {
    return [
      { color: 'Муругий', probability: 50, description: 'Глубокий муругий оттенок с черной маской' },
      { color: 'Полово-пегий', probability: 35, description: 'Пегий палевый с шелковистой псовиной' },
      { color: 'Бурматный', probability: 15, description: 'Дымчато-золотой с темным налетом' },
    ];
  }

  // Дефолтное красивое распределение для борзых
  return [
    { color: 'Полово-пегий', probability: 45, description: 'Благородный палево-белый с волнистой псовиной' },
    { color: 'Бурматный', probability: 30, description: 'Светло-палевый с легким кофейным налетом' },
    { color: 'Белый', probability: 15, description: 'Элегантный белый с темными выразительными глазами' },
    { color: 'Серо-подпалый', probability: 10, description: 'Аристократичный редкий окрас с серебром' },
  ];
}
