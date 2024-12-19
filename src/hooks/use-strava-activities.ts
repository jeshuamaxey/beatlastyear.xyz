import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const useStravaActivitiesQuery = (supabase: SupabaseClient<Database>) => {
  const query = useQuery({
    queryKey: ["strava_activites"],
    queryFn: async () => {
      const { data : { user }, error: userError } = await supabase.auth.getUser()

      if(userError) {
        throw new Error(userError.message)
      }

      const { data, error } = await supabase
        .from('strava_activities')
        .select('*')
        .eq('profile_id', user!.id);
      
      if (error) throw new Error(error.message);
      return data;
    }
  })

  return query
}

export default useStravaActivitiesQuery
