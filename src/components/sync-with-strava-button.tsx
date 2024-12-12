"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"

const SyncWithStravaButton = () => {
  const queryClient = useQueryClient()

  const stravaMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/sync-strava", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["times"]})
    }
  })

  return <Button
    onClick={() => stravaMutation.mutate()}
    disabled={stravaMutation.isPending}
    className="mb-4"
  >
    {stravaMutation.isPending ? "Syncing..." : "Sync with Strava"}
  </Button>
}

export default SyncWithStravaButton