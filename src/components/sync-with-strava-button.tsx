"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useMyProfileQuery from "@/hooks/useMyProfileQuery"
import { Database } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"
import { formatDistance } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import posthog from "posthog-js"
import Image from "next/image"

type TimeInsert = Database["public"]["Tables"]["times"]["Insert"]
type StravaProfile = Database["public"]["Tables"]["strava_profiles"]["Row"]

type Payload = {
  new: StravaProfile
}

type SyncWithStravaButtonProps = {
  className?: string
  onSyncStart?: () => void
  onSyncSuccess?: () => void
  onDisconnectSuccess?: () => void
}

const SyncWithStravaButton = ({className, onSyncStart, onSyncSuccess, onDisconnectSuccess}: SyncWithStravaButtonProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const supabase = createClient()

  const myProfileQuery = useMyProfileQuery()

  const stravaMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/sync", { method: "POST" }),
    onSuccess: async (res) => {
      const data: {
        status: number
        data: TimeInsert[]
      } = await res.json()

      queryClient.invalidateQueries({ queryKey: ["times"]})
      queryClient.invalidateQueries({ queryKey: ["profiles", "me"]})

      posthog.capture('strava-sync-start-successful')

      onSyncStart && onSyncStart();
    },
    onError: () => {
      posthog.capture('strava-sync-start-failed')
    }
  })

  const stravaDisconnectMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/disconnect", { method: "GET" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", "me"]})

      posthog.capture('strava-disconnect-successful')

      onDisconnectSuccess && onDisconnectSuccess();
    },
    onError: () => {
      posthog.capture('strava-disconnect-failed')
    }
  })

  useEffect(() => {
    const channel = supabase
      .channel('strava profiles updates')
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "strava_profiles"
        },
        (payload: Payload) => {
          onSyncSuccess && onSyncSuccess();

          queryClient.invalidateQueries({ queryKey: ["times"]})
          queryClient.invalidateQueries({ queryKey: ["profiles", "me"]})

        }
      )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [supabase])

  const classes = cn(["mb-4 bg-orange-600 hover:bg-orange-600/80 text-white", className])

  if(myProfileQuery.isPending) {
    return <Button
      size="sm" className={classes} disabled>
      Checking...
    </Button>
  }

  if(myProfileQuery.isError) {
    console.error(myProfileQuery.error)
    return <Button
      size="sm" className={classes} disabled>
      Error
    </Button>
  }

  const profile = myProfileQuery.data

  const isSyncing = stravaMutation.isPending || profile.data?.strava_profiles?.sync_status === "SYNCING"

  const syncOption = <DropdownMenuItem
    onClick={() => {
      posthog.capture("strava-sync-start-requested")
      stravaMutation.mutate()
    }}
    disabled={isSyncing}
  >
    {isSyncing ? "Syncing..." : "Sync now"}
  </DropdownMenuItem>

  const connectBtn = <Image
    src="/strava-button.svg"
    alt="Connect with Strava"
    width={193}
    height={18}
    onClick={() => {
      if(stravaMutation.isPending) return

      posthog.capture('strava-connect-requested')
      router.push(`/api/strava/connect`)
    }}
    className="cursor-pointer relative top-0 active:top-1 hover:opacity-90"
  />

  const disconnectOption = <DropdownMenuItem
    onClick={() => {
      posthog.capture('strava-disconnect-requested')
      stravaDisconnectMutation.mutate()
    }}
    disabled={stravaDisconnectMutation.isPending}
  >
    {stravaDisconnectMutation.isPending ? "..." : "Disconnect"}
  </DropdownMenuItem>

  if(profile.data?.strava_profiles) {
    const syncCopy = profile.data.strava_profiles.last_synced_at ? 
      `last synced ${formatDistance(new Date(profile.data.strava_profiles.last_synced_at), new Date(), { addSuffix: true })}` :
      `never synced`

    const syncIndicator = <Badge color="orange" className="animatied animate-pulse">Syncing...</Badge>

    return <DropdownMenu>
      <DropdownMenuTrigger disabled={isSyncing}>
        <div className="flex gap-2">
          {isSyncing ? syncIndicator : (
            <Badge color="orange">Strava connected</Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 text-right">
        {syncOption}
        {disconnectOption}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{syncCopy}</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  } else {
    return connectBtn
  }
}

export default SyncWithStravaButton