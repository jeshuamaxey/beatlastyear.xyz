import { Database } from "@/utils/supabase/autogen.types";
import { inngest } from "../client";
import { StravaAPI } from "@/lib/strava";
import { createAdminClient } from "../utils/supabase";

export const syncStravaData = inngest.createFunction(
  { id: "sync-strava-data" },
  { event: "strava/sync" },
  async ({ event, step }) => {

    const userId = event.data.userId
    const refreshToken = event.data.refreshToken

    if(!userId || !refreshToken) {
      throw new Error("Function requires userId and a strava refresh token to run")
    }

    // create supabase client
    const supabase = await createAdminClient()

    // get data from strava
    const fastest5Ks = await step.run("fetch-strava-activity-data", async () => {
      const accessToken = await StravaAPI.getAuthToken(refreshToken);
      // Fetch activities
      const activities = await StravaAPI.fetchAllActivities(accessToken);
      // Analyze fastest 5Ks
      const fastest5Ks = StravaAPI.analyzeFastest5KPerYear(activities);

      return fastest5Ks
    })

    // process and upload to supabase
    await step.run("store-strava-times-in-supabase", async () => {
      const timesToInsert: Database["public"]["Tables"]["times"]["Insert"][] = fastest5Ks.map((run) => ({
        profile_id: userId,
        year: run.year,
        time: run.time,
        distance: "5km",
        sport: "running",
        date: run.date,
        strava_activity_id: run.activity_id,
        data_source: "strava"
      }))
  
      const { error } = await supabase.from("times").upsert(
        timesToInsert,
        {
          onConflict: "profile_id, year, distance, sport",
          ignoreDuplicates: false
        },
      );
  
      if (error) throw error;
    })

    return { fastest5Ks };
  },
);