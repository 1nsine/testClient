import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { useOnline } from "../../hooks/useOnline";

export const Footer: React.FC = () => {
  const online = useOnline();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.logo}>PDD GO</h3>
          <p>
            Платформа для подготовки к экзамену по правилам дорожного движения.
            Проходите тесты, анализируйте ошибки и сдавайте с первого раза 🚗
          </p>
          <p>Пользователей онлайн: {online}</p>
        </div>

        <div className={styles.section}>
          <h4>Навигация</h4>
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/results">Мои результаты</Link>
            </li>
            <li>
              <Link to="/reviews">Отзывы</Link>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Поддержка</h4>
          <ul>
            <li>
              <Link to="/privacy">Политика конфиденциальности</Link>
            </li>
            <li>
              <Link to="/terms">Пользовательское соглашение</Link>
            </li>
            <li>
              <Link to="/contact">Сообщить об ошибке</Link>
            </li>
          </ul>
          <p className={styles.email}>support@pddgo.com</p>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} PDD Go. Все права защищены.
      </div>
    </footer>
  );
};
