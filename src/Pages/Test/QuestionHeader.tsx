import { useUser } from "../../../context/UserContext";
import styles from "./QuestionHeader.module.css";

type QuestionHeaderProps = {
  index: number;
  number: number;
  text: string;
  t: (key: string) => string;
};

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  index,
  number,
  text,
  t,
}) => {
  const { user } = useUser();
  return (
    <div className={styles.question}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>
          {t("test.Question")} {index + 1}
        </span>

        {user?.role === "admin" ? (
          <span className={styles.progress}>Номер вопроса: {number}</span>
        ) : null}
      </div>

      <h2 style={{ fontSize: "1.2rem" }}>{text}</h2>
    </div>
  );
};

export default QuestionHeader;
