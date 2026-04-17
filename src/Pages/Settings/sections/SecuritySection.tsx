import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle } from "react-icons/fi";
import { useUser } from "../../../../context/UserContext";
import { Badge } from "../../../UI/Badge/Badge";
import { Button } from "../../../UI/Button/Button";
import styles from "../Settigs.module.css";
import { ChangePasswordModal } from "../modals/ChangePasswordModal";
import { TelegramModal } from "../modals/TelegramModal";
import { TwoFactorModal } from "../modals/TwoFactorModal";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../Config/api";

export function SecuritySection() {
  const { t } = useTranslation();
  const { user } = useUser();

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);

  if (!user) return null;

  const get2FA = async () => {
    try {
      setIsTwoFactorOpen(true);
      await api.post("/user/enable2FA");
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to confirm 2FA.");
      }
      setIsTwoFactorOpen(false);
      return false;
    }
  };

  return (
    <section id="security" className={styles.section}>
      <h2 className={styles.title}>{t("settings.security")}</h2>
      <div className={styles.sectionContainer}>
        <div className={styles.list}>
          <div className={styles.item}>
            <h4>{t("settings.security.linkTelegram")}</h4>
            {user.telegram_id ? (
              <span
                style={{
                  color: "green",
                  alignItems: "flex-end",
                  width: "100%",
                  maxWidth: "10rem",
                  display: "flex",
                  gap: 10,
                }}
              >
                <FiCheckCircle size={16} />{" "}
                {t("settings.security.TelegramLinked")}
              </span>
            ) : (
              <div className={styles.buttonWithBadge}>
                <Button
                  variant="outline"
                  style={{ maxWidth: "10rem" }}
                  onClick={() => setIsTelegramModalOpen(true)}
                >
                  <Badge count={1} />
                  {t("settings.security.linkTelegram")}
                </Button>
              </div>
            )}
          </div>

          <div className={styles.item}>
            <h4>{t("settings.security.changePassword")}</h4>
            <Button
              variant="outline"
              style={{ maxWidth: "10rem" }}
              onClick={() => setIsChangePasswordOpen(true)}
            >
              {t("settings.security.changePasswordButton")}
            </Button>
          </div>

          <div className={styles.item}>
            <h4>{t("settings.security.twoFactorAuth")}</h4>
            {user.telegram_id ? (
              <Button
                variant={user.two_factor_enabled ? "outline" : "filled"}
                style={{ maxWidth: "10rem" }}
                onClick={() => get2FA()}
              >
                {user.two_factor_enabled
                  ? t("settings.security.disableTwoFactorAuth")
                  : t("settings.security.enableTwoFactorAuth")}
              </Button>
            ) : (
              <span className="error">
                {t("settings.security.telegramNoLinked")}
              </span>
            )}
          </div>
        </div>
      </div>

      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
      <TwoFactorModal
        isOpen={isTwoFactorOpen}
        onClose={() => setIsTwoFactorOpen(false)}
      />
    </section>
  );
}
