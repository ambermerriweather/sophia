import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Model, GroupedMCQGeneratedState, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState, ActivityVisual, BarChartData, Coin } from '../types.ts';
import { Button } from './ui/Button.tsx';
import { Loader, ThumbsUp, ThumbsDown, Check, ArrowRight } from 'lucide-react';

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
            <g transform="translate(275, 25)" stroke="#334155" strokeWidth="1" fill="#334155">
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
    story: {
      type: Type.STRING,
      description: "A short, engaging story appropriate for the specified grade level."
    },
    questions: {
      type: Type.ARRAY,
      description: "A list of multiple-choice questions about the story.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text."
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 possible answers."
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the options array."
          }
        },
        required: ["question", "options", "correctAnswerIndex"]
      }
    }
  },
  required: ["story", "questions"]
};

const wordDetectiveSchema = {
    type: Type.OBJECT,
    properties: {
        sightWords: {
            type: Type.ARRAY,
            description: "A list of 10 grade-appropriate sight words.",
            items: { type: Type.STRING }
        },
        rhymes: {
            type: Type.ARRAY,
            description: "A list of 3 rhyming questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    promptWord: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which rhymes." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["promptWord", "options", "correctAnswerIndex"]
            }
        },
        syllables: {
            type: Type.ARRAY,
            description: "A list of 3 syllable counting questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "4 number options for syllable count." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["word", "options", "correctAnswerIndex"]
            }
        }
    },
    required: ["sightWords", "rhymes", "syllables"]
};

const sentenceBuilderSchema = {
    type: Type.OBJECT,
    properties: {
        sentenceCorrections: {
            type: Type.ARRAY,
            description: "A list of 3-5 sentence correction questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The instruction for the user (e.g., 'Choose the correct sentence.')." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 sentence options, one of which is grammatically correct." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["question", "options", "correctAnswerIndex"]
            }
        },
        contractions: {
            type: Type.ARRAY,
            description: "A list of 3-5 contraction matching questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    uncontracted: { type: Type.STRING, description: "The uncontracted pair of words (e.g., 'do not')." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options, one of which is the correct contraction." },
                    correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["uncontracted", "options", "correctAnswerIndex"]
            }
        }
    },
    required: ["sentenceCorrections", "contractions"]
};


const GroupedActivityContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState, isReadOnly }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const generatedContent = activityState.generated as GroupedMCQGeneratedState | undefined;

  const generateStory = async () => {
    setLoading(true);
    setError(null);
    const skills = activity.subItems?.map(item => item.name).join(', ') || 'basic comprehension';
    const prompt = `
      Create a very short, fun, and simple story for a ${activity.grade === 'K' ? 'Kindergartener' : `${activity.grade}st grader`} named ${model.learner.name}.
      The story should be easy to understand and allow you to ask questions about the following skills: ${skills}.
      After the story, generate exactly ${activity.subItems?.length || 5} multiple-choice questions based on the story, each with 4 options.
      The questions must directly test the skills listed above and must match the story content.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: storyTimeSchema,
        },
      });
      
      const parsed = JSON.parse(response.text);
      
      if (parsed.questions.length !== activity.subItems?.length) {
         throw new Error("Generated content does not match the required number of questions.");
      }
      
      const content: GroupedMCQGeneratedState = {
        story: parsed.story,
        questions: parsed.questions,
      };

      setModel(prev => ({
        ...prev,
        activity: {
          ...prev.activity,
          [activity.id]: { ...prev.activity[activity.id], generated: content }
        }
      }));
    } catch (e) {
      console.error(e);
      setError("Oops! We had trouble creating the story. Please try starting the activity again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!generatedContent && !loading && !error) {
      generateStory();
    }
  }, [activity.id, generatedContent]);

  const handleAnswer = (questionId: string, answerIndex: number, correctIndex: number) => {
    setModel(prev => {
        const currentAnswers = prev.activity[activity.id]?.answers || {};
        const isCorrect = answerIndex === correctIndex;
        return {
            ...prev,
            activity: {
                ...prev.activity,
                [activity.id]: {
                    ...prev.activity[activity.id],
                    answers: {
                        ...currentAnswers,
                        [questionId]: { answerIndex, correct: isCorrect }
                    }
                }
            }
        }
    });
  };

  const currentQuestion = generatedContent?.questions[currentQuestionIndex];
  const currentSubItem = activity.subItems?.[currentQuestionIndex];
  const currentAnswer = currentSubItem ? activityState.answers?.[currentSubItem.id] : undefined;
  const hasAnswered = currentAnswer !== undefined;

  if (loading) return <div className="flex items-center justify-center p-8"><Loader className="animate-spin mr-2" /> Creating a fun story for Sophia...</div>;
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!generatedContent || !currentQuestion || !currentSubItem) return <div className="p-4">Preparing activity...</div>;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg prose prose-slate max-w-none">
        <h3 className="text-lg font-bold text-amber-900">Story Time!</h3>
        <p>{generatedContent.story}</p>
      </div>

      <div className="p-4 border rounded-lg">
        <p className="font-semibold text-slate-800">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer?.answerIndex === index;
            
            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";

            if (hasAnswered) {
                if (isSelected) {
                    buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
                } else {
                    buttonClass = "bg-slate-50 border-slate-200 opacity-60";
                }
            }

            return (
              <Button
                key={index}
                variant="outline"
                disabled={isReadOnly || hasAnswered}
                className={`justify-start h-auto py-2 text-left whitespace-normal ${buttonClass}`}
                onClick={() => handleAnswer(currentSubItem.id, index, currentQuestion.correctAnswerIndex)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}>Back</Button>
        <span className="text-sm font-medium">{currentQuestionIndex + 1} / {generatedContent.questions.length}</span>
        <Button variant="outline" onClick={() => setCurrentQuestionIndex(i => i + 1)} disabled={currentQuestionIndex === generatedContent.questions.length - 1}>Next</Button>
      </div>
    </div>
  );
};

const WordDetectiveContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState, isReadOnly }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stage, setStage] = useState<'sight-words' | 'rhymes' | 'syllables'>('sight-words');
    const [subStageIndex, setSubStageIndex] = useState(0);

    const generatedContent = activityState.generated as WordDetectiveGeneratedState | undefined;

    const generateContent = async () => {
        setLoading(true);
        setError(null);
        const prompt = `
            Generate a set of reading fluency activities for a ${activity.grade === 'K' ? 'Kindergartener' : `${activity.grade}st grader`}.
            The set should include:
            1. A list of exactly 10 common, grade-appropriate sight words.
            2. Exactly 3 rhyming questions. Each should have a prompt word and 4 options, where one option rhymes.
            3. Exactly 3 syllable counting questions. Each should have a word and 4 number options for the syllable count.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: wordDetectiveSchema,
                },
            });
            const content: WordDetectiveGeneratedState = JSON.parse(response.text);
            setModel(prev => ({
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: { ...prev.activity[activity.id], generated: content }
                }
            }));
        } catch (e) {
            console.error(e);
            setError("Oops! We had trouble creating the activities. Please try starting again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!generatedContent && !loading && !error) {
            generateContent();
        }
    }, [activity.id, generatedContent]);

    const handleSightWordScore = (word: string, isCorrect: boolean) => {
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            return {
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: {
                        ...prev.activity[activity.id],
                        answers: { ...currentAnswers, [word]: { answerIndex: isCorrect ? 1 : 0, correct: isCorrect } }
                    }
                }
            }
        });
    };
    
    const handleMcqAnswer = (questionId: string, answerIndex: number, correctIndex: number) => {
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            return { ...prev, activity: { ...prev.activity, [activity.id]: { ...prev.activity[activity.id], answers: { ...currentAnswers, [questionId]: { answerIndex, correct: answerIndex === correctIndex } } } } }
        });
    };
    
    if (loading) return <div className="flex items-center justify-center p-8"><Loader className="animate-spin mr-2" /> Preparing your detective mission...</div>;
    if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>;
    if (!generatedContent) return <div className="p-4">Loading...</div>;

    const renderSightWords = () => {
        const scoredCount = Object.keys(activityState.answers || {}).filter(key => generatedContent.sightWords.includes(key)).length;
        return (
            <div className="space-y-4">
                <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-lg">
                    <h3 className="text-lg font-bold text-sky-900">🕵️‍♀️ Sight Word Speed Run</h3>
                    <p className="text-sm">Have Sophia read each word. Mark if she was correct.</p>
                </div>
                <div className="space-y-2">
                    {generatedContent.sightWords.map(word => {
                        const answer = activityState.answers?.[word];
                        return (
                            <div key={word} className="flex justify-between items-center bg-white p-2 rounded-lg border">
                                <span className="font-semibold text-lg">{word}</span>
                                <div className="flex gap-2">
                                    <Button size="icon" variant={answer?.correct === true ? 'default' : 'outline'} className="bg-green-100 text-green-700" onClick={() => handleSightWordScore(word, true)} disabled={isReadOnly || !!answer}><ThumbsUp /></Button>
                                    <Button size="icon" variant={answer?.correct === false ? 'default' : 'outline'} className="bg-red-100 text-red-700" onClick={() => handleSightWordScore(word, false)} disabled={isReadOnly || !!answer}><ThumbsDown /></Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {scoredCount === generatedContent.sightWords.length && (
                    <Button onClick={() => {setStage('rhymes'); setSubStageIndex(0);}} className="w-full">
                        Next Mission: Rhyme Time <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                )}
            </div>
        );
    };
    
    const renderRhymes = () => {
        const question = generatedContent.rhymes[subStageIndex];
        const questionId = `rhyme-${subStageIndex}`;
        const answer = activityState.answers?.[questionId];
        const hasAnswered = answer !== undefined;

        return (
            <div className="space-y-4">
                 <div className="p-4 bg-pink-50/50 border border-pink-200 rounded-lg">
                    <h3 className="text-lg font-bold text-pink-900">🎨 Rhyme Time</h3>
                </div>
                <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-center text-2xl">Which word rhymes with <span className="font-bold text-pink-600">{question.promptWord}</span>?</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {question.options.map((opt, idx) => {
                             const isSelected = answer?.answerIndex === idx;
                             let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";
                             if (hasAnswered) {
                                 if (isSelected) buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
                                 else buttonClass = "bg-slate-50 border-slate-200 opacity-60";
                             }
                             return (
                                <Button key={idx} variant="outline" className={buttonClass} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={isReadOnly || hasAnswered}>
                                    {opt}
                                </Button>
                             )
                        })}
                    </div>
                </div>
                {subStageIndex < generatedContent.rhymes.length - 1 && hasAnswered && (
                     <Button onClick={() => setSubStageIndex(i => i + 1)} className="w-full">Next Rhyme</Button>
                )}
                 {subStageIndex === generatedContent.rhymes.length - 1 && hasAnswered && (
                     <Button onClick={() => {setStage('syllables'); setSubStageIndex(0);}} className="w-full">Final Mission: Syllable Count <ArrowRight className="w-4 h-4 ml-2"/></Button>
                )}
            </div>
        );
    };

    const renderSyllables = () => {
         const question = generatedContent.syllables[subStageIndex];
         const questionId = `syllable-${subStageIndex}`;
         const answer = activityState.answers?.[questionId];
         const hasAnswered = answer !== undefined;

        return (
             <div className="space-y-4">
                <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg">
                    <h3 className="text-lg font-bold text-indigo-900">👏 Syllable Count</h3>
                </div>
                <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-center text-2xl">How many syllables in <span className="font-bold text-indigo-600">{question.word}</span>?</p>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {question.options.map((opt, idx) => {
                            const isSelected = answer?.answerIndex === idx;
                            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";
                            if (hasAnswered) {
                                if (isSelected) buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
                                else buttonClass = "bg-slate-50 border-slate-200 opacity-60";
                            }
                            return (
                                <Button key={idx} variant="outline" className={buttonClass} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={isReadOnly || hasAnswered}>
                                    {opt}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                {subStageIndex < generatedContent.syllables.length - 1 && hasAnswered && (
                     <Button onClick={() => setSubStageIndex(i => i + 1)} className="w-full">Next Word</Button>
                )}
                 {subStageIndex === generatedContent.syllables.length - 1 && hasAnswered && (
                     <div className="p-4 text-center bg-green-100 rounded-lg">
                        <p className="font-bold text-green-800">Mission Complete, Word Detective!</p>
                    </div>
                )}
            </div>
        )
    };
    
    if (stage === 'sight-words') return renderSightWords();
    if (stage === 'rhymes') return renderRhymes();
    if (stage === 'syllables') return renderSyllables();
    return null;
}

const SentenceBuilderContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState, isReadOnly }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stage, setStage] = useState<'corrections' | 'contractions'>('corrections');
    const [subStageIndex, setSubStageIndex] = useState(0);

    const generatedContent = activityState.generated as SentenceBuilderGeneratedState | undefined;

    const generateContent = async () => {
        setLoading(true);
        setError(null);
        const prompt = `
            Generate a set of "Writing & Grammar" activities for a ${activity.grade === 'K' ? 'Kindergartener' : `${activity.grade}st grader`}.
            The set should include:
            1. A list of 4 "sentence correction" questions. Each question should have an instruction (like "Choose the correct sentence.") and 4 sentence options, where only one is grammatically correct (e.g., proper capitalization, punctuation).
            2. A list of 4 "contraction matching" questions. Each should have an uncontracted pair (like "do not") and 4 options, one being the correct contraction.
        `;
        try {
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: sentenceBuilderSchema,
                },
            });
            const content: SentenceBuilderGeneratedState = JSON.parse(response.text);
             setModel(prev => ({
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: { ...prev.activity[activity.id], generated: content }
                }
            }));
        } catch (e) {
            console.error(e);
            setError("Oops! We had trouble building the grammar game. Please try starting again.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!generatedContent && !loading && !error) {
            generateContent();
        }
    }, [activity.id, generatedContent]);

    const handleMcqAnswer = (questionId: string, answerIndex: number, correctIndex: number) => {
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            return { ...prev, activity: { ...prev.activity, [activity.id]: { ...prev.activity[activity.id], answers: { ...currentAnswers, [questionId]: { answerIndex, correct: answerIndex === correctIndex } } } } }
        });
    };

    if (loading) return <div className="flex items-center justify-center p-8"><Loader className="animate-spin mr-2" /> Building your grammar game...</div>;
    if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>;
    if (!generatedContent) return <div className="p-4">Loading...</div>;

    const renderCorrections = () => {
        const question = generatedContent.sentenceCorrections[subStageIndex];
        const questionId = `correction-${subStageIndex}`;
        const answer = activityState.answers?.[questionId];
        const hasAnswered = answer !== undefined;

        return (
            <div className="space-y-4">
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-lg">
                    <h3 className="text-lg font-bold text-teal-900">✏️ Sentence Fix-Up</h3>
                </div>
                <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-slate-800">{question.question}</p>
                    <div className="mt-4 grid grid-cols-1 gap-2">
                        {question.options.map((opt, idx) => {
                             const isSelected = answer?.answerIndex === idx;
                             let buttonClass = "justify-start text-left h-auto py-2 whitespace-normal";
                             if (hasAnswered) {
                                 if (isSelected) buttonClass += " bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
                                 else buttonClass += " bg-slate-50 border-slate-200 opacity-60";
                             }
                            return (
                                <Button key={idx} variant={isSelected ? 'default' : 'outline'} className={buttonClass} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={isReadOnly || hasAnswered}>
                                    {opt}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                 {subStageIndex < generatedContent.sentenceCorrections.length - 1 && hasAnswered && (
                     <Button onClick={() => setSubStageIndex(i => i + 1)} className="w-full">Next Question</Button>
                )}
                 {subStageIndex === generatedContent.sentenceCorrections.length - 1 && hasAnswered && (
                     <Button onClick={() => {setStage('contractions'); setSubStageIndex(0);}} className="w-full">Next Challenge: Contraction Action <ArrowRight className="w-4 h-4 ml-2"/></Button>
                )}
            </div>
        )
    };
    
    const renderContractions = () => {
        const question = generatedContent.contractions[subStageIndex];
        const questionId = `contraction-${subStageIndex}`;
        const answer = activityState.answers?.[questionId];
        const hasAnswered = answer !== undefined;
        return (
             <div className="space-y-4">
                <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-lg">
                    <h3 className="text-lg font-bold text-orange-900">⚡️ Contraction Action</h3>
                </div>
                <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-center text-2xl">What is the contraction for <span className="font-bold text-orange-600">{question.uncontracted}</span>?</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {question.options.map((opt, idx) => {
                            const isSelected = answer?.answerIndex === idx;
                             let buttonClass = "";
                             if (hasAnswered) {
                                 if (isSelected) buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
                                 else buttonClass = "bg-slate-50 border-slate-200 opacity-60";
                             }
                            return (
                                <Button key={idx} variant="outline" className={buttonClass} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={isReadOnly || hasAnswered}>
                                    {opt}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                {subStageIndex < generatedContent.contractions.length - 1 && hasAnswered && (
                     <Button onClick={() => setSubStageIndex(i => i + 1)} className="w-full">Next Question</Button>
                )}
                {subStageIndex === generatedContent.contractions.length - 1 && hasAnswered && (
                     <div className="p-4 text-center bg-green-100 rounded-lg">
                        <p className="font-bold text-green-800">Awesome Job, Sentence Builder!</p>
                    </div>
                )}
            </div>
        )
    };
    
    if (stage === 'corrections') return renderCorrections();
    if (stage === 'contractions') return renderContractions();
    return null;
};


const GroupedStaticMCQContent: React.FC<GeneratedContentProps> = ({ activity, setModel, activityState, isReadOnly }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (questionId: string, answerIndex: number, correctIndex: number) => {
    setModel(prev => {
        const currentAnswers = prev.activity[activity.id]?.answers || {};
        const isCorrect = answerIndex === correctIndex;
        return {
            ...prev,
            activity: {
                ...prev.activity,
                [activity.id]: {
                    ...prev.activity[activity.id],
                    answers: {
                        ...currentAnswers,
                        [questionId]: { answerIndex, correct: isCorrect }
                    }
                }
            }
        }
    });
  };

  const currentSubItem = activity.subItems?.[currentQuestionIndex];

  if (!activity.subItems || !currentSubItem) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg">This activity is missing questions.</div>
  }

  const currentAnswer = activityState.answers?.[currentSubItem.id];
  const hasAnswered = currentAnswer !== undefined;
  
  const totalQuestions = activity.subItems.length;

  const headerConfig = {
    'number-ninja': {
      title: '🥷 Number Ninja Challenge',
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      text: 'text-blue-900',
    },
    'measurement-master': {
      title: '📏 Measurement Master',
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      text: 'text-purple-900',
    },
    'data-detective': {
      title: '📊 Data Detective',
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
    },
    'science-explorer': {
      title: '🔬 Science Explorer',
      bg: 'bg-green-50/50',
      border: 'border-green-200',
      text: 'text-green-900',
    },
    'life-cycles-lab': {
      title: '🌱 Life Cycles Lab',
      bg: 'bg-lime-50/50',
      border: 'border-lime-200',
      text: 'text-lime-900',
    },
    'community-quest': {
        title: '🗺️ Community Quest',
        bg: 'bg-orange-50/50',
        border: 'border-orange-200',
        text: 'text-orange-900',
    },
    'leaders-and-citizens': {
        title: '👑 Leaders & Citizens',
        bg: 'bg-yellow-50/50',
        border: 'border-yellow-200',
        text: 'text-yellow-900',
    }
  }
  const config = headerConfig[activity.displayType as keyof typeof headerConfig] || headerConfig['number-ninja'];

  return (
    <div className="space-y-4">
      <div className={`p-4 ${config.bg} ${config.border} rounded-lg`}>
        <h3 className={`text-lg font-bold ${config.text}`}>{config.title}</h3>
      </div>

      {activity.introText && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg prose prose-slate max-w-none">
            <p>{activity.introText}</p>
        </div>
      )}

      {currentSubItem.introText && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg prose prose-slate max-w-none">
            <p>{currentSubItem.introText}</p>
        </div>
      )}

      {currentSubItem.visual && <ActivityVisualRenderer visual={currentSubItem.visual} />}

      <div className="p-4 border rounded-lg">
        <p className="font-semibold text-slate-800">{currentQuestionIndex + 1}. {currentSubItem.prompt}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentSubItem.responseOptions?.map((option, index) => {
            const isSelected = currentAnswer?.answerIndex === index;
            
            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";

            if (hasAnswered) {
              if (isSelected) {
                buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
              } else {
                buttonClass = "bg-slate-50 border-slate-200 opacity-60";
              }
            }

            return (
              <Button
                key={index}
                variant="outline"
                disabled={isReadOnly || hasAnswered}
                className={`justify-start h-auto py-2 text-left whitespace-normal ${buttonClass}`}
                onClick={() => handleAnswer(currentSubItem.id, index, currentSubItem.correctAnswerIndex!)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}>Back</Button>
        <span className="text-sm font-medium">{currentQuestionIndex + 1} / {totalQuestions}</span>
        <Button variant="outline" onClick={() => setCurrentQuestionIndex(i => i + 1)} disabled={currentQuestionIndex === totalQuestions - 1}>Next</Button>
      </div>
    </div>
  );
};

const SingleMCQContent: React.FC<GeneratedContentProps> = ({ activity, setModel, activityState, isReadOnly }) => {
  const handleAnswer = (answerIndex: number, correctIndex: number) => {
    setModel(prev => {
        const isCorrect = answerIndex === correctIndex;
        return {
            ...prev,
            activity: {
                ...prev.activity,
                [activity.id]: {
                    ...prev.activity[activity.id],
                    answers: { [activity.id]: { answerIndex, correct: isCorrect } }
                }
            }
        };
    });
  };

  const currentAnswer = activityState.answers?.[activity.id];
  const hasAnswered = currentAnswer !== undefined;

  return (
    <div className="space-y-4">
      {activity.visual && <ActivityVisualRenderer visual={activity.visual} />}
      <div className="p-4 border rounded-lg">
        <p className="font-semibold text-slate-800">{activity.prompt}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activity.responseOptions?.map((option, index) => {
            const isSelected = currentAnswer?.answerIndex === index;
            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";

            if (hasAnswered) {
              if (isSelected) {
                buttonClass = "bg-blue-100 border-blue-300 text-blue-900 ring-2 ring-blue-300";
              } else {
                buttonClass = "bg-slate-50 border-slate-200 opacity-60";
              }
            }

            return (
              <Button
                key={index}
                variant="outline"
                disabled={isReadOnly || hasAnswered}
                className={`justify-start h-auto py-2 text-left whitespace-normal ${buttonClass}`}
                onClick={() => handleAnswer(index, activity.correctAnswerIndex!)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SinkOrSwimContent: React.FC<GeneratedContentProps> = ({ activity, setModel, activityState, isReadOnly }) => {
    const [stage, setStage] = useState<'predict' | 'test'>('predict');
    
    const itemsByGrade: Record<string, string[]> = {
        'K': ['Leaf', 'Rock', 'Pencil', 'Spoon', 'Toy car', 'Apple', 'Feather', 'Coin', 'Button', 'Crayon'],
        '1': ['Paper clip', 'Rubber band', 'Key', 'Bottle cap (plastic)', 'Orange', 'Ice cube', 'Chalk', 'Marble', 'Sponge', 'Screw'],
        '2': ['Aluminum foil (flat)', 'Aluminum foil (boat)', 'Bar of soap', 'Lego brick', 'Grapes', 'Wooden block', 'Small candle', 'Rubber duck', 'Tomato', 'Nail']
    };
    const items = itemsByGrade[activity.grade] || itemsByGrade['K'];

    const handlePrediction = (item: string, predictionIndex: number /* 0=sink, 1=float */) => {
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            return {
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: { ...prev.activity[activity.id], answers: { ...currentAnswers, [item]: { answerIndex: predictionIndex } } }
                }
            };
        });
    };

    const handleTestResult = (item: string, isCorrect: boolean) => {
        setModel(prev => {
            const currentAnswers = prev.activity[activity.id]?.answers || {};
            const currentPrediction = currentAnswers[item];
            return {
                ...prev,
                activity: {
                    ...prev.activity,
                    [activity.id]: {
                        ...prev.activity[activity.id],
                        answers: {
                            ...currentAnswers,
                            [item]: { ...currentPrediction, correct: isCorrect }
                        }
                    }
                }
            };
        });
    };

    const predictedCount = Object.keys(activityState.answers || {}).length;
    // FIX: Add type assertion to resolve 'unknown' type error when accessing 'correct' property.
    const testedCount = Object.values(activityState.answers || {}).filter(a => (a as { correct?: boolean }).correct !== undefined).length;

    if (stage === 'predict') {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-lg">
                    <h3 className="text-lg font-bold text-cyan-900">🧪 Sink or Swim? (Prediction Time!)</h3>
                    <p className="text-sm">For each item, predict: will it sink or float?</p>
                </div>
                <div className="space-y-2">
                    {items.map(item => {
                        const answer = activityState.answers?.[item];
                        return (
                            <div key={item} className="flex justify-between items-center bg-white p-2 rounded-lg border">
                                <span className="font-semibold text-lg">{item}</span>
                                <div className="flex gap-2">
                                    <Button variant={answer?.answerIndex === 0 ? 'default' : 'outline'} className="bg-slate-200" onClick={() => handlePrediction(item, 0)} disabled={isReadOnly || !!answer}>Sink</Button>
                                    <Button variant={answer?.answerIndex === 1 ? 'default' : 'outline'} className="bg-sky-200" onClick={() => handlePrediction(item, 1)} disabled={isReadOnly || !!answer}>Float</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {predictedCount === items.length && (
                    <Button onClick={() => setStage('test')} className="w-full">
                        Let's Test Our Predictions! <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                )}
            </div>
        );
    }
    
    // Test stage
    return (
         <div className="space-y-4">
            <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-lg">
                <h3 className="text-lg font-bold text-cyan-900">🧪 Sink or Swim? (Testing Time!)</h3>
                <p className="text-sm">Now, with a bowl of water, test each item. Was your prediction right?</p>
            </div>
            <div className="space-y-2">
                {items.map(item => {
                    const answer = activityState.answers?.[item];
                    const predictionText = answer?.answerIndex === 1 ? "Float" : "Sink";
                    return (
                        <div key={item} className="flex justify-between items-center bg-white p-2 rounded-lg border">
                            <div>
                               <span className="font-semibold text-lg">{item}</span>
                               <p className="text-xs text-slate-500">You predicted: <span className="font-bold">{predictionText}</span></p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant={answer?.correct === true ? 'default' : 'outline'} className="bg-green-100 text-green-700" onClick={() => handleTestResult(item, true)} disabled={isReadOnly || answer?.correct !== undefined}><ThumbsUp /></Button>
                                <Button size="icon" variant={answer?.correct === false ? 'default' : 'outline'} className="bg-red-100 text-red-700" onClick={() => handleTestResult(item, false)} disabled={isReadOnly || answer?.correct !== undefined}><ThumbsDown /></Button>
                            </div>
                        </div>
                    );
                })}
            </div>
             {testedCount === items.length && (
                 <div className="p-4 text-center bg-green-100 rounded-lg">
                    <p className="font-bold text-green-800">Experiment Complete, Scientist!</p>
                </div>
            )}
        </div>
    );
};

export const GeneratedContent: React.FC<GeneratedContentProps> = (props) => {
  const { activity } = props;

  if (activity.isGrouped) {
    switch (activity.displayType) {
      case 'story-time':
        return <GroupedActivityContent {...props} />;
      case 'word-detective':
        return <WordDetectiveContent {...props} />;
      case 'sentence-builder':
        return <SentenceBuilderContent {...props} />;
      case 'number-ninja':
      case 'measurement-master':
      case 'data-detective':
      case 'science-explorer':
      case 'life-cycles-lab':
      case 'community-quest':
      case 'leaders-and-citizens':
        return <GroupedStaticMCQContent {...props} />;
      default:
         // Fallback for any other grouped type to be safe
         return <GroupedStaticMCQContent {...props} />;
    }
  }

  // Handle non-grouped (single) activities
  switch (activity.displayType) {
      case 'sink-or-swim':
        return <SinkOrSwimContent {...props} />;
      default:
         // All other single virtual activities with responseOptions are MCQs
         if (activity.type === 'virtual' && activity.responseOptions) {
            return <SingleMCQContent {...props} />;
         }
         // For offline/recording activities which have no virtual content, render nothing.
         return null; 
  }
};