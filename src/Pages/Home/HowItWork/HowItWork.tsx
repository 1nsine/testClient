import { lazy, Suspense } from "react";
import styles from "./HowItWork.module.css";
import { useTranslation } from "react-i18next";
const Card = lazy(() => import("../../../Components/Card/Card"));
const HowItWork = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.howitwork} id="How-it-work">
      <div className={styles.container}>
        <h2 className={styles.title}>{t("HowItWork.title")}</h2>
        <p className={styles.subtitle}>{t("HowItWork.subtitle")}</p>

        <div className="grid">
          <Suspense fallback="loading">
            <Card
              title={t("HowItWork.title1")}
              subtitle={t("HowItWork.subtitle1")}
            />
            <Card
              title={t("HowItWork.title2")}
              subtitle={t("HowItWork.subtitle2")}
            />
            <Card
              title={t("HowItWork.title3")}
              subtitle={t("HowItWork.subtitle3")}
            />
            <Card
              title={t("HowItWork.title4")}
              subtitle={t("HowItWork.subtitle4")}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
