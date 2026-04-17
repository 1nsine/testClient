import { useTranslation } from "react-i18next";
import { Button } from "../Button/Button";
import styles from "./Error.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  statusCode: number;
  error: string;
  message: string;
}

export function Error({ statusCode, error, message }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = error;
  }, [error]);
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h2>{statusCode}</h2>
          <p>{error}</p>
        </div>
        <p>{message}</p>
        <div>
          <Button variant="filled" onClick={() => navigate("/")}>
            {t("test.ToHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
