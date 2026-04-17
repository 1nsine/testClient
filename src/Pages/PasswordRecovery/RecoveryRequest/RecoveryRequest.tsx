import { useTranslation } from "react-i18next";
import { Input } from "../../../UI/Input/Input";
import styles from "../PasswordRecovery.module.css";
import { Button } from "../../../UI/Button/Button";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import api from "../../../Config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
interface IEmailInput {
  email: string;
}
export function RecoveryRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEmailInput>();
  const onSubmit: SubmitHandler<IEmailInput> = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/user/forgot-password", {
        email: data.email,
      });
      toast(
        "Код отправлен в ваш телеграм введите его в следующем поле для сброса паяроля",
      );
      const userId = res.data.userId;
      navigate("/forgot-password/confirm", { state: { userId } });
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
        <h2 className={styles.title}>{t("recovery.title")}</h2>
        <Input
          label={t("recovery.emailLabel")}
          {...register("email", {
            required: t("password.required"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("recovery.invalidEmail"),
            },
          })}
        />
        <p className={styles.error}>{errors.email?.message || " "}</p>
        <Button variant="filled" type="submit" disabled={loading}>
          {loading ? t("recovery.loading") : t("recovery.sendButton")}
        </Button>
      </form>
    </div>
  );
}
