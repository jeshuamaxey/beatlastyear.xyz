import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const useMyTimesQuery = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if(error) {
    throw new Error(error.message)
  }

  const userId = data.user.id

  const timesQuery = useQuery({
    queryFn: async () => await supabase.from('times')
      .select(`*`)
      .eq('profile_id', userId)
      .order('year', { ascending: true }),
    queryKey: ['times']
  })

  return timesQuery
}

export default useMyTimesQuery;
