import { useLocation, useNavigate } from "react-router-dom";
import styles from "../PasswordRecovery.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "../../../UI/Button/Button";
import { CodeInput } from "../../../UI/CodeInput/CodeInput";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import api from "../../../Config/api";
import axios from "axios";
import { toast } from "react-toastify";

export interface IConfirmCode {
  code: number;
}
export function ConfirmCode() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const userId = location.state?.userId;
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<IConfirmCode>();

  const onSubmit: SubmitHandler<IConfirmCode> = async (data) => {
    try {
      setLoading(true);
      const res = await api.post("/user/forgot-password/confirm", {
        code: Number(data.code),
      });
      if (res.data === true) {
        navigate("/forgot-password/reset-password", { state: { userId } });
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
        <h2 className={styles.title}>{t("confirmCode.title")}</h2>
        <p>{t("confirmCode.subtitle")}</p>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <CodeInput length={6} onComplete={(code) => field.onChange(code)} />
          )}
        />
        <Button variant="filled" type="submit" disabled={loading}>
          {loading ? t("confirmCode.loading") : t("confirmCode.sendButton")}
        </Button>
      </form>
    </div>
  );
}
