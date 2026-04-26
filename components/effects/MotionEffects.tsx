"use client"
import { useEffect, useRef, useState, useCallback, ReactNode } from "react"

/* ============================================================
   1. SCROLL REVEAL — Intersection Observer entrance animations
   ============================================================ */
type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none"

interface RevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function Reveal({ children, direction = "up", delay = 0, duration = 700, className = "", once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const transforms: Record<RevealDirection, string> = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    scale: "scale(0.9)",
    none: "none",
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
      }}
    >
      {children}
    </div>
  )
}

/* ============================================================
   2. TILT 3D — Smooth 3D perspective card tilt on mouse move
   ============================================================ */
interface TiltProps {
  children: ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

export function Tilt3D({ children, className = "", intensity = 8, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * intensity
    const rotateY = (x - 0.5) * intensity

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`

    if (glare) {
      const glareEl = el.querySelector(".tilt-glare") as HTMLElement
      if (glareEl) {
        glareEl.style.opacity = "1"
        glareEl.style.background = `radial-gradient(circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
      }
    }
  }, [intensity, glare])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    const glareEl = el.querySelector(".tilt-glare") as HTMLElement
    if (glareEl) glareEl.style.opacity = "0"
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} relative overflow-hidden`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div className="tilt-glare absolute inset-0 pointer-events-none rounded-inherit z-10"
          style={{ opacity: 0, transition: "opacity 0.3s ease" }} />
      )}
    </div>
  )
}

/* ============================================================
   3. MAGNETIC BUTTON — Button that follows cursor slightly
   ============================================================ */
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className = "", strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [strength])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = "translate(0,0)"
  }, [])

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", display: "inline-block" }}>
      {children}
    </div>
  )
}

/* ============================================================
   4. COUNTER — Animated number counting up on reveal
   ============================================================ */
interface CounterProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ end, prefix = "", suffix = "", duration = 2000, className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setValue(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, started])

  return <span ref={ref} className={className}>{prefix}{value.toLocaleString()}{suffix}</span>
}

/* ============================================================
   5. PARALLAX — Scroll-linked vertical parallax
   ============================================================ */
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.3, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Skip parallax on touch devices (saves battery)
    if (window.matchMedia("(pointer: coarse)").matches) return
    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = (rect.top - window.innerHeight / 2) * speed
      el.style.transform = `translateY(${offset}px)`
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  )
}

/* ============================================================
   6. STAGGER CONTAINER — Reveal children one-by-one
   ============================================================ */
interface StaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerReveal({ children, className = "", staggerDelay = 100 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${i * staggerDelay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * staggerDelay}ms`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
        }}>
          {child}
        </div>
      )) : children}
    </div>
  )
}
