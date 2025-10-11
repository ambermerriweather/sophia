import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Model, GroupedMCQGeneratedState, ActivityState, WordDetectiveGeneratedState, SentenceBuilderGeneratedState } from '../../types.ts';
import { Button } from './ui/Button.tsx';
import { Loader, ThumbsUp, ThumbsDown, Check, ArrowRight } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratedContentProps {
  activity: Activity;
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
  activityState: ActivityState;
  isReadOnly: boolean;
}

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
            const isCorrect = currentQuestion.correctAnswerIndex === index;
            
            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";
            let icon = null;

            if (hasAnswered) {
                if (isCorrect) {
                    buttonClass = "bg-green-100 border-green-300 text-green-800";
                    icon = <ThumbsUp className="w-4 h-4 ml-auto"/>;
                } else if (isSelected && !isCorrect) {
                    buttonClass = "bg-slate-100 border-slate-300 text-slate-800 opacity-60";
                } else {
                    buttonClass = "bg-white border-slate-200 opacity-50";
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
                {icon}
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
                                    <Button size="icon" variant={answer?.correct === true ? 'default' : 'outline'} className="bg-green-100 text-green-700" onClick={() => handleSightWordScore(word, true)}><ThumbsUp /></Button>
                                    <Button size="icon" variant={answer?.correct === false ? 'default' : 'outline'} className="bg-red-100 text-red-700" onClick={() => handleSightWordScore(word, false)}><ThumbsDown /></Button>
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
                        {question.options.map((opt, idx) => (
                             <Button key={idx} variant={answer?.answerIndex === idx ? 'default' : 'outline'} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={hasAnswered}>
                                {opt}
                                {hasAnswered && idx === question.correctAnswerIndex && <Check className="w-4 h-4 ml-auto"/>}
                            </Button>
                        ))}
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
                        {question.options.map((opt, idx) => (
                             <Button key={idx} variant={answer?.answerIndex === idx ? 'default' : 'outline'} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={hasAnswered}>
                                {opt}
                                {hasAnswered && idx === question.correctAnswerIndex && <Check className="w-4 h-4 ml-auto"/>}
                            </Button>
                        ))}
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

const SentenceBuilderContent: React.FC<GeneratedContentProps> = ({ activity, model, setModel, activityState }) => {
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
                        {question.options.map((opt, idx) => (
                             <Button key={idx} variant={answer?.answerIndex === idx ? 'default' : 'outline'} className="justify-start text-left h-auto py-2 whitespace-normal" onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={hasAnswered}>
                                {opt}
                                {hasAnswered && idx === question.correctAnswerIndex && <Check className="w-4 h-4 ml-auto flex-shrink-0"/>}
                            </Button>
                        ))}
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
                        {question.options.map((opt, idx) => (
                             <Button key={idx} variant={answer?.answerIndex === idx ? 'default' : 'outline'} onClick={() => handleMcqAnswer(questionId, idx, question.correctAnswerIndex)} disabled={hasAnswered}>
                                {opt}
                                {hasAnswered && idx === question.correctAnswerIndex && <Check className="w-4 h-4 ml-auto"/>}
                            </Button>
                        ))}
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
        }
    });
  };

  const currentAnswer = activityState.answers?.[activity.id];
  const hasAnswered = currentAnswer !== undefined;

  const questionText = activity.prompt;
  const options = activity.responseOptions || [];
  const correctIndex = activity.correctAnswerIndex;

  if (options.length === 0 || correctIndex === undefined) {
      return <div className="p-4 bg-red-50 text-red-700 rounded-lg">This activity is missing its question options.</div>
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <p className="font-semibold text-slate-800">{questionText}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option, index) => {
            const isSelected = currentAnswer?.answerIndex === index;
            const isCorrect = correctIndex === index;
            
            let buttonClass = "bg-white hover:bg-slate-100 border-slate-200";
            let icon = null;

            if (hasAnswered) {
                if (isCorrect) {
                    buttonClass = "bg-green-100 border-green-300 text-green-800";
                    icon = <ThumbsUp className="w-4 h-4 ml-auto"/>;
                } else if (isSelected && !isCorrect) {
                    buttonClass = "bg-slate-100 border-slate-300 text-slate-800 opacity-60";
                } else {
                    buttonClass = "bg-white border-slate-200 opacity-50";
                }
            }
            
            return (
              <Button
                key={index}
                variant="outline"
                disabled={isReadOnly || hasAnswered}
                className={`justify-start h-auto py-2 text-left whitespace-normal ${buttonClass}`}
                onClick={() => handleAnswer(index, correctIndex)}
              >
                {option}
                {icon}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export const GeneratedContent: React.FC<GeneratedContentProps> = (props) => {
    if (props.activity.displayType === 'story-time') {
        return <GroupedActivityContent {...props} />
    }
    
    if (props.activity.displayType === 'word-detective') {
        return <WordDetectiveContent {...props} />
    }
    
    if (props.activity.displayType === 'sentence-builder') {
        return <SentenceBuilderContent {...props} />
    }
    
    if (props.activity.type === 'virtual' && props.activity.responseOptions) {
        return <SingleMCQContent {...props} />;
    }

    if (props.activity.type === 'offline' || props.activity.type === 'recording') {
        return (
             <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="font-semibold">This is an offline activity.</p>
                <p className="text-sm text-slate-600">Follow the instructions and mark complete when you're done.</p>
            </div>
        )
    }
    
    return (
        <div className="p-4 bg-slate-50 rounded-lg text-center">
            <p className="font-semibold">Activity Content</p>
            <p className="text-sm text-slate-600">This activity doesn't have interactive content.</p>
        </div>
    );
}