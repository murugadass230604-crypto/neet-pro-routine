import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// ==========================
// Custom Hook
// ==========================
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

// ==========================
// Theme Provider
// ==========================
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "royal";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const themes = {
      royal: {
        background: "#0f172a",
        text: "white"
      },
      dark: {
        background: "#111827",
        text: "white"
      },
      light: {
        background: "#f1f5f9",
        text: "#111"
      },
      ultra: {
        background: "#0b1120",
        text: "white"
      }
    };

    const selectedTheme = themes[theme] || themes.royal;

    document.body.style.background = selectedTheme.background;
    document.body.style.color = selectedTheme.text;

    // Smooth transition
    document.body.style.transition = "all 0.3s ease";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}