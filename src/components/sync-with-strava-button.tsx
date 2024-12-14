"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useMyProfileQuery from "@/hooks/useMyProfileQuery"
import { Database } from "@/utils/supabase/autogen.types"

type TimeInsert = Database["public"]["Tables"]["times"]["Insert"]

type SyncWithStravaButtonProps = {
  className?: string
  onSyncSuccess?: (times?: TimeInsert[]) => void
  onDisconnectSuccess?: () => void
}

const SyncWithStravaButton = ({className, onSyncSuccess, onDisconnectSuccess}: SyncWithStravaButtonProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const myProfileQuery = useMyProfileQuery()

  const stravaMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/sync", { method: "POST" }),
    onSuccess: async (res) => {
      const data: {
        status: number
        data: TimeInsert[]
      } = await res.json()
      const times = data.data
      queryClient.invalidateQueries({ queryKey: ["times"]})
      onSyncSuccess && onSyncSuccess(times);
    }
  })

  const stravaDisconnectMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/disconnect", { method: "GET" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strava_profiles"]})
      onDisconnectSuccess && onDisconnectSuccess();
    }
  })

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

  const syncBtn = <Button
    onClick={() => stravaMutation.mutate()}
    disabled={stravaMutation.isPending}
    className={classes}
  >
    {stravaMutation.isPending ? "Syncing..." : "Sync Strava"}
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
      {syncBtn}
      {disconnectBtn}
    </div>
  } else {
    return connectBtn
  }
}

export default SyncWithStravaButton