
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Model, GroupedMCQGeneratedState, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState, ActivityVisual, BarChartData, Coin } from '../../types.ts';
import { Button } from './ui/Button.tsx';
// FIX: Import the 'X' icon from lucide-react.
import { Loader, ThumbsUp, ThumbsDown, Check, ArrowRight, Droplets, Anchor, X } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define GeneratedContentProps to resolve type errors across multiple components in this file.
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
                    options: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "4 number options, one is correct." },
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
            description: "A list of 2-3 challenges to identify the correctly written sentence.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "A prompt, e.g., 'Which sentence is written correctly?'" },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 sentences, only one with correct capitalization and punctuation." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['question', 'options', 'correctAnswerIndex']
            }
        },
        contractions: {
            type: Type.ARRAY,
            description: "A list of 2-3 challenges to form a contraction.",
            items: {
                type: Type.OBJECT,
                properties: {
                    uncontracted: { type: Type.STRING, description: "The two words to be contracted, e.g., 'do not'." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which is the correct contraction." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ['uncontracted', 'options', 'correctAnswerIndex']
            }
        }
    },
    required: ['sentenceCorrections', 'contractions']
};



const renderGroupHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 text-center">
      <h3 className="text-2xl font-bold text-rose-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-rose-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);
const renderScienceHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 text-center">
      <h3 className="text-2xl font-bold text-sky-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-sky-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);

const renderMathHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 text-center">
      <h3 className="text-2xl font-bold text-yellow-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-yellow-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);
const renderSSHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 text-center">
      <h3 className="text-2xl font-bold text-orange-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-orange-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);
const renderSELHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 text-center">
      <h3 className="text-2xl font-bold text-pink-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-pink-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);
const renderEFHeader = (title: string, intro: string | undefined) => (
  <div className="p-4 mb-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-center">
      <h3 className="text-2xl font-bold text-purple-800">{title}</h3>
      {intro && <p className="mt-2 text-sm text-purple-700 max-w-2xl mx-auto">{intro}</p>}
  </div>
);

const GroupedStaticMCQContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState, isReadOnly }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

    const questions = activity.subItems || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isKidMode = model.settings.kidMode;

    // Reset selection when question changes
    useEffect(() => {
        setSelectedAnswerIndex(null);
    }, [currentQuestionIndex]);
    
    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswerIndex !== null) return; // Prevent changing answer

        setSelectedAnswerIndex(answerIndex);
        const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;
        
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
                            [currentQuestion.id]: { answerIndex, correct: isCorrect }
                        }
                    }
                }
            }
        });
    };

    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;
    const isIncorrect = selectedAnswerIndex !== null && !isCorrect;

    const renderHeader = () => {
        switch (activity.displayType) {
            case 'number-ninja':
            case 'measurement-master':
            case 'data-detective':
                return renderMathHeader(activity.name, activity.introText);
            case 'science-explorer':
            case 'life-cycles-lab':
                return renderScienceHeader(activity.name, activity.introText);
            case 'community-quest':
            case 'leaders-and-citizens':
                return renderSSHeader(activity.name, activity.introText);
             case 'emotions-and-collaboration':
                return renderSELHeader(activity.name, activity.introText);
            case 'planning-and-organization':
            case 'working-memory-game':
                return renderEFHeader(activity.name, activity.introText);
            default:
                return renderGroupHeader(activity.name, activity.introText);
        }
    };
    

    if (!currentQuestion) {
        return <div className="p-4 text-center">You've completed all the questions in this mission!</div>
    }

    return (
        <div>
            {renderHeader()}

            <style>{`
                @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.07); }
                    100% { transform: scale(1); }
                }
                .animate-pop {
                    animation: pop 0.3s ease-out;
                }
            `}</style>
            
            <div className="p-4 border rounded-lg bg-white space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-slate-800">Question {currentQuestionIndex + 1} of {questions.length}</h4>
                    {selectedAnswerIndex !== null && (
                         isCorrect ? 
                         <span className="text-sm font-bold text-green-600 flex items-center gap-1"><Check className="w-4 h-4"/> Correct!</span> :
                         <span className="text-sm font-bold text-red-600 flex items-center gap-1"><X className="w-4 h-4"/> Try again next time!</span>
                    )}
                </div>

                {currentQuestion.introText && <p className={`bg-slate-50 border p-3 rounded-md text-slate-600 ${isKidMode ? 'text-lg' : 'text-sm'}`}>{currentQuestion.introText}</p>}
                
                {currentQuestion.visual && <ActivityVisualRenderer visual={currentQuestion.visual} />}

                <p className={`font-semibold ${isKidMode ? 'text-2xl' : 'text-lg'}`}>{currentQuestion.prompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.responseOptions?.map((option, index) => {
                         const isSelected = selectedAnswerIndex === index;
                         const isTheCorrectAnswer = index === currentQuestion.correctAnswerIndex;

                        return (
                            <Button
                                key={index}
                                variant="outline"
                                className={`h-auto py-3 whitespace-normal justify-start text-left transition-all duration-200 
                                    ${isKidMode ? 'text-xl p-4' : ''}
                                    ${selectedAnswerIndex !== null && isTheCorrectAnswer ? 'bg-green-100 border-green-400 text-green-800 ring-2 ring-green-300 animate-pop' : ''}
                                    ${isSelected && !isTheCorrectAnswer ? 'bg-red-100 border-red-400 text-red-800' : ''}
                                `}
                                onClick={() => handleAnswer(index)}
                                disabled={selectedAnswerIndex !== null}
                            >
                                {option}
                            </Button>
                        )
                    })}
                </div>

                {currentQuestionIndex < questions.length - 1 && (
                     <div className="flex justify-end pt-4">
                         <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={selectedAnswerIndex === null}>
                            Next Question <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                     </div>
                )}
            </div>
        </div>
    )
}
const SinkOrSwimContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState }) => {
    const items = activity.subItems || [];

    const handlePrediction = (itemId: string, prediction: 'sink' | 'float') => {
        const answerIndex = prediction === 'sink' ? 0 : 1;
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
                            [itemId]: { answerIndex, correct: undefined } // Correctness is determined by the real experiment
                        }
                    }
                }
            };
        });
    };

    const answers = activityState.answers || {};

    return (
        <div>
            {renderScienceHeader(activity.name, activity.introText)}
            <div className="p-4 border rounded-lg bg-white space-y-4">
                <p className="text-slate-600">For each item below, ask Sophia to predict whether it will sink or float in water. Record her prediction. After you're done, you can do the real experiment together with a bowl of water!</p>
                
                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="p-3 border rounded-md flex justify-between items-center bg-slate-50">
                            <span className="font-semibold">{item.name}</span>
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    className={answers[item.id]?.answerIndex === 0 ? 'bg-sky-600' : 'bg-sky-400'}
                                    onClick={() => handlePrediction(item.id, 'sink')}
                                >
                                    <Anchor className="w-4 h-4 mr-2"/> Sink
                                </Button>
                                <Button 
                                    size="sm" 
                                    className={answers[item.id]?.answerIndex === 1 ? 'bg-amber-600' : 'bg-amber-400'}
                                    onClick={() => handlePrediction(item.id, 'float')}
                                >
                                    <Droplets className="w-4 h-4 mr-2"/> Float
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};




// Fallback for non-grouped virtual activities
const DefaultVirtualContent: React.FC<GeneratedContentProps> = ({ activity, activityState, setModel }) => {
     const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswerIndex !== null) return;
        setSelectedAnswerIndex(answerIndex);
        const isCorrect = answerIndex === activity.correctAnswerIndex;
        
         setModel(prev => ({
            ...prev,
            activity: {
                ...prev.activity,
                [activity.id]: {
                    ...prev.activity[activity.id],
                    id: activity.id,
                    answers: { [activity.id]: { answerIndex, correct: isCorrect } }
                }
            }
        }));
    }

    return (
        <div className="space-y-4">
            {activity.visual && <ActivityVisualRenderer visual={activity.visual} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activity.responseOptions?.map((option, index) => (
                     <Button
                        key={index}
                        variant="outline"
                        className={`h-auto py-3 whitespace-normal justify-start text-left transition-all duration-200 
                            ${selectedAnswerIndex === index && index === activity.correctAnswerIndex ? 'bg-green-100 border-green-400' : ''}
                            ${selectedAnswerIndex === index && index !== activity.correctAnswerIndex ? 'bg-red-100 border-red-400' : ''}
                        `}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswerIndex !== null}
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    )
}
const OfflineContent: React.FC = () => (
    <div className="p-4 rounded-lg bg-slate-100 text-center">
        <p className="text-slate-600 font-semibold">This is an offline or recording-based activity.</p>
        <p className="text-sm text-slate-500">Follow the instructions and use the observer tools below when you're ready.</p>
    </div>
)


export const GeneratedContent: React.FC<GeneratedContentProps> = (props) => {
  const { activity } = props;

  if (activity.type !== 'virtual') {
    return <OfflineContent />;
  }

  if (activity.displayType === 'sink-or-swim-mission') {
    return <SinkOrSwimContent {...props} />;
  }

  if (activity.isGrouped) {
    switch (activity.displayType) {
        // AI-generated ones can come here in the future
        case 'story-time':
        case 'word-detective':
        case 'sentence-builder':
           return <p>This AI content type is not yet implemented.</p>

        // Handle all static grouped missions
        default:
            return <GroupedStaticMCQContent {...props} />;
    }
  }

  // Fallback for single, non-grouped virtual activities
  return <DefaultVirtualContent {...props} />;
};
