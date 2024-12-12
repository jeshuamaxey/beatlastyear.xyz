"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type SyncWithStravaButtonProps = {
  className?: string
  onSuccess?: () => void
}

const SyncWithStravaButton = ({className, onSuccess}: SyncWithStravaButtonProps) => {
  const queryClient = useQueryClient()

  const stravaMutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async () => await fetch("/api/sync-strava", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["times"]})
      onSuccess && onSuccess();
    }
  })

  return <Button
    onClick={() => stravaMutation.mutate()}
    disabled={stravaMutation.isPending}
    className={cn([className, "mb-4"])}
  >
    {stravaMutation.isPending ? "Syncing..." : "Sync with Strava"}
  </Button>
}

export default SyncWithStravaButton