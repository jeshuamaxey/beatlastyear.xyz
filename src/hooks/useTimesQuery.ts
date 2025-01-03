import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

const useTimesQuery = (profileId: User["id"]) => {
  const supabase = createClient()

  const timesQuery = useQuery({
    queryFn: async () => await supabase.from('times')
      .select(`*`)
      .eq('id', profileId)
      .order('year', { ascending: true }),
    queryKey: ['times']
  })

  return timesQuery
}

export default useTimesQuery;
