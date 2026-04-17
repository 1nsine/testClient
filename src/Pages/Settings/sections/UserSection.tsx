import { useTranslation } from "react-i18next";
import styles from "../Settigs.module.css";
import { UserSettings } from "../Components/UserSettings/UserSettings.component";

export function UserSection() {
  const { t } = useTranslation();

  return (
    <section id="user" className={styles.section}>
      <h2 className={styles.title}>{t("settings.user")}</h2>
      <UserSettings />
    </section>
  );
}

