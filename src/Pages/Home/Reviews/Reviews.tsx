import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../Config/api";
import type { Review } from "../../../types/types";
import { formatDateTime } from "../../../utils/date";
import { Loader } from "../../../UI/Loader/Loader";
import { SendReview } from "./SendReview.component";
import Rating from "./Rating.component";
import styles from "./Reviews.module.css";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get<Review[]>("/reviews");
        setReviews(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReviews();
  }, []);

  return (
    <section className={styles.reviews}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("reviews.title")}</h2>
        <p className={styles.subtitle}>{t("reviews.subtitle")}</p>
        <SendReview />
        <div style={{ marginTop: "1rem" }}>
          {reviews.length === 0 && !loading ? (
            <p className={styles.listItem}>
              Отзывов пока нет. Оставьте отзыв среди первых
            </p>
          ) : (
            <ul className={`gridColumn ${styles.list}`}>
              {loading && <Loader width={50} />}
              {reviews.map((review) => (
                <li key={review.id} className={styles.listItem}>
                  <div className={styles.listContainer}>
                    <div className={styles.itemContainer}>
                      <img
                        src={review.user.avatarUrl}
                        alt="avatar"
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                      <div>
                        <p style={{ margin: "0 0 4px 0" }}>
                          {review.user.firstName} {review.user.lastName?.[0]}.
                        </p>
                        <Rating value={review.rating} />
                      </div>
                    </div>
                    <p style={{ color: " var(--color-secondary)" }}>
                      {formatDateTime(review.createdAt, "ru-RU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: undefined,
                        minute: undefined,
                      })}
                    </p>
                  </div>

                  <p>{review.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
