import type { ServerQuestion, TestMode } from "../../hooks/useTest";
import styles from "./questionsIndicator.module.css";

type QuestionsIndicatorProps = {
  shuffledQuestions: ServerQuestion[];
  currentQuestionIndex: number;
  answersHistory: (boolean | null)[];
  testMode: TestMode;
  timeLeft: number | null;
  onSelect: (index: number) => void;
  t: (key: string) => string;
  formatTime: (seconds: number) => string;
};

const QuestionsIndicator: React.FC<QuestionsIndicatorProps> = ({
  shuffledQuestions,
  currentQuestionIndex,
  answersHistory,
  testMode,
  timeLeft,
  onSelect,
  t,
  formatTime,
}) => {
  const getClass = (index: number): string => {
    if (index === currentQuestionIndex) return styles.current;
    if (answersHistory[index] === true) return styles.correct;
    if (answersHistory[index] === false) return styles.incorrect;
    return styles.notAnswered;
  };

  return (
    <div className={styles.questionsIndicator}>
      <div className={styles.indicatorTitle}>
        <span>
          {t("test.Question")}
          {testMode === "exam" && ` (${currentQuestionIndex + 1}/40)`}
        </span>

        {testMode === "exam" && timeLeft !== null && (
          <span className={styles.timerText}>
            {t("test.TimeLeft")}: {formatTime(timeLeft)}
          </span>
        )}
      </div>

      <div className={styles.questionsGrid}>
        {shuffledQuestions.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.questionDot} ${getClass(index)} ${
              testMode === "exam" ? styles.examDot : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionsIndicator;
