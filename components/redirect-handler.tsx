"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

interface RedirectHandlerProps {
  to: string
  condition?: boolean
  delay?: number
}

export function RedirectHandler({ to, condition = true, delay = 0 }: RedirectHandlerProps) {
  const router = useRouter()
  const { loading } = useAuth()

  useEffect(() => {
    if (!loading && condition) {
      const timer = setTimeout(() => {
        router.push(to)
        router.refresh()
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [loading, condition, to, delay, router])

  return null
}
