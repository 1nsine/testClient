import { useTranslation } from "react-i18next";
import styles from "./Hero.module.css";
const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <span className={styles.badge}>{t("hero.actual")}</span>

        <h1 className={styles.title}>{t("hero.title")}</h1>

        <p className={styles.subtitle}>{t("hero.subtitle")}</p>

        <div className={styles.actions}>
          <a href="#modes" className={styles.primaryBtn}>
            {t("hero.action")}
          </a>
          <a href="#How-it-work" className={styles.secondaryBtn}>
            {`${t("hero.subAction")} ?`}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
