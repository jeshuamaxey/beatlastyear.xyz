"use client"

import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useEffect } from "react"

const ResetPosthog = ({ redirectTo } : { redirectTo: string }) => {
  const router = useRouter()

  useEffect(() => {
    posthog.reset()
    router.push(redirectTo)
  }, [posthog])

  return null
}

export default ResetPosthog
