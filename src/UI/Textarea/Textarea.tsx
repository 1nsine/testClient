import { useId, type TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  rows: number;
}

export function Textarea({ id, rows, ...rest }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <textarea
      className={styles.textarea}
      id={inputId}
      rows={rows}
      {...rest}
    ></textarea>
  );
}
