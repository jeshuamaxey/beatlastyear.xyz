import { Database } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

type StravaProfile = Database["public"]["Tables"]["strava_profiles"]["Row"]

type Payload = {
  new: StravaProfile
}

const getStravaProfileUpdatesChannel = (onUpdate: (payload: Payload) => any ) => {
  const channel = supabase
    .channel('strava profiles updates')
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "PUBLIC",
        table: "strava_profiles"
      },
      (payload: Payload) => {
        onUpdate(payload)
      }
    )

  return {
    subscribe: channel.subscribe,
    remove: () => supabase.removeChannel(channel),
  }
}

export default getStravaProfileUpdatesChannel;
