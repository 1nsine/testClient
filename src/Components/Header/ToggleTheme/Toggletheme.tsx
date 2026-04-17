import { FaSun, FaMoon } from "react-icons/fa";
import Styles from "./ToggleTheme.module.css";
import { useTheme } from "../../../../context/ThemeContext";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={Styles.toggleWrapper} onClick={toggleTheme}>
      <FaSun className={`${Styles.icon} ${Styles.sun}`} />
      <FaMoon className={`${Styles.icon} ${Styles.moon}`} />
      <div className={Styles.toggleBall} data-theme={theme} />
    </div>
  );
}
