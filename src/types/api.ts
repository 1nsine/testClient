import type { IUser, Review } from "./types";

export type AdminUser = IUser & {
  isPremium?: boolean;
  premium?: boolean;
  subscriptionStatus?: string | null;
};

export type ApiReview = Review & {
  status?: string;
};

export type ApiFeedback = {
  id: number | string;
  title?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  email?: string;
  user?: Partial<IUser>;
};

export type ApiTestResult = {
  id: number;
  correctAnswers: number;
  timespend: number;
  passed: boolean;
  createdAt: string;
};

export type ApiQuestionAnswer = {
  id?: number;
  number: number;
  text: string;
  is_correct: boolean;
};

export type ApiQuestion = {
  id: number;
  image_url: string | null;
  question_number: number;
  question: string;
  answers: ApiQuestionAnswer[];
};
