"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"

const ReprocessStravaDataButton = ({ profileId }: { profileId: string }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/strava/process", {
        method: "POST",
        body: JSON.stringify({ profileId })
      })
    },
    onSuccess: () => {
      toast({
        title: "Processing started",
        description: "Processing your Strava data. This may take a few minutes."
      })
    },
    onError: () => {
      toast({
        title: "Processing failed",
        description: "There was an error processing your Strava data. Please try again.",
        variant: "destructive"
      })
    }
  })
  
  return <Button variant="outline" size="sm" onClick={() => mutation.mutate()}>Reprocess data</Button>
}

export default ReprocessStravaDataButton