import type {
  AdminUser,
  ApiFeedback,
  ApiQuestion,
  ApiReview,
} from "../../../types/api";

export type ReviewStatus = "pending" | "accepted" | "rejected";
export type FeedbackStatus = "new" | "in_progress";
export type UserActionType =
  | "make-admin"
  | "remove-admin"
  | "grant-premium"
  | "remove-premium";

export type QuestionFormAnswer = {
  id?: number;
  number: number;
  text: string;
  is_correct: boolean;
};

export type QuestionFormState = {
  id: number | null;
  question_number: string;
  question: string;
  image_url: string;
  answers: QuestionFormAnswer[];
};

export const createEmptyAnswers = (): QuestionFormAnswer[] =>
  Array.from({ length: 4 }, (_, index) => ({
    number: index + 1,
    text: "",
    is_correct: index === 0,
  }));

export const createInitialQuestionForm = (): QuestionFormState => ({
  id: null,
  question_number: "",
  question: "",
  image_url: "",
  answers: createEmptyAnswers(),
});

export const normalizeReviewStatus = (review: ApiReview): ReviewStatus => {
  const value = review.status?.toLowerCase();

  if (value === "accepted" || value === "approved" || value === "published") {
    return "accepted";
  }

  if (value === "rejected" || value === "declined") {
    return "rejected";
  }

  return "pending";
};

export const normalizeFeedbackStatus = (
  item: ApiFeedback,
): FeedbackStatus => {
  const value = item.status?.toLowerCase();

  if (
    value === "read" ||
    value === "in_progress" ||
    value === "processing" ||
    value === "accepted"
  ) {
    return "in_progress";
  }

  return "new";
};

export const getReviewStatusLabel = (status: ReviewStatus) => {
  if (status === "accepted") return "Одобрен";
  if (status === "rejected") return "Отклонен";
  return "На модерации";
};

export const getFeedbackStatusLabel = (status: FeedbackStatus) =>
  status === "in_progress" ? "В работе" : "Новое";

export const getFeedbackSummary = (item: ApiFeedback) =>
  item.title || item.message || "Без описания";

export const isUserPremium = (user: AdminUser) =>
  user.isPremium === true ||
  user.premium === true ||
  user.subscriptionStatus?.toLowerCase() === "premium";

export const getQuestionPreview = (value: string, maxLength = 140) =>
  value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;

export const normalizeQuestionForForm = (
  question: ApiQuestion,
): QuestionFormState => {
  const sortedAnswers = [...question.answers].sort((a, b) => a.number - b.number);

  return {
    id: question.id,
    question_number: String(question.question_number),
    question: question.question,
    image_url: question.image_url ?? "",
    answers:
      sortedAnswers.length > 0
        ? sortedAnswers.map((answer) => ({
            id: answer.id,
            number: answer.number,
            text: answer.text,
            is_correct: answer.is_correct,
          }))
        : createEmptyAnswers(),
  };
};
