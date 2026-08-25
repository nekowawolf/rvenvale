"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("darkmode"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("darkmode")) {
      html.classList.remove("darkmode");
      localStorage.setItem("darkmode", "inactive");
      setIsDark(false);
    } else {
      html.classList.add("darkmode");
      localStorage.setItem("darkmode", "active");
      setIsDark(true);
    }
  };

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="cursor-pointer p-2 rounded-lg border border-[var(--border-divider)] bg-[var(--fill-color)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
    >
      <span className="theme-icon-sun text-amber-400">
        <FiSun size={18} />
      </span>
      <span className="theme-icon-moon text-indigo-400">
        <FiMoon size={18} />
      </span>
    </button>
  );
}