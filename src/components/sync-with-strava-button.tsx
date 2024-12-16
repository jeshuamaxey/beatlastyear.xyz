"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useMyProfileQuery from "@/hooks/useMyProfileQuery"
import { Database } from "@/utils/supabase/autogen.types"
import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"

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
  const router = useRouter()
  const queryClient = useQueryClient()

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

      console.log({data})

      queryClient.invalidateQueries({ queryKey: ["times"]})
      queryClient.invalidateQueries({ queryKey: ["profiles", "me"]})
      onSyncStart && onSyncStart();
    }
  })

  const stravaDisconnectMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/disconnect", { method: "GET" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", "me"]})
      onDisconnectSuccess && onDisconnectSuccess();
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
          console.log({payload})

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

  const classes = cn(["mb-4 bg-orange-600 hover:bg-orange-900", className])

  if(myProfileQuery.isPending) {
    return <Button className={classes} disabled>
      Checking...
    </Button>
  }

  if(myProfileQuery.isError) {
    console.error(myProfileQuery.error)
    return <Button className={classes} disabled>
      Error
    </Button>
  }

  const profile = myProfileQuery.data

  const isSyncing = stravaMutation.isPending || profile.data?.strava_profiles?.sync_status === "SYNCING"

  const syncBtn = <Button
    onClick={() => stravaMutation.mutate()}
    disabled={isSyncing}
    className={classes}
  >
    {isSyncing ? "Syncing..." : "Sync Strava"}
  </Button>

  const connectBtn = <Button
    onClick={() => router.push(`/api/strava/connect`)}
    disabled={stravaMutation.isPending}
    className={classes}
  >
    Connect Strava
  </Button>

  const disconnectBtn = <Button
    onClick={() => stravaDisconnectMutation.mutate()}
    disabled={stravaDisconnectMutation.isPending}
  >
    {stravaDisconnectMutation.isPending ? "..." : "Disconnect"}
  </Button>

  if(profile.data?.strava_profiles) {
    return <div className="flex gap-2">
      <p>last synced at: {profile.data.strava_profiles.last_synced_at}</p>
      {syncBtn}
      {disconnectBtn}
    </div>
  } else {
    return connectBtn
  }
}

export default SyncWithStravaButton