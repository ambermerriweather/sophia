// types.ts

// The grade levels available for assessment
export type Grade = 'K' | '1' | '2';

// Represents a single multiple-choice question within a virtual activity
export interface MCQ {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

// State for a generated story-based activity
export interface GroupedMCQGeneratedState {
  story: string;
  questions: MCQ[];
}

// --- TYPES FOR WORD DETECTIVE ---
export interface WordDetectiveRhyme {
  promptWord: string;
  options: string[];
  correctAnswerIndex: number;
}
export interface WordDetectiveSyllable {
  word: string;
  options: number[];
  correctAnswerIndex: number;
}
export interface WordDetectiveGeneratedState {
  sightWords: string[];
  rhymes: WordDetectiveRhyme[];
  syllables: WordDetectiveSyllable[];
}
// --- END WORD DETECTIVE ---

// --- NEW TYPES FOR SENTENCE BUILDER ---
export interface SentenceCorrection {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}
export interface ContractionPair {
    uncontracted: string;
    options: string[];
    correctAnswerIndex: number;
}
export interface SentenceBuilderGeneratedState {
    sentenceCorrections: SentenceCorrection[];
    contractions: ContractionPair[];
}
// --- END NEW TYPES ---


// Represents a single educational activity, now with support for grouping
export interface Activity {
  id: string;
  name: string;
  prompt: string;
  grade: Grade;
  type: 'virtual' | 'recording' | 'offline';
  isGrouped?: boolean;
  subItems?: Activity[]; // For grouped activities
  responseOptions?: readonly string[]; // From pack
  correctAnswerIndex?: number; // From pack
  displayType?: 'story-time' | 'word-detective' | 'sentence-builder'; // To specify custom renderers
}

// Represents a major subject area
export interface Domain {
  key: string;
  label: string;
  activities: Activity[];
}

// Represents the user's progress and notes for a single activity
export interface ActivityState {
  id: string;
  completed: boolean;
  startedAt?: number;
  endedAt?: number;
  time?: number;
  rating?: 'easy' | 'just-right' | 'hard';
  difficulty?: 'easy' | 'just-right' | 'hard';
  notes?: string;
  sticker?: string;
  // Persists AI-generated content to solve the disappearing story bug
  generated?: GroupedMCQGeneratedState | WordDetectiveGeneratedState | SentenceBuilderGeneratedState; 
  // Tracks answers for single or grouped activities
  answers?: { [key: string]: { answerIndex: number; correct?: boolean } };
}

// Global settings for the application
export interface Settings {
  scaffolds: boolean;
  kidMode: boolean;
  tts: boolean;
  stickers: boolean;
}

// The main data model for the entire application state
export interface Model {
  learner: {
    name: string;
    adult: string;
    date: string;
  };
  settings: Settings;
  domainNotes: Record<string, string>;
  overallNotes: string;
  activity: Record<string, ActivityState>;
}