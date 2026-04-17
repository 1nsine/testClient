import {
  FiAlertTriangle,
  FiHelpCircle,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import Card from "../../../../Components/Card/Card";
import { formatDateTime } from "../../../../utils/date";
import styles from "../DashBoard.module.css";

type OverviewStats = {
  recentUsers: number;
  admins: number;
  totalQuestions: number;
  pendingReviews: number;
  urgentFeedback: number;
  totalResults: number;
  passedResults: number;
  successRate: number;
  averageScore: string;
  averageTimeSeconds: number;
};

type OverviewSectionProps = {
  loading: boolean;
  online: number;
  usersCount: number;
  reviewsCount: number;
  feedbackCount: number;
  pendingReviews: number;
  newFeedbackCount: number;
  stats: OverviewStats;
  formatDuration: (seconds: number) => string;
  onSectionChange: (id: string) => void;
};

export function OverviewSection({
  loading,
  online,
  usersCount,
  reviewsCount,
  feedbackCount,
  pendingReviews,
  newFeedbackCount,
  stats,
  formatDuration,
  onSectionChange,
}: OverviewSectionProps) {
  return (
    <section id="overview" className={`${styles.section} ${styles.viewportSection}`}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Контрольный центр</p>
          <h2>Панель управления платформой</h2>
          <p className={styles.lead}>
            Быстрый обзор метрик, активности пользователей и входящих обращений.
          </p>
        </div>

        <div className={styles.heroBadge}>
          <span>{loading ? "Синхронизация..." : "Данные актуальны"}</span>
          <strong>{formatDateTime(new Date())}</strong>
        </div>
      </header>

      <div className={styles.metrics}>
        <Card compact title="Пользователей онлайн" subtitle={`${online}`} danger="Realtime" />
        <Card
          compact
          title="Всего пользователей"
          subtitle={`${usersCount}`}
          danger={`+${stats.recentUsers} за 7 дней`}
        />
        <Card compact title="Администраторов" subtitle={`${stats.admins}`} danger="Роли доступа" />
        <Card compact title="Всего вопросов" subtitle={`${stats.totalQuestions}`} danger="Банк вопросов" />
        <Card
          compact
          title="Отзывы на модерации"
          subtitle={`${stats.pendingReviews}`}
          danger={`${reviewsCount} всего`}
        />
        <Card
          compact
          title="Жалобы и обращения"
          subtitle={`${feedbackCount}`}
          danger={`${newFeedbackCount} новых`}
        />
        <Card compact title="Всего результатов" subtitle={`${stats.totalResults}`} danger="История тестов" />
        <Card compact title="Процент сдачи" subtitle={`${stats.successRate}%`} danger="Успешные попытки" />
        <Card compact title="Среднее время" subtitle={formatDuration(stats.averageTimeSeconds)} danger="На попытку" />
      </div>

      <div className={styles.quickGrid}>
        <button type="button" className={styles.quickCard} onClick={() => onSectionChange("users")}>
          <FiUsers size={22} />
          <div>
            <strong>Пользователи</strong>
            <span>Роли, premium-статусы и активность.</span>
          </div>
        </button>
        <button type="button" className={styles.quickCard} onClick={() => onSectionChange("questions")}>
          <FiHelpCircle size={22} />
          <div>
            <strong>Вопросы</strong>
            <span>Добавить вопрос и найти нужный по поиску.</span>
          </div>
        </button>
        <button type="button" className={styles.quickCard} onClick={() => onSectionChange("reviews")}>
          <FiMessageSquare size={22} />
          <div>
            <div className={styles.quickCardHead}>
              <strong>Отзывы</strong>
              {pendingReviews > 0 ? (
                <span className={styles.quickCardBadge}>{pendingReviews}</span>
              ) : null}
            </div>
            <span>Одобрить или отклонить новые публикации.</span>
          </div>
        </button>
        <button type="button" className={styles.quickCard} onClick={() => onSectionChange("feedback")}>
          <FiAlertTriangle size={22} />
          <div>
            <div className={styles.quickCardHead}>
              <strong>Жалобы</strong>
              {newFeedbackCount > 0 ? (
                <span className={styles.quickCardBadge}>{newFeedbackCount}</span>
              ) : null}
            </div>
            <span>Принять в работу входящие обращения.</span>
          </div>
        </button>
      </div>
    </section>
  );
}
