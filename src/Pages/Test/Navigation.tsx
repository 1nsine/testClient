import type React from "react";
import styles from "./Navigation.module.css";
import { Button } from "../../UI/Button/Button";

type NavigationProps = {
  isMobile: boolean;
  isAnswered: boolean;
  selectedAnswer: number | null;
  t: (key: string) => string;
  checkAnswer: (answedId: number | null) => void;
  next: () => void;
};

const Navigation: React.FC<NavigationProps> = ({
  isMobile,
  isAnswered,
  selectedAnswer,
  t,
  checkAnswer,
  next,
}) => {
  return (
    <div className={styles.navigation}>
      {!isMobile ? (
        !isAnswered ? (
          <Button
            type="button"
            onClick={() => checkAnswer(selectedAnswer)}
            disabled={selectedAnswer === null}
            variant="outline"
          >
            {selectedAnswer === null
              ? t("test.selectAnswer")
              : t("test.checkAnswer")}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => next()}
            disabled={selectedAnswer === null}
            variant="filled"
          >
            {t("test.nextQuestion")}
          </Button>
        )
      ) : (
        isAnswered && (
          <button className={styles.nextBtn} onClick={next}>
            {t("test.nextQuestion")}
          </button>
        )
      )}
    </div>
  );
};
export default Navigation;
