
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Model, ActivityState } from '../types.ts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card.tsx';
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Label } from './ui/Label.tsx';
import { Badge } from './ui/Badge.tsx';
import { CheckCircle, Clock, Play, Star, Info, Timer } from 'lucide-react';
import { BrainBreakModal } from './BrainBreakModal.tsx';
import { GeneratedContent } from './GeneratedContent.tsx';
import { Mascot } from './Mascot.tsx';

interface ActivityCardProps {
  activity: Activity;
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const stickerEmojis = ['🌟', '🚀', '🦄', '🍎', '💡', '🏆', '🌈', '✅', '👍', '🧠'];

type ActivityStatus = 'idle' | 'running' | 'completed';

// NEW: Simple confetti component for celebration effect
const Confetti: React.FC = () => {
    const colors = ['#f472b6', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'];
    const confettiPieces = Array.from({ length: 30 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <div key={i} className="absolute top-[-10px] w-2 h-3 rounded-sm animate-fall" style={style}></div>;
    });

    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">{confettiPieces}</div>;
}


const TimedTask: React.FC<{ seconds: number }> = ({ seconds }) => {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else if (remaining <= 0) {
      window.clearInterval(intervalRef.current!);
      setRunning(false);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(seconds);
  };
  
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="p-4 border rounded-lg bg-white space-y-3">
        <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2"><Timer className="w-5 h-5"/> Timed Challenge</h4>
            <div className={`text-2xl font-mono font-bold ${remaining === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
        </div>
      <div className="flex gap-2 justify-center">
        <Button onClick={() => setRunning(true)} disabled={running || remaining === 0}>Start</Button>
        <Button onClick={() => setRunning(false)} disabled={!running}>Stop</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
       {remaining === 0 && <p className="text-center font-bold text-red-600 animate-pulse">Time's Up!</p>}
    </div>
  );
};


export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, model, setModel }) => {
  const state = model.activity[activity.id] || { id: activity.id, completed: false };
  const [showBrainBreak, setShowBrainBreak] = useState(false);
  const isKidMode = model.settings.kidMode;
  const lastStickerRef = useRef<string | null>(null);

  const getRandomSticker = () => {
    let availableStickers = stickerEmojis;
    if (lastStickerRef.current) {
        availableStickers = stickerEmojis.filter(s => s !== lastStickerRef.current);
    }
    const sticker = availableStickers[Math.floor(Math.random() * availableStickers.length)];
    lastStickerRef.current = sticker;
    return sticker;
  };

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
    const difficulty = state.rating || state.difficulty;
    if (!difficulty) {
        alert("Please select a difficulty rating (Too Easy, Just Right, or Too Hard) before completing the activity.");
        return;
    }

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
    // Offline/recording activities can always be marked as complete by the observer.
    if (activity.type !== 'virtual') {
      return true;
    }

    // For single (non-grouped) virtual activities
    if (!activity.isGrouped) {
      if (activity.responseOptions) { // It's a single MCQ
        return state.answers && state.answers[activity.id] !== undefined;
      }
      return true; // Non-MCQ virtual activities can be completed anytime
    }

    // For ALL grouped activities, we need answers to proceed.
    if (!state.answers) {
        return false;
    }
    const answeredCount = Object.keys(state.answers).length;
    
    // For SinkOrSwim, allow completion after just one prediction.
    if (activity.displayType === 'sink-or-swim-mission') {
      return answeredCount > 0;
    }

    // For AI generated activities
    if (state.generated) {
        let totalQuestions = 0;
        const genState = state.generated as any;
        switch (activity.displayType) {
            case 'story-time':
                totalQuestions = genState.questions?.length || 0;
                break;
            case 'word-detective':
                totalQuestions = (genState.rhymes?.length || 0) + (genState.syllables?.length || 0);
                break;
            case 'sentence-builder':
                totalQuestions = (genState.sentenceCorrections?.length || 0) + (genState.contractions?.length || 0);
                break;
            default:
                return false; // Should not happen for AI content
        }
        return answeredCount === totalQuestions;
    }

    // For static grouped virtual activities
    if (activity.subItems) {
      return answeredCount === activity.subItems.length;
    }
    
    // Fallback for unexpected cases
    return false;
  };

  
  const difficulty = state.rating || state.difficulty;
  const difficultyLabels: Record<string, string> = {
    'easy': 'Too Easy',
    'just-right': 'Just Right',
    'hard': 'Too Hard'
  };

  const difficultyClasses: Record<string, string> = {
      'easy': 'bg-sky-100 text-sky-800 border-sky-200',
      'just-right': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'hard': 'bg-amber-100 text-amber-800 border-amber-200'
  }


  return (
    <>
       {/* NEW: Added CSS for animations */}
      <style>{`
        @keyframes pulse-celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        .animate-pulse-celebrate {
          animation: pulse-celebrate 2.5s infinite ease-in-out;
        }
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
      <Card className={`flex flex-col transition-all duration-300 ${status === 'completed' ? 'bg-emerald-50 border-emerald-200 animate-pulse-celebrate' : 'bg-white'}`}>
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

          {activity.sentenceStems && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800">Sentence Starters</h4>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    {activity.sentenceStems.map(stem => <li key={stem}>"{stem}..."</li>)}
                </ul>
            </div>
          )}

          {activity.timedSeconds && <TimedTask seconds={activity.timedSeconds} />}

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
                            <Button key={d} size="sm" variant={difficulty === d ? 'default' : 'outline'} className={difficulty === d ? difficultyClasses[d] : ''} onClick={() => updateState({ rating: d, difficulty: d })}>
                              {difficultyLabels[d]}
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
            <div className="relative p-6 text-center bg-emerald-100/70 rounded-lg border-2 border-dashed border-emerald-300 flex flex-col items-center gap-2 overflow-hidden">
                <Confetti />
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto relative z-20"/>
                <Mascot className="w-20 h-20 relative z-20" />
                <h3 className="mt-2 text-xl font-bold text-emerald-800 relative z-20">Activity Complete!</h3>
                <p className="text-sm text-emerald-700 relative z-20">Great job, Sophia!</p>
                 {state.sticker && <p className="text-5xl mt-2 relative z-20">{state.sticker}</p>}
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
                <Button onClick={handleComplete} disabled={!allSubItemsAnswered()} className={'bg-emerald-600 hover:bg-emerald-700 text-white'}>
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
