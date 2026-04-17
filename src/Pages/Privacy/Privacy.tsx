import { useTranslation } from "react-i18next";
import styles from "./Privacy.module.css";
import { type ReactNode } from "react";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.sectionContent}>{children}</div>
  </div>
);

export default function Privacy() {
  const { t } = useTranslation();
  document.title = `${t("title")} | ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ `;
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h1>

      <Section title="1. ОБЩИЕ ПОЛОЖЕНИЯ">
        <p>
          <span>1.1</span> Настоящий документ регулирует условия использования,
          хранения, обработки персональных данных пользователей и иных данных
          используемых на сайте PDD GO (далее Сервис).
        </p>
        <p>
          <span>1.2</span>
        </p>
        <p>
          <span>1.3</span> Использование Сервиса означает автоматическое
          согласие с даннвм документом а также со всеми приложениями к нему. Не
          знание не данных документов не освобождает Вас от ответсвенности.
          согласие с
        </p>
      </Section>

      <Section title="2. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ">
        <p>
          <span>2.1</span> Персональные данные — сведения о пользователе
        </p>
        <p>
          <span>2.2</span> Обработка персональных данных включает:
        </p>
        <ul>
          <li>сбор</li>
          <li>хранение</li>
          <li>использование</li>
          <li>передачу</li>
          <li>удаление</li>
        </ul>
        <p>
          <span>2.3</span> Оператор — лицо, осуществляющее обработку данных
        </p>
      </Section>

      <Section title="3. ПЕРСОНАЛЬНЫЕ ДАННЫЕ">
        <p>
          <span>3.1</span> Основные данные:
        </p>
        <ul>
          <li>имя и фамилия</li>
          <li>email</li>
          <li>username</li>
        </ul>
        <p>
          <span>3.2</span> Технические данные:
        </p>
        <ul>
          <li>IP-адрес</li>
          <li>cookies</li>
          <li>данные сессий</li>
        </ul>
        <p>
          <span>3.3</span> Пароль хранится в зашифрованном виде
        </p>
      </Section>

      <Section title="4. ЦЕЛИ ОБРАБОТКИ ДАННЫХ">
        <p>
          <span>4.1</span> Регистрация пользователя
        </p>
        <p>
          <span>4.2</span> Аутентификация (включая SSO)
        </p>
        <p>
          <span>4.3</span> Обеспечение работы сервиса
        </p>
        <p>
          <span>4.4</span> Обеспечение безопасности
        </p>
        <p>
          <span>4.5</span> Обратная связь
        </p>
      </Section>

      <Section title="5. ПРАВОВЫЕ ОСНОВАНИЯ">
        <p>
          <span>5.1</span> Согласие пользователя
        </p>
        <p>
          <span>5.2</span> Исполнение договора
        </p>
        <p>
          <span>5.3</span> Требования законодательства Республики Казахстан
        </p>
      </Section>

      <Section title="6. ПЕРЕДАЧА ДАННЫХ">
        <p>
          <span>6.1</span> Данные не передаются третьим лицам
        </p>
        <p>
          <span>6.2</span> Исключения:
        </p>
        <ul>
          <li>требования закона</li>
          <li>технические сервисы (email и др.)</li>
        </ul>
      </Section>

      <Section title="7. ХРАНЕНИЕ И ЗАЩИТА">
        <p>
          <span>7.1</span> Данные хранятся в рамках целей обработки
        </p>
        <p>
          <span>7.2</span> Применяются меры защиты:
        </p>
        <ul>
          <li>шифрование</li>
          <li>ограничение доступа</li>
          <li>защита от несанкционированного доступа</li>
        </ul>
      </Section>

      <Section title="8. ПРАВА ПОЛЬЗОВАТЕЛЯ">
        <p>
          <span>8.1</span> Доступ к данным
        </p>
        <p>
          <span>8.2</span> Изменение данных
        </p>
        <p>
          <span>8.3</span> Удаление данных
        </p>
        <p>
          <span>8.4</span> Отзыв согласия
        </p>
      </Section>

      <Section title="9. COOKIES">
        <p>
          <span>9.1</span> Используются для авторизации и аналитики
        </p>
        <p>
          <span>9.2</span> Могут быть отключены в браузере
        </p>
      </Section>

      <Section title="10. ТРАНСГРАНИЧНАЯ ПЕРЕДАЧА">
        <p>
          <span>10.1</span> Осуществляется с соблюдением законодательства РК
        </p>
      </Section>

      <Section title="11. ИЗМЕНЕНИЯ ПОЛИТИКИ">
        <p>
          <span>11.1</span> Политика может обновляться
        </p>
        <p>
          <span>11.2</span> Актуальная версия публикуется на сайте
        </p>
      </Section>

      <Section title="12. КОНТАКТЫ">
        <p>
          <span>12.1</span> Оператор: [название]
        </p>
        <p>
          <span>12.2</span> Email: [email]
        </p>
        <p>
          <span>12.3</span> Адрес: [адрес]
        </p>
      </Section>
    </div>
  );
}
