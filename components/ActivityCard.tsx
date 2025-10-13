
import React, { useState, useEffect } from 'react';
import { Activity, Model, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState } from '../types.ts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card.tsx';
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Label } from './ui/Label.tsx';
import { Badge } from './ui/Badge.tsx';
import { CheckCircle, Clock, Play, Star, Info } from 'lucide-react';
import { BrainBreakModal } from './BrainBreakModal.tsx';
import { GeneratedContent } from './GeneratedContent.tsx';
import { TimedTask } from './TimedTask.tsx'; // Import the new component

interface ActivityCardProps {
  activity: Activity;
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const stickerEmojis = ['🌟', '🚀', '🦄', '🍎', '💡', '🏆', '🌈', '✅', '👍', '🧠'];
const getRandomSticker = () => stickerEmojis[Math.floor(Math.random() * stickerEmojis.length)];

type ActivityStatus = 'idle' | 'running' | 'completed';

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, model, setModel }) => {
  const state = model.activity[activity.id] || { id: activity.id, completed: false };
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const isKidMode = model.settings.kidMode;

  const getInitialStatus = (): ActivityStatus => {
    if (state.completed) return 'completed';
    if (state.startedAt && !state.endedAt) return 'running';
    return 'idle';
  };
  
  const [status, setStatus] = useState<ActivityStatus>(getInitialStatus());

  const updateState = (newState: Partial<ActivityState>) => {
    setModel(prev => ({
      ...prev,
      activity: {
        ...prev.activity,
        [activity.id]: { ...(prev.activity[activity.id] || { id: activity.id }), ...newState },
      },
    }));
  };
  
  const handleStart = () => {
    const startTime = Date.now();
    updateState({ startedAt: startTime, endedAt: undefined, completed: false });
    setStatus('running');
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const duration = Math.round((endTime - (state.startedAt || endTime)) / 1000);
    const sticker = model.settings.stickers ? getRandomSticker() : undefined;
    updateState({ endedAt: endTime, time: duration, completed: true, sticker });
    setStatus('completed');
    setShowBrainBreak(true);
  };
  
  const handleReset = () => {
    setModel(prev => {
        const { [activity.id]: _, ...rest } = prev.activity;
        return { ...prev, activity: rest };
    });
    setStatus('idle');
  }

  const allSubItemsAnswered = () => {
    if (activity.type !== 'virtual' || !activity.isGrouped) return true;
    if (!activity.subItems || !state.answers) return false;
    
    // For Word Detective, completion is defined by scoring all sight words and answering all MCQs
    if (activity.displayType === 'word-detective') {
        const generated = state.generated as WordDetectiveGeneratedState | undefined;
        if (!generated) return false;
        const sightWordsAnswered = generated.sightWords.every(word => state.answers?.[word] !== undefined);
        const rhymesAnswered = generated.rhymes.every((_, i) => state.answers?.[`rhyme-${i}`] !== undefined);
        const syllablesAnswered = generated.syllables.every((_, i) => state.answers?.[`syllable-${i}`] !== undefined);
        return sightWordsAnswered && rhymesAnswered && syllablesAnswered;
    }
    
    // For Sentence Builder
    if (activity.displayType === 'sentence-builder') {
        const generated = state.generated as SentenceBuilderGeneratedState | undefined;
        if (!generated) return false;
        const totalQuestions = generated.sentenceCorrections.length + generated.contractions.length;
        const answeredCount = Object.keys(state.answers).length;
        return answeredCount >= totalQuestions;
    }
    
    // For Sink or Swim, all items must be tested
    if (activity.displayType === 'sink-or-swim') {
        const itemsByGrade: Record<string, string[]> = {
            'K': ['Leaf', 'Rock', 'Pencil', 'Spoon', 'Toy car', 'Apple', 'Feather', 'Coin', 'Button', 'Crayon'],
            '1': ['Paper clip', 'Rubber band', 'Key', 'Bottle cap (plastic)', 'Orange', 'Ice cube', 'Chalk', 'Marble', 'Sponge', 'Screw'],
            '2': ['Aluminum foil (flat)', 'Aluminum foil (boat)', 'Bar of soap', 'Lego brick', 'Grapes', 'Wooden block', 'Small candle', 'Rubber duck', 'Tomato', 'Nail']
        };
        const items = itemsByGrade[activity.grade] || itemsByGrade['K'];
        return items.every(item => (state.answers?.[item] as any)?.correct !== undefined);
    }
    
    // Default logic for static grouped MCQs
    return activity.subItems.every(subItem => state.answers?.[subItem.id] !== undefined);
  };
  
  const difficulty = state.rating || state.difficulty;

  return (
    <>
      <Card className={`flex flex-col transition-all duration-300 ${status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className={isKidMode ? 'text-3xl' : 'text-xl'}>{activity.name}</CardTitle>
            <Badge variant="secondary">{activity.grade === 'K' ? 'Kindergarten' : `${activity.grade === '1' ? '1st' : '2nd'} Grade`}</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
             <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0"/>
                <div>
                    <h4 className="font-semibold text-slate-800">Instructions</h4>
                    <p className={`text-slate-600 ${isKidMode ? 'text-xl' : ''}`}>{activity.prompt}</p>
                </div>
             </div>
          </div>

          {activity.sentenceStems && status !== 'completed' && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800">Sentence Starters</h4>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    {activity.sentenceStems.map(stem => <li key={stem}>"{stem}..."</li>)}
                </ul>
            </div>
          )}

          {activity.timedSeconds && status !== 'completed' && (
              <TimedTask
                  seconds={activity.timedSeconds}
                  showTextarea={activity.type === 'offline' && activity.name.toLowerCase().includes('write')}
                  placeholder="Write your story here..."
              />
          )}

          {status === 'running' && activity.type === 'virtual' && (
              <GeneratedContent activity={activity} model={model} setModel={setModel} activityState={state} isReadOnly={false} />
          )}

          {status === 'running' && !isKidMode && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="font-semibold">Observer Tools</Label>
                 <div className="p-4 border rounded-lg space-y-4 bg-white">
                    <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <div className="flex gap-2">
                          {(['easy', 'just-right', 'hard'] as const).map(d => (
                            <Button key={d} size="sm" variant={difficulty === d ? 'default' : 'outline'} onClick={() => updateState({ rating: d, difficulty: d })}>
                              {d.replace('-', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${activity.id}`}>Notes</Label>
                        <Textarea
                          id={`notes-${activity.id}`}
                          placeholder="Observations, quotes, or strategies used..."
                          value={state.notes || ''}
                          onChange={(e) => updateState({ notes: e.target.value })}
                        />
                      </div>
                 </div>
              </div>
            </div>
          )}
          
           {status === 'completed' && (
            <div className="p-6 text-center bg-green-100/70 rounded-lg border-2 border-dashed border-green-300">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto"/>
                <h3 className="mt-2 text-xl font-bold text-green-800">Activity Complete!</h3>
                <p className="text-sm text-green-700">Great job, {model.learner.name}!</p>
                 {state.sticker && <p className="text-5xl mt-2">{state.sticker}</p>}
                 {/* Show a summary for completed virtual activities */}
                 {activity.type === 'virtual' && state.answers && (
                     <div className="mt-4 text-left text-sm">
{/* FIX: The type assertion on `state.answers` was incorrect, causing `Object.values` to be treated as returning a boolean array. Replaced with a type assertion on each element (`a`) within the array methods to correctly access the `correct` property. */}
                         {Object.values(state.answers).filter(a => (a as { correct?: boolean }).correct !== undefined).length > 0 &&
                          <p className="text-center font-semibold text-green-800">
                              You got {Object.values(state.answers).filter(a => (a as { correct?: boolean }).correct).length} of {Object.values(state.answers).filter(a => (a as { correct?: boolean }).correct !== undefined).length} correct!
                          </p>
                         }
                     </div>
                 )}
            </div>
           )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50 p-4">
            {status === 'idle' && (
                <Button onClick={handleStart} className="w-full">
                    <Play className="w-4 h-4 mr-2"/> Start Activity
                </Button>
            )}
            {status === 'running' && (
                <div className="flex items-center gap-2 text-sm text-slate-600 animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span>Activity in progress...</span>
                </div>
            )}
            {status === 'completed' && (
                 <Button onClick={handleReset} variant="outline" className="w-full">
                    Reset Activity
                </Button>
            )}
            {status === 'running' && (
                <Button onClick={handleComplete} disabled={!allSubItemsAnswered()} className={'bg-green-600 hover:bg-green-700'}>
                    <Star className="w-4 h-4 mr-2"/>Mark as Complete
                </Button>
            )}
        </CardFooter>
      </Card>
      
      {model.settings.stickers && (
        <BrainBreakModal
          show={showBrainBreak}
          onClose={() => setShowBrainBreak(false)}
          activityName={activity.name}
        />
      )}
    </>
  );
};
