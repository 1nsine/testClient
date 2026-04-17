import {
  FiCheckCircle,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Button } from "../../../../UI/Button/Button";
import type { AdminUser } from "../../../../types/api";
import { formatDateTime } from "../../../../utils/date";
import { isUserPremium, type UserActionType } from "../models";
import styles from "../DashBoard.module.css";

type UsersSectionProps = {
  users: AdminUser[];
  userSearch: string;
  statsAdmins: number;
  onSearchChange: (value: string) => void;
  userAction: { id: number; type: UserActionType } | null;
  onToggleAdmin: (userId: number) => void;
  onTogglePremium: (userId: number) => void;
};

export function UsersSection({
  users,
  userSearch,
  statsAdmins,
  onSearchChange,
  userAction,
  onToggleAdmin,
  onTogglePremium,
}: UsersSectionProps) {
  return (
    <section
      id="users"
      className={`${styles.section} ${styles.viewportSection}`}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Пользователи</p>
          <h3>Администраторы платформы</h3>
        </div>
        <div className={styles.pill}>
          <FiTrendingUp size={16} />
          <span>{statsAdmins} админов в системе</span>
        </div>
      </div>

      <div className={styles.userToolbar}>
        <label className={styles.userSearchWrap}>
          <FiSearch size={18} />
          <input
            type="search"
            value={userSearch}
            onChange={(event) => onSearchChange(event.target.value)}
            className={styles.userSearch}
            placeholder="Поиск пользователя по имени, фамилии или никнейму"
          />
        </label>
        <span className={styles.userCount}>{users.length} найдено</span>
      </div>

      {users.length === 0 ? (
        <div className={styles.emptyUsers}>
          <FiUsers size={26} />
          <div>
            <strong>Пользователи не найдены</strong>
            <p>
              Попробуйте изменить запрос и поискать по другому имени или
              никнейму.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.userGrid}>
          {users.map((user) => (
            <article key={user.id} className={styles.userCard}>
              <div className={styles.userCardHeader}>
                <div className={styles.identity}>
                  <img src={user.avatarUrl} alt={user.username} />
                  <div>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                    <span>@{user.username}</span>
                  </div>
                </div>

                <div className={styles.userBadges}>
                  <span className={styles.roleBadge}>
                    {user.role === "admin" ? (
                      <FiShield size={14} />
                    ) : (
                      <FiUsers size={14} />
                    )}
                    {user.role}
                  </span>
                  {isUserPremium(user) && (
                    <span
                      className={`${styles.roleBadge} ${styles.premiumBadge}`}
                    >
                      <FiCheckCircle size={14} />
                      premium
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.userMeta}>
                <span>
                  <strong>Email:</strong> {user.email}
                </span>
                <span>
                  <strong>Премиум:</strong>{" "}
                  {isUserPremium(user) ? "Активен" : "Отсутвует "}
                </span>
                <span>
                  <strong>Лимит сегодня:</strong> {user.dailyActionCount}
                </span>
                <span>
                  <strong>Последняя активность:</strong>{" "}
                  {user.lastActionDate || "Нет данных"}
                </span>
                <span>
                  <strong>Создан:</strong> {formatDateTime(user.createdAt)}
                </span>
              </div>

              <div className={styles.userActions}>
                <Button
                  variant={user.role === "admin" ? "filled" : "outline"}
                  disabled={
                    userAction?.id === user.id &&
                    (userAction.type === "make-admin" ||
                      userAction.type === "remove-admin")
                  }
                  onClick={() => onToggleAdmin(user.id)}
                >
                  {userAction?.id === user.id &&
                  (userAction.type === "make-admin" ||
                    userAction.type === "remove-admin")
                    ? "Сохранение..."
                    : user.role === "admin"
                      ? "Забрать админа"
                      : "Сделать админом"}
                </Button>
                <Button
                  variant={isUserPremium(user) ? "filled" : "outline"}
                  disabled={
                    userAction?.id === user.id &&
                    (userAction.type === "grant-premium" ||
                      userAction.type === "remove-premium")
                  }
                  onClick={() => onTogglePremium(user.id)}
                >
                  {userAction?.id === user.id &&
                  (userAction.type === "grant-premium" ||
                    userAction.type === "remove-premium")
                    ? "Сохранение..."
                    : isUserPremium(user)
                      ? "Забрать премиум"
                      : "Выдать премиум"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
