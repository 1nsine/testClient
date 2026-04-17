import { useEffect, useRef, useState } from "react";
import styles from "./ThemeSelect.module.css";
import { useTheme } from "../../../../../context/ThemeContext";
import { Button } from "../../../../UI/Button/Button";
import { useTranslation } from "react-i18next";

type Theme = "light" | "dark";

export const ThemeSelect = () => {
  const { t } = useTranslation();
  const themeLabels: Record<Theme, string> = {
    light: t("settings.site.themeLight"),
    dark: t("settings.site.themeDark"),
  };
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme() as {
    theme: Theme;
    setTheme: (value: Theme) => void;
  };

  const ref = useRef<HTMLDivElement>(null);

  // применяем тему
  useEffect(() => {
    const applyTheme = (value: Theme) => {
      document.documentElement.setAttribute("data-theme", value);
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // слушаем смену системной темы
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      document.documentElement.setAttribute(
        "data-theme",
        media.matches ? "dark" : "light",
      );
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  // закрытие по клику вне
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <Button variant="filled" onClick={() => setOpen((prev) => !prev)}>
        {themeLabels[theme]}
      </Button>

      {open && (
        <div className={styles.dropdown}>
          {(["light", "dark"] as Theme[]).map((item) => (
            <div
              key={item}
              className={`${styles.item} ${
                theme === item ? styles.active : ""
              }`}
              onClick={() => {
                setTheme(item);
                setOpen(false);
              }}
            >
              {themeLabels[item]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
