import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Test.module.css";
import { useTestLogic, type ClientOption } from "../../hooks/useTest";

import QuestionsIndicator from "./QuestionsIndicator";
import QuestionImage from "./QuestionImage";
import QuestionHeader from "./QuestionHeader";
import AnswersList from "./AnswersList";
import Results from "./Results";
import Navigation from "./Navigation";
import { Loader } from "../../UI/Loader/Loader";
import { Error } from "../../UI/Error/Error";
import formatTime from "../../hooks/useFormatTime";

type TestMode = "exam" | "infinite";

export default function Test() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode as TestMode | undefined;
  const isMobile = window.innerWidth <= 768;

  const isValidMode = mode === "exam" || mode === "infinite";

  useEffect(() => {
    if (!isValidMode) return;

    document.title =
      mode === "exam"
        ? `${t("title")} | ${t("chooseMode.exam.title")}`
        : `${t("title")} | ${t("chooseMode.infinity.title")}`;
  }, [isValidMode, mode, t]);

  const {
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
    setCurrentQuestionIndex,
    getQuestionData,
  } = useTestLogic({
    testModeParam: (mode as "infinite" | "exam") ?? "infinite",
    enabled: isValidMode,
  });

  if (!isValidMode) {
    return (
      <Error
        statusCode={400}
        error="Неверный тип запроса"
        message="Не удалось получить обязательные параметры. Попробуйте еще раз"
      />
    );
  }

  if (error) {
    return <Error statusCode={500} error="Ошибка" message={error} />;
  }

  if (showResults) {
    return (
      <Results
        correctAnswers={correctAnswers}
        total={shuffledQuestions.length}
        testMode={testMode}
        examPassed={examPassed}
        goToHome={() => navigate("/")}
        t={t}
      />
    );
  }

  if (loading) {
    return <Loader width={50} />;
  }

  if (!shuffledQuestions.length) {
    return (
      <Error
        statusCode={502}
        error="Вопросы недоступны"
        message="Не удалось получить вопросы с сервера. Попробуйте позже."
      />
    );
  }

  const q = getQuestionData(shuffledQuestions[currentQuestionIndex]);

  const getAnswerClass = (option: ClientOption) => {
    if (!isAnswered) return selectedAnswer === option.id ? styles.selected : "";
    if (option.correct) return styles.correct;
    if (selectedAnswer === option.id && !option.correct)
      return styles.incorrect;
    return "";
  };

  return (
    <div className="container">
      <div className={styles.testContainer}>
        {/* Индикатор вопросов */}
        <QuestionsIndicator
          shuffledQuestions={shuffledQuestions}
          currentQuestionIndex={currentQuestionIndex}
          answersHistory={answersHistory}
          testMode={testMode}
          timeLeft={timeLeft}
          formatTime={formatTime}
          t={t}
          onSelect={(i) => testMode !== "exam" && setCurrentQuestionIndex(i)}
        />

        {/* Изображение */}

        <QuestionImage
          key={q.image ?? "question-image"}
          src={q.image}
          alt={t("test.Question")}
        />

        {/* Заголовок вопроса */}

        <QuestionHeader
          index={currentQuestionIndex}
          number={q.question_number}
          text={q.question}
          t={t}
        />

        {/* Список ответов */}

        <AnswersList
          options={q.options}
          handleAnswerSelect={(id) => handleAnswerSelect(id, isMobile)}
          getAnswerClass={getAnswerClass}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          t={t}
        />

        {/* Навигация */}
        <Navigation
          isMobile={isMobile}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          t={t}
          checkAnswer={checkAnswer}
          next={next}
        />
      </div>
    </div>
  );
}
