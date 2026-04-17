import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, PointerEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  autoComplete?: "on" | "off";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", label, autoComplete, id, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const isPassword = type === "password";
    const currentType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setShowPassword(true);
    };

    const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setShowPassword(false);
    };

    return (
      <div className={styles.field}>
        <input
          ref={ref}
          id={inputId}
          type={currentType}
          className={styles.input}
          placeholder=" "
          autoComplete={autoComplete}
          {...rest}
        />

        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            className={styles.eye}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setShowPassword(false)}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <FiEyeOff size={18} color="var(--color-main)" />
            ) : (
              <FiEye size={18} color="var(--color-main)" />
            )}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
