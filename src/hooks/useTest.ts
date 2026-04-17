import { useCallback, useEffect, useRef, useState } from "react";
import api from "../Config/api";

export interface ServerAnswer {
  id: number;
  number: number;
  text: string;
  is_correct: boolean;
}

export interface ServerQuestion {
  id: number;
  image_url: string | null;
  question_number: number;
  question: string;
  answers: ServerAnswer[];
}

export interface ClientOption {
  id: number;
  text: string;
  correct: boolean;
}

export interface ClientQuestion {
  id: number;
  image: string | null;
  question_number: number;
  question: string;
  options: ClientOption[];
}

export type TestMode = "infinite" | "exam";

export interface UseTestLogicProps {
  testModeParam?: TestMode;
  enabled?: boolean;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export function useTestLogic({
  testModeParam = "infinite",
  enabled = true,
}: UseTestLogicProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState<ServerQuestion[]>(
    [],
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<(boolean | null)[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [testMode] = useState<TestMode>(testModeParam);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examPassed, setExamPassed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const finishedRef = useRef(false);

  const getQuestionData = (q: ServerQuestion): ClientQuestion => ({
    id: q.id,
    image: q.image_url,
    question_number: q.question_number,
    question: q.question,
    options: q.answers.map((answer) => ({
      id: answer.number,
      text: answer.text,
      correct: answer.is_correct,
    })),
  });

  const sendExamResult = useCallback(
    async (answersCount: number, currentTimeLeft: number) => {
      if (testMode !== "exam") return;

      try {
        const timespend = 2400 - currentTimeLeft;

        await api.post("/test-results", {
          correctAnswers: answersCount,
          timespend,
        });
      } catch (error) {
        console.error("Ошибка отправки результата:", error);
      }
    },
    [testMode],
  );

  const finalize = useCallback(
    async (currentTimeLeft: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      if (testMode === "exam") {
        setExamPassed(correctAnswers >= 32);
        await sendExamResult(correctAnswers, currentTimeLeft);
      }

      setShowResults(true);
    },
    [correctAnswers, sendExamResult, testMode],
  );

  const finish = async () => {
    if (showResults) return;
    await finalize(timeLeft ?? 0);
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const initialize = async () => {
      try {
        finishedRef.current = false;
        setLoading(true);
        setError(null);
        setShowResults(false);
        setCorrectAnswers(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);

        if (testMode === "exam") {
          const res = await api.get<ServerQuestion[]>("/questions/exam");
          const exam = shuffle(res.data);

          if (cancelled) return;

          setShuffledQuestions(exam);
          setAnswersHistory(new Array(exam.length || 40).fill(null));
          setTimeLeft(2400);
          setExamPassed(false);
          return;
        }

        const res = await api.get<ServerQuestion[]>("/questions/infinity");
        const questions = shuffle(res.data);

        if (cancelled) return;

        setShuffledQuestions(questions);
        setAnswersHistory(new Array(questions.length).fill(null));
        setTimeLeft(null);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setError("Не удалось загрузить вопросы. Попробуйте еще раз.");
          setShuffledQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [enabled, testMode]);

  useEffect(() => {
    if (testMode !== "exam" || timeLeft === null || showResults) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [showResults, testMode, timeLeft]);

  useEffect(() => {
    if (testMode === "exam" && timeLeft === 0 && !showResults) {
      void finalize(0);
    }
  }, [finalize, showResults, testMode, timeLeft]);

  const handleAnswerSelect = (answerId: number, isMobile = false) => {
    if (isAnswered) return;

    setSelectedAnswer(answerId);

    if (isMobile) {
      checkAnswer(answerId);
    }
  };

  const checkAnswer = (answerId: number | null = selectedAnswer) => {
    if (answerId === null) return;

    const question = getQuestionData(shuffledQuestions[currentQuestionIndex]);
    const selected = question.options.find((option) => option.id === answerId);

    if (!selected) return;

    const isCorrect = selected.correct;

    setAnswersHistory((prev) => {
      const copy = [...prev];
      copy[currentQuestionIndex] = isCorrect;
      return copy;
    });

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setIsAnswered(true);
  };

  const next = () => {
    if (currentQuestionIndex + 1 < shuffledQuestions.length) {
      setCurrentQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      return;
    }

    void finish();
  };

  return {
    shuffledQuestions,
    currentQuestionIndex,
    correctAnswers,
    selectedAnswer,
    isAnswered,
    answersHistory,
    showResults,
    testMode,
    timeLeft,
    examPassed,
    loading,
    error,
    handleAnswerSelect,
    checkAnswer,
    next,
    finish,
    setCurrentQuestionIndex,
    getQuestionData,
  };
}
