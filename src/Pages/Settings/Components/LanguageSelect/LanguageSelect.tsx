import { useEffect, useRef, useState } from "react";
import styles from "../ThemeSelect/ThemeSelect.module.css";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../UI/Button/Button";

type Language = "en" | "ru" | "kk"; // Добавь нужные языки

export const LanguageSelect = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Словарь языков для отображения
  const languageLabels: Record<Language, string> = {
    en: t("settings.language.english"),
    ru: t("settings.language.russian"),
    kk: t("settings.language.kazakh"),
  };

  // текущий язык
  const currentLanguage = i18n.language as Language;

  // функция смены языка
  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // сохраняем выбор
    setOpen(false);
  };

  // закрытие dropdown при клике вне
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
        {languageLabels[currentLanguage]}
      </Button>

      {open && (
        <div className={styles.dropdown}>
          {(["en", "ru", "kk"] as Language[]).map((lng) => (
            <div
              key={lng}
              className={`${styles.item} ${
                currentLanguage === lng ? styles.active : ""
              }`}
              onClick={() => changeLanguage(lng)}
            >
              {languageLabels[lng]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
