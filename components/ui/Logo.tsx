"use client"
import { useTheme } from "@/context/ThemeContext"

interface LogoProps {
  className?: string
  variant?: "default" | "footer"
}

export default function Logo({ className = "h-8", variant = "default" }: LogoProps) {
  let textColor = "#1E293B"
  let accentColor = "#4F46E5"
  let iconGradientStart = "#4F46E5"
  let iconGradientEnd = "#06B6D4"
  let arrowColor = "white"
  let trackStart = "#F59E0B"
  let trackEnd = "#EF4444"

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { mode, flavor } = useTheme()
    if (flavor === "stranger") {
      textColor = "#ff3333"
      accentColor = "#ff4500"
      iconGradientStart = "#ff1a1a"
      iconGradientEnd = "#ff4500"
      trackStart = "#ff4500"
      trackEnd = "#ff0066"
    } else if (mode === "dark") {
      textColor = "#f1f5f9"
      accentColor = "#59b0ff"
      iconGradientStart = "#3b8ffd"
      iconGradientEnd = "#06B6D4"
    }
  } catch {}

  // Footer variant: white text, bright vivid icon
  if (variant === "footer") {
    textColor = "#f1f5f9"
    arrowColor = "#0f172a"  // Dark arrow on bright icon for contrast
    iconGradientStart = "#59b0ff"
    iconGradientEnd = "#06B6D4"
  }

  // Unique gradient IDs to avoid SVG conflicts
  const uid = variant === "footer" ? "ft" : "hd"

  return (
    <svg
      className={className}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon Circle */}
      <g transform="translate(10, 10)">
        <path
          d="M40 70C60 70 75 55 75 35C75 15 60 0 40 0C20 0 5 15 5 35C5 55 20 70 40 70Z"
          fill={`url(#icon_bg_${uid})`}
        />
        {/* Arrow ↑ centered */}
        <path
          d="M20 45L40 25L60 45"
          stroke={arrowColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 25V65"
          stroke={arrowColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Track swoosh */}
        <path
          d="M5 80C25 80 45 85 75 85"
          stroke={`url(#track_${uid})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      {/* Text */}
      <text
        x="100"
        y="68"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="56"
        fill={textColor}
        letterSpacing="-1.5"
        style={{ transition: "fill 0.4s ease" }}
      >
        Trip<tspan fill={accentColor}>Sathi</tspan>
      </text>

      {/* Gradients */}
      <defs>
        <linearGradient id={`icon_bg_${uid}`} x1="5" y1="0" x2="75" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor={iconGradientStart} />
          <stop offset="1" stopColor={iconGradientEnd} />
        </linearGradient>
        <linearGradient id={`track_${uid}`} x1="5" y1="80" x2="75" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor={trackStart} />
          <stop offset="1" stopColor={trackEnd} />
        </linearGradient>
      </defs>
    </svg>
  )
}
