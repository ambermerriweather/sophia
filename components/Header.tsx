import React from 'react';
import { Model, Settings, Grade } from '../../types.ts';
import { percentComplete, overallStatus } from '../../lib/utils.ts';
import { Progress } from './ui/Progress.tsx';
import { Label } from './ui/Label.tsx';
import { Switch } from './ui/Switch.tsx';
import { Input } from './ui/Input.tsx';
import { GradeSelector } from './GradeSelector.tsx';
import { DOMAINS } from '../../constants.ts'; // Import for overall progress calculation

interface HeaderProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
  selectedGrade: Grade | 'All';
  setSelectedGrade: (grade: Grade | 'All') => void;
}

const gradeDisplayMap = {
    'K': 'Kindergarten',
    '1': '1st Grade',
    '2': '2nd Grade',
    'All': 'K-2 Full'
}

export const Header: React.FC<HeaderProps> = ({ model, setModel, selectedGrade, setSelectedGrade }) => {
  // Always calculate overall progress against the full set of domains.
  const completion = percentComplete(model, DOMAINS); 

  const handleSettingsChange = (key: keyof Settings, value: boolean) => {
    setModel(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  };

  const handleLearnerChange = (key: keyof Model['learner'], value: string) => {
    setModel(prev => ({
        ...prev,
        learner: { ...prev.learner, [key]: value },
    }));
  }
  
  const gradeDisplayName = gradeDisplayMap[selectedGrade];

  return (
    <header className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">Sophia’s {gradeDisplayName} Playcheck</h1>
        <p className="mt-2 text-lg text-slate-600">An informal, play-based check-in on skills and development.</p>
      </div>

      <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/80 space-y-4">
        <GradeSelector selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} />
        <p className="text-center text-sm text-slate-600 max-w-3xl mx-auto">
            This tool lets us check in on skills any time across the first three years of her education. Let's start with <strong>1st Grade</strong> to get a baseline. We can bridge up or down depending on how she does, but we should never test all three grades on the same day—that would be overwhelming!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
                <Label htmlFor="learnerName">Child's Name</Label>
                <Input id="learnerName" value={model.learner.name} onChange={e => handleLearnerChange('name', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="observerName">Observer's Name</Label>
                <Input id="observerName" placeholder="e.g., Mom, Dad, Grandma" value={model.learner.adult} onChange={e => handleLearnerChange('adult', e.target.value)} />
            </div>
             <div>
                <Label htmlFor="checkDate">Date</Label>
                <Input id="checkDate" type="date" value={model.learner.date} onChange={e => handleLearnerChange('date', e.target.value)} />
            </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch id="scaffolds" checked={model.settings.scaffolds} onCheckedChange={(c) => handleSettingsChange('scaffolds', c)} />
            <Label htmlFor="scaffolds">Provide Extra Help</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="kidMode" checked={model.settings.kidMode} onCheckedChange={(c) => handleSettingsChange('kidMode', c)} />
            <Label htmlFor="kidMode">Kid Mode (Larger Text)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="tts" checked={model.settings.tts} onCheckedChange={(c) => handleSettingsChange('tts', c)} />
            <Label htmlFor="tts">Enable Read Aloud</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="stickers" checked={model.settings.stickers} onCheckedChange={(c) => handleSettingsChange('stickers', c)} />
            <Label htmlFor="stickers">Enable Stickers</Label>
          </div>
        </div>

        <div className="pt-4 border-t">
            <div className="flex justify-between mb-1">
                <Label>Total Progress (All Grades)</Label>
                <span className="text-sm font-medium text-slate-700">{completion}%</span>
            </div>
            <Progress value={completion} />
        </div>
      </div>
    </header>
  );
};