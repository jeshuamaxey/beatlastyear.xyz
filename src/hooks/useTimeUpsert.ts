import { Database } from "@/utils/supabase/autogen.types";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"

const useTimeUpsert = ({ onSuccess }: {
  onSuccess?: () => void
}) => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['times'],
    mutationFn: async (newTimes: { time: number, year: number }[]) => {
      const { data, error: userError } = await supabase.auth.getUser()

      if(userError) {
        console.error(userError)
        throw new Error(userError.message)
      }

      const user = data.user

      const timesToInsert: Database["public"]["Tables"]["times"]["Insert"][] = newTimes.map((time) => ({
        profile_id: user.id,
        year: time.year,
        time: time.time,
        distance: "5km",
        sport: "running",
        // date: run.date,
        // strava_activity_id: run.activity_id,
        data_source: "manual"
      }))
  
      const { error } = await supabase.from("times").upsert(
        timesToInsert,
        { onConflict: "profile_id, year, distance, sport" },
      )
      
      if(error) {
        console.error(error)
        throw new Error(error.message)
      }
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['times']
      })
      onSuccess && onSuccess();
    },
  })

  return mutation
}

export default useTimeUpsert
