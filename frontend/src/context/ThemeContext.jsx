import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "royal"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const themes = {
      royal: "#0f172a",
      dark: "#111827",
      light: "#f1f5f9",
      ultra: "#0b1120"
    };

    document.body.style.background = themes[theme];
    document.body.style.color =
      theme === "light" ? "#111" : "white";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}