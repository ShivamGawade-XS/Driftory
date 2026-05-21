"use client"
import Image from "next/image"
import { useTheme } from "@/context/ThemeContext"

interface LogoProps {
  className?: string
  variant?: "default" | "footer"
}

export default function Logo({ className = "h-8", variant = "default" }: LogoProps) {
  let textColor = "#1E293B"

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { mode, flavor } = useTheme()
    if (flavor === "stranger") {
      textColor = "#ff3333"
    } else if (mode === "dark") {
      textColor = "#f1f5f9"
    }
  } catch {}

  if (variant === "footer") {
    textColor = "#f1f5f9"
  }

  // Extract height to use for image sizing from standard tailwind class (e.g. h-10 -> 40px)
  const sizeClass = className.match(/h-(\d+)/)
  const sizePixels = sizeClass ? parseInt(sizeClass[1]) * 4 : 32

  return (
    <div className={`flex items-center gap-2 ${className.replace(/h-\d+/, '')}`} style={{ height: sizePixels }}>
      <div className="relative h-full aspect-square rounded-xl overflow-hidden shadow-sm" style={{ minWidth: sizePixels }}>
        <Image
          src="/logo.png"
          alt="Driftory Logo"
          fill
          className="object-cover"
          sizes={`${sizePixels}px`}
        />
      </div>
      <span
        style={{
          color: textColor,
          fontFamily: "Outfit, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: sizePixels * 0.8,
          letterSpacing: "-0.03em",
          transition: "color 0.4s ease"
        }}
      >
        Driftory
      </span>
    </div>
  )
}
