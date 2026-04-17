import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/UserContext";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import styles from "./Login.module.css";

interface ILoginInput {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login, loading } = useUser();
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<ILoginInput>();

  useEffect(() => {
    document.title = `${t("title")} | ${t("login")}`;
  }, [t]);

  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      setError("");
      await login(data.username, data.password);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось выполнить вход.",
      );
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>{t("login")}</h1>
        <Input
          type="text"
          label={t("login.username")}
          {...register("username")}
        />
        <Input
          type="password"
          label={t("login.password")}
          autoComplete="off"
          {...register("password")}
        />
        <div className={styles.links}>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            {`${t("forgot.password")}?`}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/register")}
          >
            {`${t("new.account")}?`}
          </Button>
        </div>
        <p className={styles.error}>{error || " "}</p>

        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? `${t("login.loading")}...` : t("login")}
        </Button>
      </form>
    </section>
  );
}
