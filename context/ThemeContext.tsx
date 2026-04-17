import React, { createContext, useContext, useEffect, useState } from "react";

const StorageKey = "theme";
const supportedThemes = {
  light: "light",
  dark: "dark",
};

type Themes = keyof typeof supportedThemes;

type ThemeContextValue = {
  theme: Themes;
  setTheme: (theme: Themes) => void;
  supportedThemes: typeof supportedThemes;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'You can use "useTheme" hook only within a <ThemeProvider> component.',
    );
  }

  return context;
};

const getTheme = (): Themes => {
  let theme = localStorage.getItem(StorageKey);

  if (!theme) {
    localStorage.setItem(StorageKey, "dark");
    theme = "dark";
  }

  return theme as Themes;
};

const Theme = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(getTheme);

  useEffect(() => {
    localStorage.setItem(StorageKey, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        supportedThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

Theme.SimpleToggler = function SimpleToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setTheme(theme === "dark" ? "light" : "dark");
        }
      }}
    >
      <div data-theme={theme} />
    </div>
  );
};

export { useTheme };
export default Theme;
