import { Moon, Sun } from "lucide-react";

import { useTheme } from "./themeContext";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const switchingToLight = theme === "dark";
  const label = switchingToLight
    ? "Switch to light mode"
    : "Switch to dark mode";

  return (
    <button
      className={`theme-toggle${compact ? " theme-toggle-compact" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      data-active-theme={theme}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {switchingToLight ? <Sun size={16} /> : <Moon size={16} />}
      </span>
      {!compact && <span>{switchingToLight ? "Light" : "Dark"}</span>}
    </button>
  );
}
