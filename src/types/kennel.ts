export type DogSex = 'male' | 'female';

export type DogStatus = 
  | 'breeding'         // Активный производитель
  | 'veteran'          // Ветеран питомника
  | 'co_owned'         // В совладении
  | 'prospect'         // Молодая собака / племенная надежда
  | 'retired'          // Выведен из разведения
  | 'outside_stud';    // Сторонний кобель (для вязок)

export type BorzoiCoatColor = 
  | 'Белый'
  | 'Полово-пегий'
  | 'Бурматный'
  | 'Муругий'
  | 'Чубарый'
  | 'Серо-подпалый'
  | 'Черно-пегий'
  | 'Черный';

export type GeneticHealthResult = 'clean' | 'carrier' | 'affected' | 'not_tested';

export interface GeneticProfile {
  dm: {
    code: 'N/N' | 'N/DM' | 'DM/DM' | 'Pending';
    status: GeneticHealthResult;
    testDate?: string;
    laboratory?: string;
    certificateNumber?: string;
  };
  dcm: {
    status: 'clear' | 'equivocal' | 'affected' | 'not_tested';
    dopplerDate?: string;
    clinic?: string;
    verdict?: string;
  };
  mh: {
    code: 'N/N' | 'N/MH' | 'MH/MH' | 'not_tested';
    status: GeneticHealthResult;
  };
  eyes_ecvo: {
    status: 'clear' | 'carrier' | 'affected' | 'not_tested';
    lastExamDate?: string;
  };
  coat_genetics: {
    e_locus: string; // E/E, E/e, e/e (маска/рыжий)
    k_locus: string; // KB/ky, ky/ky, kbr/ky (чубарый/тигровый)
    a_locus: string; // Ay/Ay, Ay/at, at/at (соболиный/подпалый)
    b_locus: string; // B/B (черный пигмент мочки носа)
    d_locus: string; // D/D (не разбавленный)
  };
}

export interface Dog {
  id: string;
  rkfNumber: string;         // Registration number (FCI / SKJ / The Kennel Club UK)
  chipNumber: string;        // Номер микрочипа
  tattooNumber: string;      // Номер клейма / тату питомника
  registeredName: string;    // Официальная кличка по родословной
  registeredNameEn?: string; // English registered name
  callName: string;          // Домашнее имя
  callNameEn?: string;
  sex: DogSex;
  birthDate: string;
  color: BorzoiCoatColor;
  colorEn?: string;
  heightCm: number;          // Рост в холке (см)
  status: DogStatus;
  photoUrl: string;
  galleryUrls: string[];
  description: string;
  descriptionEn?: string;
  
  // Родословная
  sireId?: string;           // Отец
  sireName?: string;
  damId?: string;            // Мать
  damName?: string;
  inbreedingCoeff?: number;  // Собственный Fx (%)

  // Титулы и рабочие дипломы
  titles: string[];
  titlesEn?: string[];
  huntingDiplomas: string[]; // Полевые дипломы (курсинг CACIL, бега)
  huntingDiplomasEn?: string[];
  
  // Генетический паспорт
  genetics: GeneticProfile;

  // Владелец
  owner: {
    name: string;
    city: string;
    country?: string;
    isKennelOwned: boolean;
  };
}

export interface ExhibitionAward {
  id: string;
  dogId: string;
  dogName: string;
  exhibitionId: string;
  exhibitionName: string;
  date: string;
  city: string;
  judge: string;
  showClass: 'baby' | 'puppy' | 'junior' | 'intermediate' | 'open' | 'working' | 'champion' | 'veteran';
  evaluation: 'отлично' | 'очень хорошо' | 'хорошо' | 'CW';
  placement?: number; // 1, 2, 3, 4
  certificates: string[]; // CW, CAC, CACIB, RCAC, RCACIB, BOB, BOS, BOG-1, BIS-1, BIS-2, BIS-3, CC, RCC
  critique?: string; // Отзыв эксперта
  critiqueEn?: string;
}

export interface Exhibition {
  id: string;
  name: string;
  nameEn?: string;
  rank: 'CACIB' | 'CAC' | 'Crufts' | 'World Dog Show' | 'European Dog Show' | 'Specialty' | 'Championship' | 'Монопородная ЧК' | 'Монопородная ПК';
  date: string;
  city: string;
  country: string;
  organizer: string;
  judges: string[];
  status: 'upcoming' | 'completed';
  registeredDogIds: string[];
  description?: string;
  descriptionEn?: string;
  resultsSummary?: string;
  resultsSummaryEn?: string;
}

export interface Puppy {
  id: string;
  litterId: string;
  registeredName: string;
  registeredNameEn?: string;
  callName?: string;
  callNameEn?: string;
  sex: DogSex;
  color: BorzoiCoatColor;
  colorEn?: string;
  status: 'available' | 'reserved' | 'co_ownership' | 'staying_in_kennel' | 'sold';
  priceRub?: number;
  priceEur?: number;
  priceGbp?: number;
  photoUrl: string;
  collarColor: string;
  temperament: string;
  temperamentEn?: string;
  features: string[]; // 'Шоу-перспектива', 'Перспективен для курсинга', 'Идеален для семьи'
  featuresEn?: string[];
  microchip?: string;
  vaccinated: boolean;
}

export interface Litter {
  id: string;
  letter: string;             // Литера помета ("В", "Г", "Д"...)
  birthDate: string;
  matingDate: string;
  sireId: string;
  sireName: string;
  damId: string;
  damName: string;
  inbreedingCoeff: number;    // Fx помета
  puppiesCount: number;
  malesCount: number;
  femalesCount: number;
  puppies: Puppy[];
  status: 'planned' | 'nursing' | 'ready_for_new_home' | 'completed';
  description: string;
  descriptionEn?: string;
  notes?: string;
}

export interface BreedingCompatibilityResult {
  sire: Dog;
  dam: Dog;
  isSafeMating: boolean;
  overallRating: 'recommended' | 'acceptable' | 'high_risk' | 'prohibited';
  inbreedingCoeff: number; // Райт Fx %
  commonAncestors: {
    dogName: string;
    generationSire: number;
    generationDam: number;
    contribution: number;
  }[];
  geneticHealthRisks: {
    disease: string;
    sireStatus: string;
    damStatus: string;
    offspringRisk: string; // e.g. "0% больных, 50% носителей, 50% чистых"
    severity: 'safe' | 'caution' | 'dangerous';
    explanation: string;
  }[];
  colorPredictions: {
    color: string;
    probability: number;
    description: string;
  }[];
  recommendations: string[];
  warnings: string[];
}
