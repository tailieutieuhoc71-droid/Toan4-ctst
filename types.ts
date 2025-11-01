
export enum AppState {
  SELECTING_LESSON,
  GENERATING_QUIZ,
  TAKING_QUIZ,
  VIEWING_RESULTS,
}

export enum QuestionType {
  MULTIPLE_CHOICE_SINGLE = "multiple_choice_single",
  MULTIPLE_CHOICE_MULTI = "multiple_choice_multi",
  TRUE_FALSE = "true_false",
  FILL_IN_THE_BLANK = "fill_in_the_blank",
  MATCHING = "matching",
  OPEN_ENDED = "open_ended",
}

export interface Question {
  id: number;
  questionText: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  imageUrl?: string;
  correctAnswers: string[]; // Can be one or more
  matchingPairs?: { A: string[]; B: string[] }; // For matching
  solution: string;
  feedback: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export type UserAnswer = string | string[] | { [key: string]: string };

export interface UserAnswers {
  [questionId: number]: UserAnswer;
}

export interface Result {
  question: Question;
  userAnswer: UserAnswer;
  isCorrect: boolean;
}