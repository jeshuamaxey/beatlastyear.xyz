import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const useMyProfileQuery = () => {
  const supabase = createClient()

  const myProfileQuery = useQuery({
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if(userError) {
        console.error(userError)
        throw new Error(userError.message)
      }

      return await supabase.from('profiles')
        .select(`*, strava_profiles(athlete_profile, sync_status, last_synced_at)`)
        .eq('id', user!.id)
        .single()
    },
    queryKey: ['profiles', 'me']
  })

  return myProfileQuery
}

export default useMyProfileQuery;
