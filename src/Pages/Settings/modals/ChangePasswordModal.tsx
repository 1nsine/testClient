import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../../../Components/Modal/Modal";
import { Button } from "../../../UI/Button/Button";
import { Input } from "../../../UI/Input/Input";
import styles from "../Settigs.module.css";
import { useChangePassword } from "../hooks/useChangePassword";

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const { changePassword, loading } = useChangePassword();

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ mode: "onChange" });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    const ok = await changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} rotation="vertical">
      <h2>{t("settings.security.changePassword")}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputContainer}>
          <Input
            autoComplete="off"
            autoCapitalize="off"
            label={t("settings.security.changePassword.oldPassword")}
            type="password"
            {...register("oldPassword", {
              required: t("password.required") || "Password is required",
              minLength: {
                value: 6,
                message: t("password.minLength") || "Minimum 6 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*\d).+$/,
                message:
                  t("password.pattern") ||
                  "Must contain uppercase, lowercase and number",
              },
            })}
          />
          <p className={styles.error}>{errors.oldPassword?.message || " "}</p>
        </div>

        <div className={styles.inputContainer}>
          <Input
            label={t("confirmPassword.password")}
            type="password"
            {...register("newPassword", {
              required: t("password.required") || "Password is required",
              minLength: {
                value: 6,
                message: t("password.minLength") || "Minimum 6 characters",
              },
              validate: (value) =>
                value !== watch("oldPassword") ||
                t("settings.security.changePasswordError"),
              pattern: {
                value: /^(?=.*[a-z])(?=.*\d).+$/,
                message:
                  t("password.pattern") ||
                  "Must contain uppercase, lowercase and number",
              },
            })}
          />
          <p className={styles.error}>{errors.newPassword?.message || " "}</p>
        </div>

        <div className={styles.inputContainer}>
          <Input
            label={t("confirmPassword.confirmPassword")}
            type="password"
            {...register("confirmPassword", {
              required: t("password.required") || "Confirm your password",
              validate: (value) =>
                value === watch("newPassword") || t("confirmPassword.match"),
            })}
          />
          <p className={styles.error}>
            {errors.confirmPassword?.message || " "}
          </p>
        </div>

        <p style={{ fontSize: 14, color: "var(--color-secondary)" }}>
          {t("settings.security.changePassword.description")}
        </p>

        <Button variant="filled" type="submit" disabled={loading}>
          {t("settings.security.changePasswordButton")}
        </Button>
      </form>
    </Modal>
  );
}

