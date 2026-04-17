import { useTranslation } from "react-i18next";
import { Button } from "../../../UI/Button/Button";
import styles from "../PasswordRecovery.module.css";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../../../UI/Input/Input";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../Config/api";
import { toast } from "react-toastify";
import axios from "axios";

interface IConfirmPassword {
  password: string;
  confirmPassword: string;
}
export function ConfirmPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IConfirmPassword>({ mode: "onChange" });
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<IConfirmPassword> = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/user/forgot-password/newPassword", {
        userId: userId,
        password: data.password,
      });
      if (res.data === true) {
        toast.success(t("confirmPassword.success"));
        navigate("/login");
      }
    } catch (submitError) {
      if (axios.isAxiosError(submitError)) {
        toast.error(submitError.response?.data.message);
      } else if (submitError instanceof Error) {
        toast.error(submitError.message);
      } else {
        toast.error("Не удалось выполнить вход.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>{t("confirmPassword.title")}</h2>
        <div className={styles.inputContainer}>
          <Input
            label={t("confirmPassword.password")}
            type="password"
            {...register("password", {
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
          <p className={styles.error}>{errors.password?.message || " "}</p>
        </div>

        <div className={styles.inputContainer}>
          <Input
            label={t("confirmPassword.confirmPassword")}
            type="password"
            {...register("confirmPassword", {
              required: t("password.required") || "Confirm your password",
              validate: (value) =>
                value === watch("password") ||
                t("confirmPassword.match") ||
                "Passwords do not match",
            })}
          />
          <p className={styles.error}>
            {errors.confirmPassword?.message || " "}
          </p>
        </div>
        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? t("confirmPassword.loading") : t("confirmPassword.button")}
        </Button>
      </form>
    </div>
  );
}
