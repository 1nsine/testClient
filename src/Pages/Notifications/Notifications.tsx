import { useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useRealtime } from "../../../context/RealtimeContext";
import { useUser } from "../../../context/UserContext";
import styles from "./Notifications.module.css";
import { Error } from "../../UI/Error/Error";
import { formatDateTime, parseDate } from "../../utils/date";

export function Notifications() {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { notifications, getNotifications, markAllRead } = useRealtime();

  useEffect(() => {
    document.title = `${t("title", { defaultValue: "PDD GO" })} | ${t(
      "notif.title",
      { defaultValue: "Уведомления" },
    )}`;
  }, [t]);

  useEffect(() => {
    if (!user) return;

    getNotifications();
    markAllRead();
  }, [getNotifications, markAllRead, user]);

  const locale =
    i18n.resolvedLanguage === "kk"
      ? "kk-KZ"
      : i18n.resolvedLanguage === "en"
        ? "en-US"
        : "ru-RU";

  const formatNotificationDate = (value?: string) => {
    const date = parseDate(value);

    if (!date) {
      return t("notif.noDate", { defaultValue: "Без даты" });
    }

    return formatDateTime(date, locale, {
      year: undefined,
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <Error
        statusCode={401}
        error={t("auth.unauthorizedTitle", {
          defaultValue: "Не авторизован",
        })}
        message={t("auth.unauthorizedMessage", {
          defaultValue: "Чтобы посмотреть эту страницу, нужно войти в систему.",
        })}
      />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.listWrapper}>
          <div className={styles.listHeader}>
            <div>
              <h2>
                {t("notif.feedTitle", {
                  defaultValue: "Последняя активность",
                })}
              </h2>
              <p>
                {t("notif.feedSubtitle", {
                  defaultValue:
                    "Новые сообщения отмечаются автоматически и сохраняются в хронологии.",
                })}
              </p>
            </div>
            <span className={styles.counter}>
              {notifications.length} {t("notif.counter")}
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <FiBell size={30} />
              <h3>
                {t("notif.emptyTitle", {
                  defaultValue: "У вас пока нет уведомлений",
                })}
              </h3>
              <p>
                {t("notif.emptySubtitle", {
                  defaultValue:
                    "Когда система или модераторы отправят новое сообщение, оно появится здесь.",
                })}
              </p>
            </div>
          ) : (
            <ul className={styles.list}>
              {notifications.map((notification, index) => (
                <li
                  key={notification.id}
                  className={`${styles.item} ${
                    notification.isRead ? styles.read : styles.unread
                  }`}
                >
                  <div className={styles.marker}>{index + 1}</div>

                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <span className={styles.itemLabel}>
                        {notification.isRead
                          ? t("notif.status.read", {
                              defaultValue: "Прочитано",
                            })
                          : t("notif.status.new", { defaultValue: "Новое" })}
                      </span>
                      <time className={styles.timestamp}>
                        {formatNotificationDate(notification.createdAt)}
                      </time>
                    </div>

                    <p className={styles.message}>{notification.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
