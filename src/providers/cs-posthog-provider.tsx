"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { ReactNode } from "react"

if (typeof window !== "undefined") {
  const debug = !!process.env.NEXT_PUBLIC_POSTHOG_DEBUG

  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    {
      api_host: "/ingest",
      person_profiles: "always",
      debug
    }
  )
}

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}