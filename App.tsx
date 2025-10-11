import React, { useState, useMemo } from 'react';
import { usePersistentState } from './hooks/usePersistentState.ts';
import { Model, Grade, Domain } from './types.ts';
import { Header } from './components/Header.tsx';
import { DomainTabs } from './components/DomainTabs.tsx';
import { Summary } from './components/Summary.tsx';
import { DOMAINS } from './constants.ts';

const initialModel: Model = {
  learner: {
    name: 'Sophia',
    date: new Date().toISOString().split('T')[0],
    adult: '',
  },
  settings: {
    scaffolds: false,
    kidMode: false,
    tts: false,
    stickers: true,
  },
  domainNotes: {},
  overallNotes: '',
  activity: {},
};

function App() {
  const [model, setModel] = usePersistentState<Model>(initialModel);
  const [view, setView] = useState<'assessment' | 'summary'>('assessment');
  const [kidMode, setKidMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'All'>('1');

  React.useEffect(() => {
    setKidMode(model.settings.kidMode);
  }, [model.settings.kidMode]);

  const filteredDomains = useMemo((): Domain[] => {
    if (selectedGrade === 'All') {
      return DOMAINS;
    }
    return DOMAINS.map(domain => ({
      ...domain,
      activities: domain.activities.filter(activity => activity.grade === selectedGrade)
    })).filter(domain => domain.activities.length > 0); // Optionally hide domains with no activities for that grade
  }, [selectedGrade, DOMAINS]); // Added DOMAINS dependency

  return (
    <div className={`antialiased bg-slate-50 text-slate-700 min-h-screen ${kidMode ? 'text-lg' : ''}`}>
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <Header 
          model={model} 
          setModel={setModel} 
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
        />
        
        <main>
          {view === 'assessment' ? (
            <DomainTabs model={model} setModel={setModel} setView={setView} domains={filteredDomains} />
          ) : (
            <Summary model={model} setModel={setModel} setView={setView} domains={filteredDomains} />
          )}
        </main>

        <footer className="text-center text-sm text-slate-500 py-4">
          <p>&copy; {new Date().getFullYear()} Sophia's Playcheck. An example project.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;