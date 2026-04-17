import { FiCheckCircle, FiClock } from "react-icons/fi";
import { Button } from "../../../../UI/Button/Button";
import type { ApiFeedback } from "../../../../types/api";
import { formatDateTime } from "../../../../utils/date";
import {
  getFeedbackStatusLabel,
  getFeedbackSummary,
  normalizeFeedbackStatus,
} from "../models";
import styles from "../DashBoard.module.css";

type FeedbackSectionProps = {
  feedback: ApiFeedback[];
  feedbackActionId: number | string | null;
  onMarkInProgress: (feedbackId: number | string) => void;
};

export function FeedbackSection({
  feedback,
  feedbackActionId,
  onMarkInProgress,
}: FeedbackSectionProps) {
  return (
    <section
      id="feedback"
      className={`${styles.section} ${styles.viewportSection}`}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Жалобы и обращения</p>
          <h3>Лента обращений от пользователей</h3>
        </div>
        <div className={styles.pill}>
          <FiClock size={16} />
          <span>Последние {feedback.length}</span>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {feedback.map((item) => {
          const feedbackStatus = normalizeFeedbackStatus(item);
          const isProcessing = feedbackActionId === item.id;

          return (
            <article key={item.id} className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div>
                  <strong>
                    {item.user?.username ||
                      item.email ||
                      "Неизвестный источник"}
                  </strong>
                  <span>{formatDateTime(item.createdAt)}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    feedbackStatus === "in_progress"
                      ? styles.statusAccepted
                      : styles.statusPending
                  }`}
                >
                  {feedbackStatus === "in_progress" ? (
                    <FiCheckCircle size={14} />
                  ) : (
                    <FiClock size={14} />
                  )}
                  {getFeedbackStatusLabel(feedbackStatus)}
                </span>
              </div>

              <p>{getFeedbackSummary(item)}</p>

              {item.message && item.title && (
                <p className={styles.secondary}>{item.message}</p>
              )}

              <div className={styles.reviewActions}>
                <Button
                  variant={
                    feedbackStatus === "in_progress" ? "filled" : "outline"
                  }
                  disabled={isProcessing || feedbackStatus === "in_progress"}
                  onClick={() => onMarkInProgress(item.id)}
                >
                  {isProcessing ? "Сохранение..." : "Принять в работу"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
