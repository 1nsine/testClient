import { useTranslation } from "react-i18next";
import styles from "./WhyUs.module.css";
import { lazy, Suspense } from "react";

const Card = lazy(() => import("../../../Components/Card/Card"));
const WhyUs = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.why}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("WhyUs.title")}</h2>
        <p className={styles.subtitle}>{t("WhyUs.subtitle")}</p>

        <div className="grid">
          <Suspense fallback="loading">
            <Card title={t("WhyUs.title1")} subtitle={t("WhyUs.subtitle1")} />
            <Card title={t("WhyUs.title2")} subtitle={t("WhyUs.subtitle2")} />
            <Card title={t("WhyUs.title3")} subtitle={t("WhyUs.subtitle3")} />
            <Card title={t("WhyUs.title4")} subtitle={t("WhyUs.subtitle4")} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
