import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/UserContext";
import api from "../../Config/api";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import styles from "./Register.module.css";

type FormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function Register() {
  const { reg, loading } = useUser();
  const [load, setLoad] = useState(false);
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  useEffect(() => {
    document.title = `${t("title")} | ${t("register")}`;
  }, [t]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["firstName", "lastName"]);
      if (isValid) setStep(2);
    }

    if (step === 2) {
      isValid = await trigger(["username", "email"]);
      if (isValid) {
        try {
          setLoad(true);
          const username = watch("username");
          const email = watch("email");
          const res = await api.post<{
            usernameAvailable: boolean;
            emailAvailable: boolean;
          }>("/user/check-availability", {
            username,
            email,
          });

          let hasError = false;

          if (!res.data.usernameAvailable) {
            setError("username", {
              type: "manual",
              message: t("username.taken") || "Этот username уже занят",
            });
            hasError = true;
          }

          if (!res.data.emailAvailable) {
            setError("email", {
              type: "manual",
              message: t("email.taken") || "Этот email уже зарегистрирован",
            });
            hasError = true;
          }

          if (!hasError) setStep(3);
        } catch (error) {
          console.error(error);
        } finally {
          setLoad(false);
        }
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await reg(
        data.username,
        data.firstName,
        data.lastName,
        data.email,
        data.password,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>{t("register")}</h1>

        {step === 1 && (
          <>
            <div className={styles.inputContainer}>
              <Input
                label={t("register.firstName")}
                {...register("firstName", {
                  required: t("firstName.required"),
                  minLength: {
                    value: 2,
                    message: t("firstName.error"),
                  },
                })}
              />
              <p className={styles.error}>{errors.firstName?.message || " "}</p>
            </div>

            <div className={styles.inputContainer}>
              <Input
                label={t("register.lastName")}
                {...register("lastName", {
                  required: t("lastName.required"),
                  minLength: {
                    value: 2,
                    message: t("lastName.error"),
                  },
                })}
              />
              <p className={styles.error}>{errors.lastName?.message || " "}</p>
            </div>

            <Button type="button" variant="filled" onClick={nextStep}>
              {t("register.nextStep")}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.inputContainer}>
              <Input
                label={t("register.username")}
                {...register("username", {
                  required: t("username.required"),
                  minLength: {
                    value: 3,
                    message: t("username.error"),
                  },
                })}
              />
              <p className={styles.error}>{errors.username?.message || " "}</p>
            </div>

            <div className={styles.inputContainer}>
              <Input
                label={t("register.email")}
                {...register("email", {
                  required: t("email.required"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("email.invalid") || "Invalid email",
                  },
                })}
              />
              <p className={styles.error}>{errors.email?.message || " "}</p>
            </div>

            <Button
              type="button"
              variant="filled"
              onClick={nextStep}
              disabled={load}
            >
              {load ? t("register.check") : t("register.nextStep")}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div className={styles.inputContainer}>
              <Input
                label={t("register.password")}
                type="password"
                {...register("password", {
                  required: t("password.required") || "Password is required",
                  minLength: {
                    value: 6,
                    message: t("password.minLength") || "Minimum 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
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
                label={t("register.confirmPassword")}
                type="password"
                {...register("confirmPassword", {
                  required:
                    t("confirmPassword.required") || "Confirm your password",
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

            <Button type="submit" variant="outline">
              {loading ? t("register.loading") : t("register.submit")}
            </Button>
          </>
        )}
      </form>
    </section>
  );
}
