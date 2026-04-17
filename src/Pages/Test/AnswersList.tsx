import { lazy } from "react";
const AnswerOption = lazy(() => import("./AnswerOption"));
import styles from "./AnswersList.module.css";

export type AnswerOptionType = {
  id: number;
  text: string;
  correct: boolean;
};

type AnswersListProps = {
  options: AnswerOptionType[];
  handleAnswerSelect: (id: number) => void;
  selectedAnswer: number | null;
  isAnswered: boolean;
  getAnswerClass?: (option: AnswerOptionType) => string;
  t: (key: string) => string;
};

const AnswersList: React.FC<AnswersListProps> = ({
  options,
  handleAnswerSelect,
  selectedAnswer,
  isAnswered,
}) => {
  return (
    <div className={styles.answers}>
      {options.map((option, index) => (
        <AnswerOption
          key={option.id}
          option={option}
          index={index + 1}
          onSelect={() => handleAnswerSelect(option.id)}
          selected={selectedAnswer === option.id}
          isAnswered={isAnswered}
        />
      ))}
    </div>
  );
};

export default AnswersList;
