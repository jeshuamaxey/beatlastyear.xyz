import { SupabaseClient } from "@supabase/supabase-js"

const createAPIClient = async (supabase: SupabaseClient) => {
  const getStravaRefreshToken = async () => {
    const { data : {user}, error: userError} = await supabase.auth.getUser()
    
    if(userError) {
      console.error(userError.message)
      throw new Error(userError.message)
    }

    const { data, error } = await supabase.from('strava_profiles')
      .select('refresh_token')
      .eq('profile_id', user?.id)
      .single()

    if(error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return data?.refresh_token
  }

  return {
    getStravaRefreshToken
  }
}

export default createAPIClient
