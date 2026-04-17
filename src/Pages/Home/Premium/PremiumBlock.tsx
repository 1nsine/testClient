import { Link } from "react-router-dom";
import { env } from "../../../Config/env";
import { Button } from "../../../UI/Button/Button";
import styles from "./PremiumBlock.module.css";

export default function PremiumBlock() {
  return (
    <section className={styles.section} aria-labelledby="premium-title">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Premium</p>
            <h2 id="premium-title" className={styles.title}>
              Больше тренировок, больше статистики
            </h2>
            <p className={styles.lead}>
              Premium даёт безлимитные тесты, более подробную статистику и особый
              значок в профиле.
            </p>
          </div>

          <div className={styles.priceBox}>
            <div className={styles.price}>1499 тг</div>
            <span className={styles.priceHint}>в месяц</span>
          </div>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Базовая версия</h3>
            <ul className={styles.list}>
              <li>Ограниченные тренировки</li>
              <li>Базовая статистика</li>
              <li>Без premium-значка</li>
            </ul>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Premium</h3>
            <ul className={styles.list}>
              <li>Безлимитные тесты</li>
              <li>Расширенная статистика</li>
              <li>Значок короны в профиле</li>
            </ul>
          </article>
        </div>

        <div className={styles.cta}>
          <Link to="/premium">
            <Button variant="filled" type="button">
              Подробнее
            </Button>
          </Link>
          <a href={env.telegramPremiumUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" type="button">
              Купить в Telegram
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

