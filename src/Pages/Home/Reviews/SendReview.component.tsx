import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../../../UI/Input/Input";
import RatingPost from "./RatingPost.component";
import { Button } from "../../../UI/Button/Button";
import styles from "./SendReview.module.css";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../Config/api";
import { useUser } from "../../../../context/UserContext";

type FormValues = {
  text: string;
  rating: number;
};

export function SendReview() {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const sucsessNotify = () => toast(t("review.sendSucsess"));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      text: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.rating === 0) {
      return;
    }
    try {
      setLoading(true);
      await api.post("/reviews", data);
      reset();
      setIsOpen(false);
      sucsessNotify();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="filled" onClick={() => setIsOpen(true)} disabled={!user}>
        {user ? t("review.send") : t("review.noUser")}
      </Button>

      <p
        style={{
          color: "var(--color-secondary)",
          marginTop: "1rem",
          fontSize: 14,
        }}
      >
        {t("review.info")}
      </p>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>Оставьте ваш отзыв</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={t("review.label")}
            autoComplete="off"
            {...register("text", {
              required: t("review.textError"),
              minLength: {
                value: 3,
                message: t("review.minLength"),
              },
            })}
          />

          <Controller
            name="rating"
            control={control}
            rules={{
              validate: (value) => value > 0 || t("review.ratingError"),
            }}
            render={({ field }) => (
              <>
                <p>Выберите рейтинг</p>
                <RatingPost value={field.value} onChange={field.onChange} />
              </>
            )}
          />

          <p className={styles.error}>
            {errors.text?.message || errors.rating?.message || " "}
          </p>

          <Button variant="outline" type="submit">
            {loading ? t("review.sendReviewLoading") : t("review.sendReview")}
          </Button>
        </form>
      </Modal>
    </>
  );
}
