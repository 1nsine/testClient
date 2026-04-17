import { type ReactNode, type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "filled" | "outline" | "link";
  children: ReactNode;
}

export function Button({
  variant = "outline",
  type = "button",
  children,
  ...props
}: IButton) {
  const variantClass = {
    filled: styles.ButtonFilled,
    outline: styles.ButtonOutline,
    link: styles.ButtonLink,
  }[variant];

  return (
    <button
      className={`${styles.Button} ${variantClass}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
