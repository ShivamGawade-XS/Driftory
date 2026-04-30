"use client"
import { useTheme } from "@/context/ThemeContext"

export default function ThemeToggle() {
  const { mode, flavor, toggleMode, toggleFlavor } = useTheme()

  return (
    <div className="flex items-center gap-1.5">
      {/* Light/Dark Mode Toggle */}
      <button
        onClick={toggleMode}
        className="theme-toggle-btn"
        aria-label="Toggle light/dark mode"
        title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        <span className="text-base leading-none">
          {mode === "light" ? "🌙" : "☀️"}
        </span>
      </button>

      {/* Default / Stranger Things Theme Toggle */}
      <button
        onClick={toggleFlavor}
        className={`theme-toggle-btn ${flavor === "stranger" ? "stranger-active" : ""}`}
        aria-label="Toggle Stranger Things theme"
        title={flavor === "default" ? "Enter the Upside Down" : "Return to Normal"}
      >
        <span className="text-base leading-none">
          {flavor === "default" ? "👾" : "🔮"}
        </span>
      </button>
    </div>
  )
}
