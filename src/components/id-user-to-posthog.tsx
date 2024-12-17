"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useEffect } from "react"

const IdentifyUserToPosthog = ({ redirectTo } : { redirectTo: string }) => {
  const router = useRouter()

  useEffect(() => {
    const id = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user && !posthog._isIdentified()) {
        posthog.identify(user.id, {})
      }
      router.push(redirectTo)
    }

    id()
  }, [posthog])

  return null
}

export default IdentifyUserToPosthog
