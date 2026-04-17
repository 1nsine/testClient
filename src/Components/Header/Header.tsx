import logo from "../../assets/react.svg";
import styles from "./Header.module.css";
import LoginButton from "./LoginButton/LoginButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Header = () => {
  const { t } = useTranslation();
  return (
    <nav className={`glass-card ${styles.nav} `}>
      <Link
        className={styles.container}
        to="/"
        style={{ textDecoration: "none" }}
      >
        <img src={logo} alt="" width={32} height={32} />
        <h1>{t("title")}</h1>
      </Link>

      <div className={styles.container}>
        <LoginButton />
      </div>
    </nav>
  );
};

export default Header;
