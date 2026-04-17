import React from "react";
import styles from "./AnswerOption.module.css";

export type AnswerOptionType = {
  id: number;
  text: string;
  correct: boolean;
};

type AnswerOptionProps = {
  option: AnswerOptionType;
  onSelect: () => void;
  selected?: boolean;
  isAnswered?: boolean;
  index: number;
};

const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  onSelect,
  selected = false,
  isAnswered = false,
  index,
}) => {
  let className = "";

  if (!isAnswered) {
    className = selected ? styles.selected : "";
  } else {
    if (option.correct) className = styles.correct;
    else if (selected && !option.correct) className = styles.incorrect;
  }

  return (
    <div className={`${styles.answer} ${className}`} onClick={onSelect}>
      <div className={styles.answerMarker}>
        <div className={styles.answerLetter}>
          {String.fromCharCode(64 + index)}
        </div>
      </div>

      <span className={styles.answerText}>{option.text}</span>
    </div>
  );
};

export default AnswerOption;
