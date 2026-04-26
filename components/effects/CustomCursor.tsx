"use client"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  let flavor = "default"
  let mode = "light"
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()
    flavor = theme.flavor
    mode = theme.mode
  } catch {}

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return
    setIsDesktop(true)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let mouseX = -100, mouseY = -100
    let isHovering = false

    // Trail particles
    const trail: { x: number; y: number; alpha: number; size: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const moveMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Push trail particle
      trail.push({
        x: mouseX,
        y: mouseY,
        alpha: 0.6,
        size: isHovering ? 4 : 2.5,
      })
      if (trail.length > 20) trail.shift()
    }

    const handleEnter = () => { isHovering = true }
    const handleLeave = () => { isHovering = false }

    // Colors
    const primaryColor = flavor === "stranger" ? [255, 50, 50] : mode === "dark" ? [89, 176, 255] : [79, 70, 229]
    const dotColor = flavor === "stranger" ? "#ff3333" : mode === "dark" ? "#59b0ff" : "#4F46E5"

    let cursorX = -100, cursorY = -100

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth cursor follow
      cursorX += (mouseX - cursorX) * 0.18
      cursorY += (mouseY - cursorY) * 0.18

      // Draw trail
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]
        p.alpha -= 0.03
        if (p.alpha <= 0) { trail.splice(i, 1); i--; continue }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primaryColor[0]},${primaryColor[1]},${primaryColor[2]},${p.alpha * 0.5})`
        ctx.fill()
      }

      // Outer ring (follows with lag)
      const ringSize = isHovering ? 28 : 18
      ctx.beginPath()
      ctx.arc(cursorX, cursorY, ringSize, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${primaryColor[0]},${primaryColor[1]},${primaryColor[2]},${isHovering ? 0.6 : 0.35})`
      ctx.lineWidth = isHovering ? 2.5 : 1.5
      ctx.stroke()

      // Glow ring in stranger mode
      if (flavor === "stranger") {
        ctx.beginPath()
        ctx.arc(cursorX, cursorY, ringSize + 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,50,50,0.1)`
        ctx.lineWidth = 8
        ctx.stroke()
      }

      // Center dot (snaps instantly)
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, isHovering ? 4 : 3, 0, Math.PI * 2)
      ctx.fillStyle = dotColor
      ctx.fill()

      requestAnimationFrame(draw)
    }

    document.addEventListener("mousemove", moveMouse)
    window.addEventListener("resize", resize)

    // Attach hover listeners
    const attachHovers = () => {
      document.querySelectorAll("a, button, [role=button], input, select, textarea, .card").forEach(el => {
        el.addEventListener("mouseenter", handleEnter)
        el.addEventListener("mouseleave", handleLeave)
      })
    }
    attachHovers()

    // Re-attach on DOM changes (for dynamically rendered content)
    const observer = new MutationObserver(attachHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    document.body.style.cursor = "none"
    requestAnimationFrame(draw)

    return () => {
      document.removeEventListener("mousemove", moveMouse)
      window.removeEventListener("resize", resize)
      observer.disconnect()
      document.body.style.cursor = ""
    }
  }, [flavor, mode])

  if (!isDesktop) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      style={{ mixBlendMode: "normal" }}
    />
  )
}
