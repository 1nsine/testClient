import { useTranslation } from "react-i18next";
import styles from "./Feedback.module.css";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../UI/Input/Input";
import { Textarea } from "../../UI/Textarea/Textarea";
import { Button } from "../../UI/Button/Button";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../Config/api";
interface FormValues {
  title: string;
  message: string;
}

export function Feedback() {
  const [loading, setloading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    try {
      setloading(true);
      await api.post("/feedback", data);
      reset();
      setOpen(false);

      sucsessNotify();
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const sucsessNotify = () => toast(t("feedback.sendSucsess"));

  return (
    <div style={{ position: "relative", zIndex: 1000 }} ref={containerRef}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        {t("feedback.trigger")}?
      </button>

      {open && (
        <div className={styles.feedbackContainer}>
          {user ? (
            <form className={styles.feedback} onSubmit={handleSubmit(onSubmit)}>
              <h2>{t("feedback.title")}</h2>
              <Input
                label={`${t("feedback.InputLabel")} ?`}
                {...register("title", {
                  required: t("feedback.titleError"),
                  minLength: {
                    value: 3,
                    message: t("feedback.minLength"),
                  },
                })}
              />
              <Textarea
                rows={5}
                placeholder={t("feedback.TextAreaPlaceholder")}
                {...register("message", {
                  required: t("feedback.titleError"),
                  minLength: {
                    value: 3,
                    message: t("feedback.minLength"),
                  },
                })}
              />

              <p className={styles.error}>
                {errors.title?.message || errors.message?.message || " "}
              </p>
              <Button
                variant="outline"
                type="submit"
                style={{ marginTop: "auto" }}
                disabled={loading}
              >
                {loading ? t("feedback.loading") : t("feedback.send")}
              </Button>
            </form>
          ) : (
            <div className={styles.feedback}>
              <h1>{t("feedback.UnautorizedAlert")}</h1>
              <p>{t("feedback.UnautorizedMessage")}</p>
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                style={{ marginTop: "auto" }}
              >
                {t("login")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
