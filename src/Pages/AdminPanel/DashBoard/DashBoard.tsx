import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../Config/api";
import { useOnline } from "../../../hooks/useOnline";
import type {
  AdminUser,
  ApiFeedback,
  ApiQuestion,
  ApiQuestionAnswer,
  ApiReview,
  ApiTestResult,
} from "../../../types/api";
import { parseDate } from "../../../utils/date";
import styles from "./DashBoard.module.css";
import {
  createInitialQuestionForm,
  isUserPremium,
  normalizeFeedbackStatus,
  normalizeQuestionForForm,
  normalizeReviewStatus,
  type QuestionFormState,
  type ReviewStatus,
  type UserActionType,
} from "./models";
import { OverviewSection } from "./sections/OverviewSection";
import { UsersSection } from "./sections/UsersSection";
import { QuestionsSection } from "./sections/QuestionsSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { FeedbackSection } from "./sections/FeedbackSection";

type DashBoardProps = {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onSectionBadgesChange: (badges: Partial<Record<string, number>>) => void;
};

export function DashBoard({
  activeSection,
  onSectionChange,
  onSectionBadgesChange,
}: DashBoardProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(
    createInitialQuestionForm(),
  );
  const [questionSaving, setQuestionSaving] = useState(false);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [feedback, setFeedback] = useState<ApiFeedback[]>([]);
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [userAction, setUserAction] = useState<{
    id: number;
    type: UserActionType;
  } | null>(null);
  const [reviewActionId, setReviewActionId] = useState<number | null>(null);
  const [feedbackActionId, setFeedbackActionId] = useState<
    number | string | null
  >(null);
  const online = useOnline();

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, questionsRes, reviewsRes, feedbackRes, resultsRes] =
        await Promise.all([
          api.get<AdminUser[]>("/admin/users"),
          api.get<ApiQuestion[]>("/questions/infinity"),
          api.get<ApiReview[]>("/admin/reviews"),
          api.get<ApiFeedback[]>("/admin/feedback"),
          api.get<ApiTestResult[]>("/admin/results"),
        ]);

      setUsers(usersRes.data);
      setQuestions(
        [...questionsRes.data].sort(
          (first, second) => first.question_number - second.question_number,
        ),
      );
      setReviews(reviewsRes.data);
      setFeedback(feedbackRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось загрузить данные админ-панели");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Панель администратора";
    void loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const admins = users.filter((user) => user.role === "admin").length;
    const recentUsers = users.filter((user) => {
      const createdAt = parseDate(user.createdAt);

      if (!createdAt) return false;

      const diff = Date.now() - createdAt.getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;
    const pendingReviews = reviews.filter(
      (review) => normalizeReviewStatus(review) === "pending",
    ).length;
    const urgentFeedback = feedback.filter((item) => {
      const text = `${item.title ?? ""} ${item.message ?? ""}`.toLowerCase();
      return (
        text.includes("bug") ||
        text.includes("ошиб") ||
        text.includes("problem")
      );
    }).length;
    const passedResults = results.filter((result) => result.passed).length;
    const totalCorrectAnswers = results.reduce(
      (sum, result) => sum + result.correctAnswers,
      0,
    );
    const totalTimeSpent = results.reduce(
      (sum, result) => sum + result.timespend,
      0,
    );
    const successRate =
      results.length > 0
        ? Math.round((passedResults / results.length) * 100)
        : 0;
    const averageScore =
      results.length > 0
        ? (totalCorrectAnswers / results.length).toFixed(1)
        : "0.0";
    const averageTimeSeconds =
      results.length > 0 ? Math.round(totalTimeSpent / results.length) : 0;

    return {
      admins,
      recentUsers,
      pendingReviews,
      urgentFeedback,
      totalResults: results.length,
      passedResults,
      successRate,
      averageScore,
      averageTimeSeconds,
      totalQuestions: questions.length,
    };
  }, [feedback, questions.length, results, reviews, users]);

  const filteredUsers = useMemo(() => {
    const adminUsers = users.filter((user) => user.role === "admin");
    const query = userSearch.trim().toLowerCase();

    if (!query) return adminUsers;

    return users.filter((user) =>
      [user.firstName, user.lastName, user.username]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [userSearch, users]);

  const filteredQuestions = useMemo(() => {
    const query = questionSearch.trim().toLowerCase();

    if (!query) return [];

    return questions.filter(
      (question) =>
        question.question.toLowerCase().includes(query) ||
        String(question.question_number).includes(query),
    );
  }, [questionSearch, questions]);

  const latestReviews = useMemo(() => reviews.slice(0, 6), [reviews]);
  const latestFeedback = useMemo(() => feedback.slice(0, 5), [feedback]);
  const visibleUsers = useMemo(
    () => filteredUsers.slice(0, 6),
    [filteredUsers],
  );
  const newFeedbackCount = useMemo(
    () =>
      feedback.filter((item) => normalizeFeedbackStatus(item) === "new").length,
    [feedback],
  );

  useEffect(() => {
    onSectionBadgesChange({
      reviews: stats.pendingReviews,
      feedback: newFeedbackCount,
    });
  }, [newFeedbackCount, onSectionBadgesChange, stats.pendingReviews]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    if (minutes === 0) return `${restSeconds} сек`;

    return `${minutes} мин ${restSeconds} сек`;
  };

  const resetQuestionForm = () => {
    setQuestionForm(createInitialQuestionForm());
  };

  const handleQuestionAnswerChange = (
    index: number,
    field: "text" | "is_correct",
    value: string | boolean,
  ) => {
    setQuestionForm((prev) => ({
      ...prev,
      answers: prev.answers.map((answer, answerIndex) => {
        if (field === "is_correct") {
          return {
            ...answer,
            is_correct: answerIndex === index,
          };
        }

        if (answerIndex !== index) return answer;

        return {
          ...answer,
          text: String(value),
        };
      }),
    }));
  };

  const validateQuestionForm = () => {
    const questionText = questionForm.question.trim();
    const questionNumber = Number(questionForm.question_number);
    const normalizedAnswers = questionForm.answers.map((answer) =>
      answer.text.trim(),
    );
    const correctAnswersCount = questionForm.answers.filter(
      (answer) => answer.is_correct,
    ).length;

    if (!questionText) {
      toast.error("Введите текст вопроса");
      return false;
    }

    if (!Number.isInteger(questionNumber) || questionNumber <= 0) {
      toast.error("Укажите корректный номер вопроса");
      return false;
    }

    if (normalizedAnswers.some((answer) => !answer)) {
      toast.error("Заполните все варианты ответов");
      return false;
    }

    if (correctAnswersCount !== 1) {
      toast.error("Нужно выбрать ровно один правильный ответ");
      return false;
    }

    return true;
  };

  const submitQuestion = async () => {
    if (!validateQuestionForm()) return;

    const payload = {
      question_number: Number(questionForm.question_number),
      question: questionForm.question.trim(),
      image_url: questionForm.image_url.trim() || null,
      answers: questionForm.answers.map<ApiQuestionAnswer>((answer, index) => ({
        ...(answer.id ? { id: answer.id } : {}),
        number: index + 1,
        text: answer.text.trim(),
        is_correct: answer.is_correct,
      })),
    };

    try {
      setQuestionSaving(true);

      if (questionForm.id) {
        await api.put(`/admin/questions/${questionForm.id}`, payload);
        toast.success("Вопрос успешно обновлен");
      } else {
        await api.post("/admin/question", payload);
        toast.success("Вопрос успешно добавлен");
      }

      resetQuestionForm();
      setQuestionSearch("");
      await loadDashboard();
    } catch (error) {
      console.error(error);
      toast.error(
        questionForm.id
          ? "Не удалось сохранить изменения вопроса"
          : "Не удалось добавить вопрос",
      );
    } finally {
      setQuestionSaving(false);
    }
  };

  const startEditingQuestion = (question: ApiQuestion) => {
    setQuestionForm(normalizeQuestionForForm(question));
  };

  const toggleAdminRole = async (userId: number) => {
    const previousUsers = users;
    const targetUser = users.find((user) => user.id === userId);
    const shouldRemoveAdmin = targetUser?.role === "admin";
    const nextRole = shouldRemoveAdmin ? "user" : "admin";
    const actionType: UserActionType = shouldRemoveAdmin
      ? "remove-admin"
      : "make-admin";
    const endpoint = shouldRemoveAdmin
      ? `/admin/user/${userId}/remove-admin`
      : `/admin/user/${userId}/make-admin`;

    setUserAction({ id: userId, type: actionType });
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: nextRole } : user,
      ),
    );

    try {
      await api.patch(endpoint);
      toast.success(
        shouldRemoveAdmin
          ? "Права администратора сняты"
          : "Пользователь назначен администратором",
      );
    } catch (error) {
      console.error(error);
      setUsers(previousUsers);
      toast.error(
        shouldRemoveAdmin
          ? "Не удалось снять права администратора"
          : "Не удалось назначить пользователя администратором",
      );
    } finally {
      setUserAction(null);
    }
  };

  const togglePremiumStatus = async (userId: number) => {
    const previousUsers = users;
    const targetUser = users.find((user) => user.id === userId);
    const hasPremium = targetUser ? isUserPremium(targetUser) : false;
    const actionType: UserActionType = hasPremium
      ? "remove-premium"
      : "grant-premium";
    const endpoint = hasPremium
      ? `/admin/user/${userId}/remove-premium`
      : `/admin/user/${userId}/grant-premium`;

    setUserAction({ id: userId, type: actionType });
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              isPremium: !hasPremium,
              premium: !hasPremium,
              subscriptionStatus: !hasPremium ? "premium" : null,
            }
          : user,
      ),
    );

    try {
      await api.patch(endpoint);
      toast.success(
        hasPremium ? "Премиум-статус снят" : "Премиум-доступ успешно выдан",
      );
    } catch (error) {
      console.error(error);
      setUsers(previousUsers);
      toast.error(
        hasPremium
          ? "Не удалось снять премиум-статус"
          : "Не удалось выдать премиум-доступ",
      );
    } finally {
      setUserAction(null);
    }
  };

  const updateReviewStatus = async (
    reviewId: number,
    nextStatus: ReviewStatus,
  ) => {
    const endpoint =
      nextStatus === "accepted"
        ? `/admin/reviews/accept/${reviewId}`
        : `/admin/reviews/reject/${reviewId}`;

    const previousReviews = reviews;

    setReviewActionId(reviewId);
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status: nextStatus } : review,
      ),
    );

    try {
      await api.patch(endpoint);
      toast.success(
        nextStatus === "accepted"
          ? "Отзыв успешно одобрен"
          : "Отзыв успешно отклонен",
      );
    } catch (error) {
      console.error(error);
      setReviews(previousReviews);
      toast.error("Не удалось изменить статус отзыва");
    } finally {
      setReviewActionId(null);
    }
  };

  const markFeedbackInProgress = async (feedbackId: number | string) => {
    const previousFeedback = feedback;

    setFeedbackActionId(feedbackId);
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === feedbackId ? { ...item, status: "read" } : item,
      ),
    );

    try {
      await api.patch(`/admin/feedback/read/${feedbackId}`);
      toast.success("Обращение принято в работу");
    } catch (error) {
      console.error(error);
      setFeedback(previousFeedback);
      toast.error("Не удалось изменить статус обращения");
    } finally {
      setFeedbackActionId(null);
    }
  };

  const activeScreen = (() => {
    switch (activeSection) {
      case "users":
        return (
          <UsersSection
            users={visibleUsers}
            userSearch={userSearch}
            statsAdmins={stats.admins}
            onSearchChange={setUserSearch}
            userAction={userAction}
            onToggleAdmin={toggleAdminRole}
            onTogglePremium={togglePremiumStatus}
          />
        );
      case "questions":
        return (
          <QuestionsSection
            questionsCount={questions.length}
            questionSearch={questionSearch}
            filteredQuestions={filteredQuestions}
            questionForm={questionForm}
            questionSaving={questionSaving}
            onSearchChange={setQuestionSearch}
            onResetForm={resetQuestionForm}
            onQuestionFormChange={(updater) => setQuestionForm(updater)}
            onAnswerChange={handleQuestionAnswerChange}
            onSubmit={submitQuestion}
            onStartEditing={startEditingQuestion}
          />
        );
      case "reviews":
        return (
          <ReviewsSection
            reviews={latestReviews}
            pendingReviews={stats.pendingReviews}
            reviewActionId={reviewActionId}
            onUpdateStatus={updateReviewStatus}
          />
        );
      case "feedback":
        return (
          <FeedbackSection
            feedback={latestFeedback}
            feedbackActionId={feedbackActionId}
            onMarkInProgress={markFeedbackInProgress}
          />
        );
      case "overview":
      default:
        return (
          <OverviewSection
            loading={loading}
            online={online}
            usersCount={users.length}
            reviewsCount={reviews.length}
            feedbackCount={feedback.length}
            pendingReviews={stats.pendingReviews}
            newFeedbackCount={newFeedbackCount}
            stats={stats}
            formatDuration={formatDuration}
            onSectionChange={onSectionChange}
          />
        );
    }
  })();

  return <div className={styles.dashboard}>{activeScreen}</div>;
}
