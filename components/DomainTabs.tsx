import React from 'react';
import { Model, Domain } from '../../types.ts';
import { ActivityCard } from './ActivityCard.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs.tsx';
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Label } from './ui/Label.tsx';
import { percentComplete } from '../../lib/utils.ts';
import { Send } from 'lucide-react';

interface DomainTabsProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
  setView: (view: 'assessment' | 'summary') => void;
  domains: Domain[];
}

const domainBgColors: Record<string, string> = {
  'reading-&-language-arts': 'bg-green-50/50',
  'mathematics': 'bg-yellow-50/50',
  'science': 'bg-sky-50/50',
  'social-studies': 'bg-orange-50/50',
  'social-emotional-learning': 'bg-pink-50/50',
  'executive-functioning': 'bg-purple-50/50'
};


export const DomainTabs: React.FC<DomainTabsProps> = ({ model, setModel, setView, domains }) => {
    const handleDomainNotesChange = (domainKey: string, notes: string) => {
        setModel(prev => ({
            ...prev,
            domainNotes: { ...prev.domainNotes, [domainKey]: notes },
        }));
    };
    const completion = percentComplete(model, domains);

  return (
    <Tabs defaultValue={domains[0]?.key}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <TabsList>
          {domains.map(domain => (
            <TabsTrigger key={domain.key} value={domain.key}>
              {domain.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {completion === 100 && domains.length > 0 ? (
             <Button onClick={() => setView('summary')} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white animate-pulse">
                🎉 View Final Summary! 🎉
            </Button>
        ) : (
             <Button onClick={() => setView('summary')} variant="outline">
                View Summary & Next Steps <Send className="w-4 h-4 ml-2"/>
            </Button>
        )}
      </div>
      {domains.map(domain => (
        <TabsContent key={domain.key} value={domain.key} className={`p-4 rounded-xl border ${domainBgColors[domain.key] || 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domain.activities.length > 0 ? domain.activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} model={model} setModel={setModel} />
            )) : <p className="md:col-span-2 text-center text-slate-500 py-8">No activities for this grade level in this domain.</p>}
            
            {domain.activities.length > 0 && 
            <div className="md:col-span-2">
                 <Label htmlFor={`notes-${domain.key}`} className="font-semibold">Notes for {domain.label}</Label>
                 <Textarea 
                    id={`notes-${domain.key}`}
                    className="mt-2"
                    placeholder={`Any observations specific to ${domain.label.toLowerCase()}...`}
                    value={model.domainNotes[domain.key] || ''}
                    onChange={(e) => handleDomainNotesChange(domain.key, e.target.value)}
                 />
            </div>
            }
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};