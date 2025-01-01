import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { PROFILE_SELECT } from "./use-profile-query"

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
        .select(PROFILE_SELECT)
        .eq('id', user!.id)
        .single()
    },
    queryKey: ['profiles', 'me']
  })

  return myProfileQuery
}

export default useMyProfileQuery;
