import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { Button } from "../../../../UI/Button/Button";
import type { ApiReview } from "../../../../types/api";
import { formatDateTime } from "../../../../utils/date";
import {
  getReviewStatusLabel,
  normalizeReviewStatus,
} from "../models";
import styles from "../DashBoard.module.css";

type ReviewsSectionProps = {
  reviews: ApiReview[];
  pendingReviews: number;
  reviewActionId: number | null;
  onUpdateStatus: (reviewId: number, nextStatus: "accepted" | "rejected") => void;
};

export function ReviewsSection({
  reviews,
  pendingReviews,
  reviewActionId,
  onUpdateStatus,
}: ReviewsSectionProps) {
  return (
    <section id="reviews" className={`${styles.section} ${styles.viewportSection}`}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Отзывы</p>
          <h3>Модерация пользовательских отзывов</h3>
        </div>
        <div className={styles.pill}>
          <FiClock size={16} />
          <span>{pendingReviews} ждут решения</span>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {reviews.map((review) => {
          const status = normalizeReviewStatus(review);
          const isProcessing = reviewActionId === review.id;

          return (
            <article key={review.id} className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div>
                  <strong>
                    {review.user.firstName} {review.user.lastName}
                  </strong>
                  <span>{formatDateTime(review.createdAt)}</span>
                </div>
                <span className={styles.ratingBadge}>{review.rating}/5</span>
              </div>

              <p>{review.text}</p>

              <div className={styles.infoMeta}>
                <span
                  className={`${styles.statusBadge} ${
                    status === "accepted"
                      ? styles.statusAccepted
                      : status === "rejected"
                        ? styles.statusRejected
                        : styles.statusPending
                  }`}
                >
                  {status === "accepted" ? (
                    <FiCheckCircle size={14} />
                  ) : status === "rejected" ? (
                    <FiXCircle size={14} />
                  ) : (
                    <FiClock size={14} />
                  )}
                  {getReviewStatusLabel(status)}
                </span>
                <span>@{review.user.username}</span>
              </div>

              <div className={styles.reviewActions}>
                <Button
                  variant={status === "accepted" ? "filled" : "outline"}
                  disabled={isProcessing || status === "accepted"}
                  onClick={() => onUpdateStatus(review.id, "accepted")}
                >
                  {isProcessing && status !== "rejected" ? "Сохранение..." : "Одобрить"}
                </Button>
                <Button
                  variant={status === "rejected" ? "filled" : "outline"}
                  disabled={isProcessing || status === "rejected"}
                  onClick={() => onUpdateStatus(review.id, "rejected")}
                >
                  {isProcessing && status !== "accepted" ? "Сохранение..." : "Отклонить"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
