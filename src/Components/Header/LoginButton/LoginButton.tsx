import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../../context/UserContext";
import { useRealtime } from "../../../../context/RealtimeContext";
import { Loader } from "../../../UI/Loader/Loader";
import { Badge } from "../../../UI/Badge/Badge";
import styles from "./LoginButton.module.css";
import { Button } from "../../../UI/Button/Button";
import { FaCrown } from "react-icons/fa";

const LoginButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout, loading } = useUser();
  const { unreadCount } = useRealtime();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isPremium =
    user?.premium === true ||
    user?.isPremium === true ||
    user?.subscriptionStatus?.toLowerCase() === "premium";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader width={32} />
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.wrapper} ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          style={{ marginTop: 0 }}
        >
          <span className={styles.triggerLabel}>
            {user.firstName} {user.lastName[0]}.
            {isPremium && (
              <span
                className={styles.crown}
                aria-label="Premium user"
                title="Premium"
              >
                <FaCrown size={14} />
              </span>
            )}
          </span>
          <span className={styles.arrow}>{open ? "\u25B2" : "\u25BC"}</span>
          <Badge
            count={
              unreadCount > 0 && !user.telegram_id
                ? 2
                : unreadCount > 0 || !user.telegram_id
                  ? 1
                  : 0
            }
          />
        </Button>

        {open && (
          <div className={styles.dropdown}>
            <Link
              to="/profile"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              {t("profile")}
            </Link>

            <Link
              to="/notifications"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              {t("Notifications")}
              <Badge count={unreadCount} />
            </Link>

            {!isPremium && (
              <Link
                to="/premium"
                className={styles.item}
                onClick={() => setOpen(false)}
              >
                Premium
              </Link>
            )}

            <Link
              to="/settings#user"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              {t("settings")}
              <Badge count={user.telegram_id === null ? 1 : 0} />
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin-panel"
                className={styles.item}
                onClick={() => setOpen(false)}
              >
                {t("admin.panel")}
              </Link>
            )}

            <Button
              variant="filled"
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              {t("exit")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Button
        style={{ marginTop: 0 }}
        variant="outline"
        type="button"
        onClick={() => navigate("/login")}
      >
        {t("login")}
      </Button>
    </div>
  );
};

export default LoginButton;
