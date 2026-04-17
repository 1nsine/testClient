import { useState, useRef, useEffect, type InputHTMLAttributes } from "react";
import styles from "./CodeInput.module.css";

type CodeInputProps = InputHTMLAttributes<HTMLInputElement> & {
  length?: number;
  value?: number; // новое пропс
  onComplete?: (code: string) => void;
};

export const CodeInput = ({
  length = 6,
  value,
  onComplete,
  ...rest
}: CodeInputProps) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // если приходит value, обновляем внутренний state
  useEffect(() => {
    if (value !== undefined) {
      const strValue = value.toString().padStart(length, ""); // на случай если число короче
      const newValues = Array.from({ length }, (_, i) => strValue[i] || "");
      setValues(newValues);

      // если все заполнено — вызываем onComplete
      if (newValues.every((v) => v !== "") && onComplete) {
        onComplete(newValues.join(""));
      }
    }
  }, [value, length, onComplete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const val = e.target.value.replace(/\D/g, ""); // только цифры

    const newValues = [...values];
    newValues[idx] = val;
    setValues(newValues);

    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (newValues.every((v) => v !== "") && onComplete) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className={styles.codeInputContainer}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="number"
          maxLength={1}
          value={values[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          className={styles.codeInputBox}
          {...rest}
        />
      ))}
    </div>
  );
};
