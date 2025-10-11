import React, { useState, useEffect, useRef } from 'react';
import { Activity, Model, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState } from '../../types.ts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card.tsx';
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Label } from './ui/Label.tsx';
import { Badge } from './ui/Badge.tsx';
import { CheckCircle, Clock, Play, Star, Info } from 'lucide-react';
import { BrainBreakModal } from './BrainBreakModal.tsx';
import { GeneratedContent } from './GeneratedContent.tsx';

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

  // Determine initial status based on saved state
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
        [activity.id]: { ...prev.activity[activity.id], id: activity.id, ...newState },
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
    // Keep notes and rating, but reset time and completion status
    updateState({
      completed: false,
      startedAt: undefined,
      endedAt: undefined,
      time: undefined,
      sticker: undefined,
      generated: undefined, // Clear generated content on reset
      answers: undefined,
    });
    setStatus('idle');
  }

  const allSubItemsAnswered = () => {
    if (!activity.isGrouped) return true;
    if (!activity.subItems || !state.answers) return false;

    if (activity.displayType === 'word-detective') {
        const generated = state.generated as WordDetectiveGeneratedState | undefined;
        if (!generated?.sightWords) return false;
        // Completion is defined by scoring all sight words.
        const scoredSightWords = Object.keys(state.answers || {}).filter(key => generated.sightWords.includes(key)).length;
        return scoredSightWords === generated.sightWords.length;
    }
    
    if (activity.displayType === 'sentence-builder') {
        const generated = state.generated as SentenceBuilderGeneratedState | undefined;
        if (!generated) return false;
        const totalQuestions = generated.sentenceCorrections.length + generated.contractions.length;
        const answeredCount = Object.keys(state.answers).length;
        return answeredCount === totalQuestions;
    }
    
    // Default logic for story time
    const answeredCount = Object.keys(state.answers).length;
    return answeredCount === activity.subItems.length;
  };
  
  const difficulty = state.rating || state.difficulty;

  return (
    <>
      <Card className={`flex flex-col transition-all duration-300 ${status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className={isKidMode ? 'text-3xl' : 'text-xl'}>{activity.name}</CardTitle>
            <Badge variant="secondary">{activity.grade === 'K' ? 'Kindergarten' : `${activity.grade}st Grade`}</Badge>
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

          {status === 'running' && (
              <GeneratedContent activity={activity} model={model} setModel={setModel} activityState={state} isReadOnly={false} />
          )}

          {status === 'running' && (
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
                <p className="text-sm text-green-700">Great job, Sophia!</p>
                 {state.sticker && <p className="text-5xl mt-2">{state.sticker}</p>}
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