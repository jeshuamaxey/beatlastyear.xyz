import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const useMyTimesQuery = () => {
  const supabase = createClient()

  
  
  const timesQuery = useQuery({
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if(error) {
        throw new Error(error.message)
      }

      const userId = data.user.id

      return await supabase.from('times')
      .select(`*`)
      .eq('profile_id', userId)
      .order('year', { ascending: true })
    },
    queryKey: ['times']
  })

  return timesQuery
}

export default useMyTimesQuery;
