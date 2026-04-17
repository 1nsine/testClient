import { env } from "../../Config/env";
import { Button } from "../../UI/Button/Button";
import styles from "./Premium.module.css";

export function Premium() {
  const telegramUrl = env.telegramPremiumUrl;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <section className={styles.hero}>
          <h1>Premium подписка</h1>
          <p className={styles.lead}>
            Откройте безлимитные тренировки, расширенную статистику и особый значок
            в профиле. Пока что оформление идёт через Telegram.
          </p>

          <div className={styles.priceRow}>
            <div className={styles.price}>1499 тг</div>
            <div className={styles.priceHint}>в месяц</div>
          </div>

          <div className={styles.ctaRow}>
            <a href={telegramUrl} target="_blank" rel="noreferrer">
              <Button variant="filled" type="button">
                Купить Premium в Telegram
              </Button>
            </a>
            <a href={telegramUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" type="button">
                Задать вопрос
              </Button>
            </a>
          </div>
        </section>

        <section className={styles.cardRow}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>
              Базовая версия <span className={styles.badge}>Free</span>
            </h2>
            <ul className={styles.list}>
              <li>Ограниченные тренировки</li>
              <li>Базовая статистика</li>
              <li>Без premium-значка</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>
              Premium <span className={styles.badge}>1499 тг/мес</span>
            </h2>
            <ul className={styles.list}>
              <li>Безлимитные тесты</li>
              <li>Более подробная статистика</li>
              <li>Особый значок (корона) в профиле</li>
            </ul>
          </article>
        </section>

        <div className={styles.note}>
          <strong>Примечание:</strong> после оплаты мы активируем Premium на вашем
          аккаунте. Если вы ещё не авторизованы, сначала войдите в профиль.
        </div>
      </div>
    </div>
  );
}

