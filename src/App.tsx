/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Dog, Litter, Exhibition, ExhibitionAward, Puppy } from './types/kennel';
import { 
  INITIAL_DOGS, 
  INITIAL_LITTERS, 
  INITIAL_EXHIBITIONS, 
  INITIAL_AWARDS 
} from './data/mockData';
import { KennelLogo } from './components/common/KennelLogo';
import { KENNEL_BRAND } from './assets/logo';

// Public Portal Components (Level 2)
import { PublicHeader } from './components/public/PublicHeader';
import { HeroSection } from './components/public/HeroSection';
import { OurDogsSection } from './components/public/OurDogsSection';
import { PuppiesSection } from './components/public/PuppiesSection';
import { ShowsSection } from './components/public/ShowsSection';
import { PublicFooter } from './components/public/PublicFooter';
import { DogDetailModal } from './components/public/DogDetailModal';
import { PuppyInquiryModal } from './components/public/PuppyInquiryModal';

// Kennel Management System Components (Level 1)
import { AdminDashboard } from './components/admin/AdminDashboard';

// Database Schema & Concept (Architecture view)
import { DatabaseConceptView } from './components/schema/DatabaseConceptView';

import { Sparkles, Database, Layers, CheckCircle } from 'lucide-react';
import { Language } from './i18n/translations';

export default function App() {
  // App navigation mode:
  // 'public' = Level 2: Public Kennel Website
  // 'admin'  = Level 1: Kennel Management Database & Genetics
  // 'schema' = Concept & ERD Architecture
  const [currentMode, setCurrentMode] = useState<'public' | 'admin' | 'schema'>('public');

  // Website Language (RU / EN) - only for public kennel website as requested
  const [siteLanguage, setSiteLanguage] = useState<Language>('ru');

  // Shared application state
  const [dogs, setDogs] = useState<Dog[]>(INITIAL_DOGS);
  const [litters, setLitters] = useState<Litter[]>(INITIAL_LITTERS);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(INITIAL_EXHIBITIONS);
  const [awards, setAwards] = useState<ExhibitionAward[]>(INITIAL_AWARDS);

  // Modals state
  const [selectedDogModal, setSelectedDogModal] = useState<Dog | null>(null);
  const [selectedPuppyInquiry, setSelectedPuppyInquiry] = useState<Puppy | null>(null);
  const [selectedLitterInquiry, setSelectedLitterInquiry] = useState<Litter | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Current active section scroll for public view
  const [activeSection, setActiveSection] = useState('hero');

  // Available puppies count
  let availablePuppiesCount = 0;
  litters.forEach((litter) => {
    litter.puppies.forEach((pup) => {
      if (pup.status === 'available') availablePuppiesCount++;
    });
  });

  // Handlers for dogs
  const handleAddDog = (newDog: Dog) => {
    setDogs((prev) => [newDog, ...prev]);
  };

  const handleUpdateDog = (updatedDog: Dog) => {
    setDogs((prev) => prev.map((d) => (d.id === updatedDog.id ? updatedDog : d)));
  };

  const handleDeleteDog = (dogId: string) => {
    setDogs((prev) => prev.filter((d) => d.id !== dogId));
  };

  // Handlers for litters & puppies
  const handleUpdateLitter = (updatedLitter: Litter) => {
    setLitters((prev) => prev.map((l) => (l.id === updatedLitter.id ? updatedLitter : l)));
  };

  const handleAddLitter = (litterData: Partial<Litter>) => {
    const newLitter: Litter = {
      id: `litter-${Date.now()}`,
      letter: litterData.letter || 'Д',
      birthDate: litterData.birthDate || new Date().toISOString().split('T')[0],
      matingDate: litterData.matingDate || new Date().toISOString().split('T')[0],
      sireId: litterData.sireId || '',
      sireName: litterData.sireName || '',
      damId: litterData.damId || '',
      damName: litterData.damName || '',
      inbreedingCoeff: litterData.inbreedingCoeff || 2.0,
      puppiesCount: litterData.puppiesCount || 0,
      malesCount: litterData.malesCount || 0,
      femalesCount: litterData.femalesCount || 0,
      status: litterData.status || 'planned',
      description: litterData.description || 'Новый селекционный помет.',
      puppies: litterData.puppies || [],
    };
    setLitters((prev) => [newLitter, ...prev]);
  };

  // Handlers for exhibitions
  const handleAddExhibition = (newEx: Exhibition) => {
    setExhibitions((prev) => [newEx, ...prev]);
  };

  const handleAddAward = (newAward: ExhibitionAward) => {
    setAwards((prev) => [newAward, ...prev]);
  };

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDogById = (dogId: string) => {
    const dog = dogs.find((d) => d.id === dogId);
    if (dog) {
      setSelectedDogModal(dog);
    }
  };

  const handleOpenPuppyInquiry = (puppy: Puppy) => {
    setSelectedPuppyInquiry(puppy);
    setSelectedLitterInquiry(null);
    setIsInquiryModalOpen(true);
  };

  const handleOpenPlannedLitterInquiry = (litter: Litter) => {
    setSelectedLitterInquiry(litter);
    setSelectedPuppyInquiry(null);
    setIsInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans-clean antialiased selection:bg-amber-900/20 selection:text-amber-950">
      
      {/* PERSISTENT TOP LEVEL SWITCHER BAR */}
      <aside aria-label="Панель переключения уровней" className="bg-stone-950 text-stone-200 border-b border-stone-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <KennelLogo size="xs" showText={false} />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-200">
                {KENNEL_BRAND.name}
              </span>
              <span className="text-amber-400/80 font-mono text-[10px]">
                ({KENNEL_BRAND.subName})
              </span>
            </div>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="text-stone-400 hidden sm:inline">
              Двухуровневая кинологическая платформа
            </span>
          </div>

          {/* Level Switcher segmented controls */}
          <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded-lg border border-stone-700/80">
            <button
              onClick={() => setCurrentMode('public')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                currentMode === 'public'
                  ? 'bg-amber-900 text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Сайт питомника</span>
              <span className="text-[10px] opacity-75 font-mono">Уровень 2</span>
            </button>

            <button
              onClick={() => setCurrentMode('admin')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                currentMode === 'admin'
                  ? 'bg-amber-900 text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Племенная база</span>
              <span className="text-[10px] opacity-75 font-mono">Уровень 1</span>
            </button>

            <button
              onClick={() => setCurrentMode('schema')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                currentMode === 'schema'
                  ? 'bg-amber-900 text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>Концепция БД (ERD)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MODE 1: LEVEL 2 - PUBLIC KENNEL PORTAL */}
      {currentMode === 'public' && (
        <div className="animate-fadeIn">
          <PublicHeader
            currentSection={activeSection}
            onNavigate={scrollToSection}
            onSwitchToAdmin={() => setCurrentMode('admin')}
            onSwitchToSchema={() => setCurrentMode('schema')}
            availablePuppiesCount={availablePuppiesCount}
            lang={siteLanguage}
            onToggleLang={setSiteLanguage}
          />

          <main id="main-content">
            <HeroSection
              onNavigateSection={scrollToSection}
              onOpenDog={handleOpenDogById}
              availablePuppiesCount={availablePuppiesCount}
              lang={siteLanguage}
            />

            <OurDogsSection
              dogs={dogs}
              onOpenDog={(dog) => setSelectedDogModal(dog)}
              lang={siteLanguage}
            />

            <PuppiesSection
              litters={litters}
              dogs={dogs}
              onSelectPuppy={handleOpenPuppyInquiry}
              onSelectPlannedLitter={handleOpenPlannedLitterInquiry}
              onOpenDogById={handleOpenDogById}
              lang={siteLanguage}
            />

            <ShowsSection
              exhibitions={exhibitions}
              awards={awards}
              dogs={dogs}
              onOpenDogById={handleOpenDogById}
              lang={siteLanguage}
            />
          </main>

          <PublicFooter
            onNavigateSection={scrollToSection}
            onOpenInquiry={() => {
              setSelectedPuppyInquiry(null);
              setSelectedLitterInquiry(null);
              setIsInquiryModalOpen(true);
            }}
            lang={siteLanguage}
          />
        </div>
      )}

      {/* MODE 2: LEVEL 1 - KENNEL MANAGEMENT DATABASE */}
      {currentMode === 'admin' && (
        <AdminDashboard
          dogs={dogs}
          litters={litters}
          exhibitions={exhibitions}
          awards={awards}
          onAddDog={handleAddDog}
          onUpdateDog={handleUpdateDog}
          onDeleteDog={handleDeleteDog}
          onSelectDog={(dog) => setSelectedDogModal(dog)}
          onUpdateLitter={handleUpdateLitter}
          onAddLitter={handleAddLitter}
          onAddExhibition={handleAddExhibition}
          onAddAward={handleAddAward}
          onSwitchToPublic={() => setCurrentMode('public')}
          onSwitchToSchema={() => setCurrentMode('schema')}
        />
      )}

      {/* MODE 3: DATABASE ARCHITECTURE & SCHEMA CONCEPT (ERD & SQL) */}
      {currentMode === 'schema' && (
        <DatabaseConceptView
          onBackToApp={() => setCurrentMode('public')}
          onSwitchToAdmin={() => setCurrentMode('admin')}
        />
      )}

      {/* MODAL: DOG PROFILE & 4-GENERATION PEDIGREE */}
      {selectedDogModal && (
        <DogDetailModal
          dog={selectedDogModal}
          allDogs={dogs}
          awards={awards}
          onClose={() => setSelectedDogModal(null)}
          onSelectDog={(ancestor) => setSelectedDogModal(ancestor)}
          onRequestPuppy={() => {
            setSelectedDogModal(null);
            setSelectedPuppyInquiry(null);
            setSelectedLitterInquiry(null);
            setIsInquiryModalOpen(true);
          }}
          lang={siteLanguage}
        />
      )}

      {/* MODAL: PUPPY RESERVATION / INQUIRY */}
      {isInquiryModalOpen && (
        <PuppyInquiryModal
          puppy={selectedPuppyInquiry}
          litter={selectedLitterInquiry}
          onClose={() => {
            setIsInquiryModalOpen(false);
            setSelectedPuppyInquiry(null);
            setSelectedLitterInquiry(null);
          }}
          lang={siteLanguage}
        />
      )}

    </div>
  );
}
