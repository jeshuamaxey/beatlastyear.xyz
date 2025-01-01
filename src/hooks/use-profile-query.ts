import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

type ProfileIdentifier = {
  slug: string
  id?: undefined
} | {
  slug?: undefined
  id: string
}

export const PROFILE_SELECT = `
  *,
  strava_profiles(
    athlete_profile,
    sync_status,
    last_synced_at
  ),
  times(*)
`

const useProfileQuery = ({slug, id}: ProfileIdentifier) => {
  const supabase = createClient()

  const profileQuery = useQuery({
    queryFn: async () => {
      const q = supabase.from('profiles')
        .select(PROFILE_SELECT)

      if(slug) {
        q.eq('slug', slug)
      }

      if(id) {
        q.eq('id', id)
      }

      return await q.single()
    },
    queryKey: ['profiles', slug || id]
  })

  return profileQuery
}

export default useProfileQuery;
