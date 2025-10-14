import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Model, GroupedMCQGeneratedState, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState, ActivityVisual, BarChartData, Coin } from '../../types.ts';
import { Button } from './ui/Button.tsx';
import { Loader, ThumbsUp, ThumbsDown, Check, ArrowRight, Droplets, Anchor, X } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratedContentProps {
    activity: Activity;
    model: Model;
    setModel: React.Dispatch<React.SetStateAction<Model>>;
    activityState: ActivityState;
    isReadOnly: boolean;
}

// --- VISUAL COMPONENTS ---

const Clock: React.FC<{ time: string }> = ({ time }) => {
  const [hour, minute] = time.split(':').map(Number);
  const minuteDeg = (minute / 60) * 360;
  const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  return (
    <div className="relative w-24 h-24 rounded-full border-2 border-slate-700 bg-white mx-auto">
      {/* Hour hand */}
      <div
        className="absolute top-1/2 left-1/2 h-1 w-8 bg-slate-800"
        style={{ transformOrigin: '0% 50%', transform: `translate(0, -50%) rotate(${hourDeg - 90}deg)` }}
      />
      {/* Minute hand */}
      <div
        className="absolute top-1/2 left-1/2 h-0.5 w-10 bg-slate-600"
        style={{ transformOrigin: '0% 50%', transform: `translate(0, -50%) rotate(${minuteDeg - 90}deg)` }}
      />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-800 rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

const BarChart: React.FC<{ data: BarChartData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);
  return (
    <div className="w-full flex justify-around items-end gap-4 h-48 p-4 bg-slate-50 rounded-lg border">
      {data.map((item, index) => (
        <div key={item.label} className="flex flex-col items-center gap-2 h-full justify-end">
          <div className="text-sm font-bold text-slate-700">{item.value}</div>
          <div
            className="w-12 bg-blue-400 rounded-t-md transition-all duration-700 ease-out"
            style={{ height: `${(item.value / maxValue) * 100}%`, animation: `growBar 0.5s ${index * 100}ms ease-out forwards`, transformOrigin: 'bottom', transform: 'scaleY(0)' }}
          />
          <span className="text-sm font-semibold text-center">{item.label}</span>
        </div>
      ))}
       <style>{`
        @keyframes growBar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

const LinePlot: React.FC<{ data: { value: number; count: number }[], unit: string }> = ({ data, unit }) => {
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));
    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    
    return (
        <div className="w-full px-4 py-8">
            <div className="relative h-20">
                {data.map(item => (
                    <div key={item.value} className="absolute bottom-6 flex flex-col items-center" style={{ left: `${((item.value - min) / (max - min)) * 100}%` }}>
                        {Array.from({ length: item.count }).map((_, i) => (
                            <span key={i} className="text-blue-500 font-bold text-xl leading-none">X</span>
                        ))}
                    </div>
                ))}
            </div>
            <div className="relative h-1 bg-slate-300 rounded-full mt-2">
                {range.map(num => {
                    const position = ((num - min) / (max - min)) * 100;
                    return (
                        <div key={num} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position}%` }}>
                            <div className="w-0.5 h-2 bg-slate-400"></div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold">{num}</span>
                        </div>
                    )
                })}
            </div>
             <p className="text-center text-sm font-semibold mt-8">Length in {unit}</p>
        </div>
    );
};


const Coins: React.FC<{ coins: Coin[] }> = ({ coins }) => {
    const coinMap: Record<Coin, { symbol: string, color: string }> = {
        penny: { symbol: '1¢', color: 'bg-orange-200 text-orange-800' },
        nickel: { symbol: '5¢', color: 'bg-slate-200 text-slate-800' },
        dime: { symbol: '10¢', color: 'bg-sky-200 text-sky-800' },
        quarter: { symbol: '25¢', color: 'bg-indigo-200 text-indigo-800' },
    }
    return (
        <div className="flex justify-center flex-wrap gap-2">
            {coins.map((coin, index) => (
                <div key={`${coin}-${index}`} className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${coinMap[coin].color}`}>
                    {coinMap[coin].symbol}
                </div>
            ))}
        </div>
    )
}

const CompareImages: React.FC<{ items: string[], options: readonly string[] }> = ({ items, options }) => {
    const itemMap = {
        seed: '🌱', pencil: '✏️', paper_clip: '📎', button: '🔘',
        feather: '🪶', book: '📖', leaf: '🍃', note: '📝',
        cup: '☕', spoon: '🥄', bucket: '🪣', thimble: '🪡'
    } as Record<string, string>;

    return (
        <div className="grid grid-cols-2 gap-4">
            {items.map((itemKey, index) => (
                 <div key={itemKey} className="flex flex-col items-center p-2 border rounded-lg bg-white">
                    <span className="text-5xl">{itemMap[itemKey]}</span>
                    <span className="mt-2 text-sm font-semibold">{options[index]}</span>
                </div>
            ))}
        </div>
    )
}

interface BaseTenBlockSet {
  label?: string;
  hundreds?: number;
  tens?: number;
  ones?: number;
}
const BaseTenBlocks: React.FC<{ numbers: BaseTenBlockSet[] }> = ({ numbers }) => {
  return (
    <div className="flex justify-center items-start gap-8 flex-wrap">
      {numbers.map((num, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          {num.label && <span className="font-bold text-lg text-slate-700">{num.label}</span>}
          <div className="flex flex-wrap items-start gap-2 p-2 justify-center border rounded-md bg-white min-h-[104px]">
            {/* Hundreds */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: num.hundreds || 0 }).map((_, i) => (
                <div key={`h-${i}`} className="w-24 h-24 bg-yellow-300 border-2 border-yellow-500 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, j) => <div key={`hc-${j}`} className="border-r border-b border-yellow-400/50"></div>)}
                </div>
              ))}
            </div>
            {/* Tens */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: num.tens || 0 }).map((_, i) => (
                <div key={`t-${i}`} className="w-6 h-24 bg-green-300 border-2 border-green-500 flex flex-col">
                  {Array.from({ length: 10 }).map((_, j) => <div key={`tc-${j}`} className="flex-1 border-b border-green-400/50"></div>)}
                </div>
              ))}
            </div>
            {/* Ones */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: num.ones || 0 }).map((_, i) => (
                <div key={`o-${i}`} className="w-6 h-6 bg-blue-300 border-2 border-blue-500"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NumberLine: React.FC<{ min: number; max: number; highlight?: number; }> = ({ min, max, highlight }) => {
    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const highlightPosition = highlight !== undefined ? ((highlight - min) / (max - min)) * 100 : null;

    return (
        <div className="w-full px-4 py-8">
            <div className="relative h-1 bg-slate-300 rounded-full">
                {range.map(num => {
                    const position = ((num - min) / (max - min)) * 100;
                    const isEndpoint = num === min || num === max;
                    const isHighlight = num === highlight;
                    return (
                        <div key={num} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position}%` }}>
                            <div className={`w-0.5 ${isEndpoint || isHighlight ? 'h-4' : 'h-2'} bg-slate-400`}></div>
                            {(isEndpoint || isHighlight) && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold">{num}</span>}
                        </div>
                    )
                })}
                {highlightPosition !== null && (
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${highlightPosition}%` }}>
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NeighborhoodMap: React.FC = () => (
    <div className="w-full max-w-lg mx-auto p-2 bg-green-100 border-2 border-green-300 rounded-lg aspect-auto">
        <svg viewBox="0 0 300 300" role="img" aria-label="A map of a neighborhood with a house, school, park, river, and compass.">
            {/* Roads */}
            <path d="M 50 0 V 300 M 250 0 V 300 M 0 100 H 300 M 0 200 H 300" stroke="#a0aec0" strokeWidth="8" />
            
            {/* River */}
            <path d="M 150 0 V 300" stroke="#63b3ed" strokeWidth="12" />
            <text x="155" y="15" fill="#2c5282" fontSize="10" fontWeight="bold">River</text>
            
            {/* Locations */}
            <text x="10" y="30" fontSize="24">🏠</text>
            <text x="5" y="50" fontSize="10" fontWeight="bold">Home</text>
            
            <text x="260" y="30" fontSize="24">🏫</text>
            <text x="255" y="50" fontSize="10" fontWeight="bold">School</text>
            
            <text x="10" y="230" fontSize="24">🌳</text>
            <text x="8" y="250" fontSize="10" fontWeight="bold">Park</text>
            
            {/* Routes - Updated to show multiple clear routes */}
            <path d="M 30 55 C 100 150, 200 50, 270 55" stroke="red" strokeWidth="2.5" fill="none" strokeDasharray="4 2"/>
            <text x="130" y="70" fill="red" fontSize="10" fontWeight="bold">Route A</text>

            <path d="M 30 55 V 150 H 270 V 55" stroke="purple" strokeWidth="2.5" fill="none" strokeDasharray="5 3"/>
            <text x="130" y="130" fill="purple" fontSize="10" fontWeight="bold">Route B</text>
            
            {/* Compass Rose */}
            <g transform="translate(265, 265)" stroke="#334155" strokeWidth="1" fill="#334155">
                <path d="M 0 -15 L 5 0 L 0 5 L -5 0 Z" />
                <path d="M 0 15 L 5 0 L 0 -5 L -5 0 Z" opacity="0.6"/>
                <path d="M 15 0 L 0 5 L -5 0 L 0 -5 Z" opacity="0.6"/>
                <path d="M -15 0 L 0 5 L 5 0 L 0 -5 Z" opacity="0.6"/>
                <text x="0" y="-18" textAnchor="middle" fontSize="6" fontWeight="bold">N</text>
                <text x="0" y="23" textAnchor="middle" fontSize="6" fontWeight="bold">S</text>
                <text x="19" y="3" textAnchor="middle" fontSize="6" fontWeight="bold">E</text>
                <text x="-19" y="3" textAnchor="middle" fontSize="6" fontWeight="bold">W</text>
            </g>
        </svg>
    </div>
);

const CompassRose: React.FC = () => (
  <div className="w-32 h-32 relative mx-auto">
    <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700">
      <span className="absolute top-0">N</span>
      <span className="absolute bottom-0">S</span>
      <span className="absolute left-0">W</span>
      <span className="absolute right-0">E</span>
    </div>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,0 60,50 50,100 40,50" fill="#cbd5e1" />
      <polygon points="0,50 50,60 100,50 50,40" fill="#e2e8f0" />
      <circle cx="50" cy="50" r="10" fill="white" stroke="#94a3b8" strokeWidth="2"/>
    </svg>
  </div>
);


const ActivityVisualRenderer: React.FC<{ visual: ActivityVisual }> = ({ visual }) => {
  return (
    <div className="my-4 p-4 flex justify-center items-center bg-slate-100 rounded-lg border">
      {(() => {
        switch (visual.type) {
          case 'count':
            return <div className="text-5xl flex flex-wrap gap-2 justify-center">{Array.from({ length: visual.count }, (_, i) => <span key={i}>{visual.item === 'apple' ? '🍎' : '⚫️'}</span>)}</div>;
          case 'bar-chart':
            return <BarChart data={visual.data} />;
          case 'line-plot':
            return <LinePlot data={visual.data} unit={visual.unit} />;
          case 'clock-face':
            return <Clock time={visual.time} />;
          case 'clocks':
            return (
                <div className="grid grid-cols-2 gap-4">
                    {visual.options.map((time, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <Clock time={time} />
                            <span className="text-sm font-bold">{visual.labels[i]}</span>
                        </div>
                    ))}
                </div>
            );
          case 'coins':
            return <Coins coins={visual.coins}/>
          case 'compare-images':
            return <CompareImages items={visual.items} options={visual.options}/>
          case 'base-ten-blocks':
            return <BaseTenBlocks numbers={visual.numbers} />
          case 'number-line':
            return <NumberLine min={visual.min} max={visual.max} highlight={visual.highlight} />
          case 'neighborhood-map':
            return <NeighborhoodMap />;
          case 'compass-rose':
            return <CompassRose />;
          default:
            return null;
        }
      })()}
    </div>
  );
};


// --- END VISUAL COMPONENTS ---


const storyTimeSchema = {
    type: Type.OBJECT,
    properties: {
        story: { type: Type.STRING, description: 'A 4-5 sentence story for a child at the specified grade level. The story should be simple, engaging, and appropriate for early readers.' },
        questions: {
            type: Type.ARRAY,
            description: 'A list of 3-4 multiple-choice questions about the story.',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['question', 'options', 'correctAnswerIndex']
            }
        }
    },
    required: ['story', 'questions']
};

const wordDetectiveSchema = {
    type: Type.OBJECT,
    properties: {
        sightWords: {
            type: Type.ARRAY,
            description: "A list of 5 grade-appropriate high-frequency sight words.",
            items: { type: Type.STRING }
        },
        rhymes: {
            type: Type.ARRAY,
            description: "A list of 2-3 rhyming challenges.",
            items: {
                type: Type.OBJECT,
                properties: {
                    promptWord: { type: Type.STRING, description: "The word to find a rhyme for." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which rhymes." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['promptWord', 'options', 'correctAnswerIndex']
            }
        },
        syllables: {
            type: Type.ARRAY,
            description: "A list of 2-3 syllable counting challenges.",
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING, description: "The word to count syllables for." },
                    options: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "4 number options for syllable count." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['word', 'options', 'correctAnswerIndex']
            }
        }
    },
    required: ['sightWords', 'rhymes', 'syllables']
};

const sentenceBuilderSchema = {
    type: Type.OBJECT,
    properties: {
        sentenceCorrections: {
            type: Type.ARRAY,
            description: "A list of 2-3 sentence correction challenges.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "An incorrect sentence to be corrected." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which is the correct sentence." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['question', 'options', 'correctAnswerIndex']
            }
        },
        contractions: {
            type: Type.ARRAY,
            description: "A list of 2-3 contraction matching challenges.",
            items: {
                type: Type.OBJECT,
                properties: {
                    uncontracted: { type: Type.STRING, description: "Two words to be made into a contraction (e.g., 'do not')." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which is the correct contraction." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['uncontracted', 'options', 'correctAnswerIndex']
            }
        }
    },
    required: ['sentenceCorrections', 'contractions']
};

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState, isReadOnly }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const generatedContent = activityState.generated;

    useEffect(() => {
        const generate = async () => {
            if (generatedContent || !activity.isGrouped) return;

            setLoading(true);
            setError(null);

            let schema;
            let prompt = activity.prompt;
            
            // Add scaffolding if enabled
            if (model.settings.scaffolds) {
                prompt += ` Please make the content and questions particularly easy and clear, suitable for a child who may need extra support.`
            }

            switch (activity.displayType) {
                case 'story-time':
                    schema = storyTimeSchema;
                    prompt += ` The story should be at a ${activity.grade} grade reading level.`
                    break;
                case 'word-detective':
                    schema = wordDetectiveSchema;
                    prompt += ` The words should be appropriate for a ${activity.grade} grader.`
                    break;
                case 'sentence-builder':
                    schema = sentenceBuilderSchema;
                    prompt += ` The sentences and contractions should be appropriate for a ${activity.grade} grader.`
                    break;
                default:
                    setLoading(false);
                    return;
            }

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: schema,
                    },
                });
                
                const jsonStr = response.text.trim();
                const data = JSON.parse(jsonStr);

                setModel(prev => ({
                    ...prev,
                    activity: {
                        ...prev.activity,
                        [activity.id]: { ...prev.activity[activity.id], id: activity.id, generated: data },
                    },
                }));

            } catch (err) {
                console.error("Error generating content:", err);
                setError("Sorry, I couldn't create the activity. Please try resetting the activity.");
            } finally {
                setLoading(false);
            }
        };

        generate();
    }, [activity.id, generatedContent, activity.isGrouped, activity.displayType, activity.prompt, activity.grade, model.settings.scaffolds, setModel]);

    const handleAnswer = (questionId: string, answerIndex: number, correctIndex: number) => {
        if (isReadOnly) return;
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            return {
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: {
                        ...prev.activity[activity.id],
                        id: activity.id,
                        answers: {
                            ...currentAnswers,
                            [questionId]: { answerIndex, correct: answerIndex === correctIndex }
                        }
                    }
                }
            };
        });
    };
    
    if (loading) {
        return (
            <div className="p-6 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center gap-2">
                <Loader className="w-12 h-12 text-slate-500 mx-auto animate-spin"/>
                <h3 className="mt-2 text-lg font-bold text-slate-700">Sophia the Owl is thinking...</h3>
                <p className="text-sm text-slate-600">Creating a fun new activity just for you!</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    if (activity.visual) {
      return <ActivityVisualRenderer visual={activity.visual} />;
    }
    
    if (activity.type !== 'virtual' && !activity.visual) {
        return null;
    }
    
    const renderMCQ = (q: any, index: number, prefix: string) => {
        const questionId = `${prefix}-${index}`;
        const userAnswer = activityState.answers?.[questionId];
        const questionText = q.question || q.promptWord || q.word || q.uncontracted || q.prompt;
        
        return (
            <div key={questionId} className="p-4 border rounded-lg bg-white/50">
                <p className="font-semibold">{index + 1}. {questionText}{q.uncontracted ? "?" : ""}</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((option: string, i: number) => {
                         const isSelected = userAnswer?.answerIndex === i;
                         const isCorrect = q.correctAnswerIndex === i;
                         
                         let buttonClass = 'justify-start text-left h-auto py-2 whitespace-normal';
                         let variant: "default" | "secondary" | "outline" | "ghost" = 'outline';

                         if (userAnswer !== undefined) {
                             if (isSelected && isCorrect) {
                                 buttonClass += ' bg-green-500 text-white border-green-600';
                                 variant = 'default';
                             } else if (isSelected && !isCorrect) {
                                 buttonClass += ' bg-red-500 text-white border-red-600';
                                 variant = 'default';
                             } else if (isCorrect) {
                                  buttonClass += ' bg-green-200 border-green-400 ring-2 ring-green-500';
                                  variant = 'outline';
                             }
                         }

                        return (
                           <Button
                             key={i}
                             variant={variant}
                             className={buttonClass}
                             disabled={isReadOnly || userAnswer !== undefined}
                             onClick={() => handleAnswer(questionId, i, q.correctAnswerIndex)}
                           >
                            {option}
                             {userAnswer !== undefined && isSelected && isCorrect && <Check className="w-4 h-4 ml-auto flex-shrink-0" />}
                             {userAnswer !== undefined && isSelected && !isCorrect && <X className="w-4 h-4 ml-auto flex-shrink-0" />}
                           </Button>
                        );
                    })}
                </div>
            </div>
        );
    }
    
    const renderSinkOrSwim = (subItems: Activity[]) => {
        const handlePrediction = (itemId: string, prediction: 'sink' | 'float') => {
             setModel(prev => {
                const currentAnswers = prev.activity[activity.id]?.answers || {};
                const answerIndex = prediction === 'sink' ? 0 : 1;
                return {
                    ...prev,
                    activity: {
                        ...prev.activity,
                        [activity.id]: {
                            ...prev.activity[activity.id],
                            id: activity.id,
                            answers: {
                                ...currentAnswers,
                                [itemId]: { answerIndex, correct: undefined } // Correctness is determined by experiment
                            }
                        }
                    }
                };
            });
        }
        
        return (
            <div className="space-y-4">
            {subItems.map(item => {
                const userAnswer = activityState.answers?.[item.id];
                return (
                    <div key={item.id} className="p-4 border rounded-lg bg-white/50 flex justify-between items-center">
                        <p className="font-semibold">{item.name}</p>
                        <div className="flex gap-2">
                             <Button size="sm" variant={userAnswer?.answerIndex === 1 ? 'default' : 'outline'} className={userAnswer?.answerIndex === 1 ? 'bg-sky-500 hover:bg-sky-600' : ''} onClick={() => handlePrediction(item.id, 'float')} disabled={!!userAnswer}><Droplets className="w-4 h-4 mr-2"/> Float</Button>
                            <Button size="sm" variant={userAnswer?.answerIndex === 0 ? 'default' : 'outline'} className={userAnswer?.answerIndex === 0 ? 'bg-slate-700 hover:bg-slate-800' : ''} onClick={() => handlePrediction(item.id, 'sink')} disabled={!!userAnswer}><Anchor className="w-4 h-4 mr-2"/> Sink</Button>
                        </div>
                    </div>
                )
            })}
            </div>
        )
    }

    if (!generatedContent && !activity.subItems && activity.type === 'virtual') {
       return renderMCQ({
            question: activity.prompt,
            options: activity.responseOptions || [],
            correctAnswerIndex: activity.correctAnswerIndex,
        }, 0, activity.id);
    }
    
    switch (activity.displayType) {
        case 'story-time':
            const storyData = generatedContent as GroupedMCQGeneratedState;
            return storyData ? (
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-bold text-yellow-800">Story Time!</h4>
                        <p className="mt-2 whitespace-pre-wrap">{storyData.story}</p>
                    </div>
                    {storyData.questions.map((q, i) => renderMCQ(q, i, 'story'))}
                </div>
            ) : null;
        case 'word-detective':
             const wordData = generatedContent as WordDetectiveGeneratedState;
             return wordData ? (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Sight Words Practice</h4>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-wrap justify-center gap-4">
                           {wordData.sightWords.map(word => <div key={word} className="px-4 py-2 bg-white rounded-md shadow-sm font-bold text-xl">{word}</div>)}
                        </div>
                    </div>
                    <div className="space-y-4">
                         <h4 className="font-semibold text-lg">Rhyming Riddles</h4>
                         {wordData.rhymes.map((q, i) => renderMCQ(q, i, 'rhyme'))}
                    </div>
                    <div className="space-y-4">
                         <h4 className="font-semibold text-lg">Syllable Count</h4>
                         {wordData.syllables.map((q, i) => renderMCQ(q, i, 'syllable'))}
                    </div>
                </div>
             ) : null;
        case 'sentence-builder':
            const sentenceData = generatedContent as SentenceBuilderGeneratedState;
            return sentenceData ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                         <h4 className="font-semibold text-lg">Fix the Sentence</h4>
                         {sentenceData.sentenceCorrections.map((q, i) => renderMCQ(q, i, 'correction'))}
                    </div>
                    <div className="space-y-4">
                         <h4 className="font-semibold text-lg">Find the Contraction</h4>
                         {sentenceData.contractions.map((q, i) => renderMCQ(q, i, 'contraction'))}
                    </div>
                </div>
            ) : null;
        case 'sink-or-swim-mission':
             return activity.subItems ? renderSinkOrSwim(activity.subItems) : null;
        case 'number-ninja':
        case 'measurement-master':
        case 'data-detective':
        case 'science-explorer':
        case 'life-cycles-lab':
        case 'community-quest':
        case 'leaders-and-citizens':
        case 'emotions-and-collaboration':
        case 'planning-and-organization':
        case 'working-memory-game':
             return (
                 <div className="space-y-4">
                    {activity.introText && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                           <p className="text-purple-800">{activity.introText}</p>
                        </div>
                    )}
                    {activity.subItems?.map((q, i) => renderMCQ({
                        prompt: q.prompt,
                        options: q.responseOptions,
                        correctAnswerIndex: q.correctAnswerIndex
                    }, i, q.id))}
                 </div>
             )

        default:
            return null;
    }
};

export default GeneratedContent;
