import { useTranslation } from "react-i18next";
import styles from "../Settigs.module.css";
import { ThemeSelect } from "../Components/ThemeSelect/ThemeSelect";
import { LanguageSelect } from "../Components/LanguageSelect/LanguageSelect";

export function SiteSection() {
  const { t } = useTranslation();

  return (
    <section id="site" className={styles.section}>
      <h2 className={styles.title}>{t("settings.site")}</h2>
      <div className={styles.sectionContainer}>
        <div className={styles.list}>
          <div className={styles.item}>
            <h4>{t("settings.site.changeTheme")}</h4>
            <ThemeSelect />
          </div>
          <div className={styles.item}>
            <h4>{t("settings.site.changeLanguage")}</h4>
            <LanguageSelect />
          </div>
        </div>
      </div>
    </section>
  );
}

