import { useEffect, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import Modal from "../../../Components/Modal/Modal";
import { Button } from "../../../UI/Button/Button";
import { CodeInput } from "../../../UI/CodeInput/CodeInput";
import { Loader } from "../../../UI/Loader/Loader";
import styles from "../Settigs.module.css";
import { useTelegram } from "../hooks/useTelegram";

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeComponent = QRCode as unknown as ComponentType<{
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
}>;

export function TelegramModal({ isOpen, onClose }: TelegramModalProps) {
  const { t } = useTranslation();
  const { code, loading, requestLinkCode } = useTelegram();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (!isOpen) return;
    void requestLinkCode();
  }, [isOpen, requestLinkCode]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} rotation="vertical">
      {!isMobile ? (
        <div className={styles.qrCode}>
          <div
            style={{
              background: "white",
              padding: "16px",
              display: "inline-block",
              borderRadius: 16,
            }}
          >
            <QRCodeComponent
              value="https://t.me/pddgo_bot"
              size={150}
              level="H"
            />
          </div>
          <p>{t("settings.security.linkTelegram.qrTitle")} </p>
        </div>
      ) : null}

      <div className={styles.modalContent}>
        <p>
          {t("settings.security.linkTelegram.title")} <br />
          <Button
            variant="link"
            type="button"
            onClick={() => window.open("https://t.me/pddgo_bot", "_blank")}
          >
            {t("settings.security.linkTelegram.link")}
          </Button>
        </p>
        <p>{t("settings.security.linkTelegram.subTitle")} </p>
        <div style={{ marginTop: 12 }}>
          {loading ? (
            <Loader />
          ) : (
            <CodeInput value={code ?? undefined} disabled />
          )}
        </div>
        <Button
          variant="filled"
          type="button"
          disabled={loading}
          onClick={() => window.location.reload()}
        >
          {t("settings.security.linkTelegramButton")}
        </Button>
      </div>
    </Modal>
  );
}
