import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const useTimesQuery = () => {
  const supabase = createClient()

  const timesQuery = useQuery({
    queryFn: async () => await supabase.from('times').select(`*`).order('year', { ascending: true }),
    queryKey: ['times']
  })

  return timesQuery
}

export default useTimesQuery;
