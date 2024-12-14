"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import useMyProfileQuery from "@/hooks/useMyProfileQuery"

type SyncWithStravaButtonProps = {
  className?: string
  onSuccess?: () => void
}

const SyncWithStravaButton = ({className, onSuccess}: SyncWithStravaButtonProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const myProfileQuery = useMyProfileQuery()

  const stravaMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/sync", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["times"]})
      onSuccess && onSuccess();
    }
  })

  const stravaDisconnectMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/strava/disconnect", { method: "GET" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strava_profiles"]})
      onSuccess && onSuccess();
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