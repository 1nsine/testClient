import React from "react";
import styles from "./Results.module.css";
import { Button } from "../../UI/Button/Button";

type ResultsProps = {
  correctAnswers: number;
  total: number;
  testMode: string;
  examPassed: boolean;
  goToHome: () => void;
  t: (key: string) => string;
};

const Results: React.FC<ResultsProps> = ({
  correctAnswers,
  total,
  testMode,
  examPassed,
  goToHome,
  t,
}) => {
  const percentage = Math.round((correctAnswers / total) * 100);
  const isExam = testMode === "exam";

  return (
    <div className={styles.container}>
      <div
        className={`${styles.results} ${
          isExam ? (examPassed ? styles.passed : styles.failed) : ""
        }`}
      >
        <h2>{t("test.Results")}</h2>

        {isExam && (
          <h3>
            {examPassed ? t("test.ExamPassed") : t("test.ExamFailedScore")}
          </h3>
        )}

        <p>
          {t("test.correctAnswers")}: {correctAnswers}
        </p>

        <p>
          {t("test.TotalQuestions")}: {total}
        </p>

        <p className={styles.percentage}>
          {t("test.percentage")}: {percentage}%
        </p>
        <p>{t("test.description")}</p>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={goToHome}>
            {t("test.ToHome")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
