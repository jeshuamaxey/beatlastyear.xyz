import { Database } from "@/utils/supabase/autogen.types";
import { inngest } from "../client";
import { StravaAPI } from "@/lib/strava";
import { createAdminClient } from "../utils/supabase";

const functionId = "sync-strava-data"

export const syncStravaData = inngest.createFunction(
  { id:  functionId },
  { event: "strava/sync" },
  async ({ event, step }) => {
    const userId = event.data.userId

    if(!userId) {
      throw new Error("Function requires userId to run")
    }

    // create supabase client
    const supabase = await createAdminClient()
    
    // get data from strava
    const fastest5Ks = await step.run("fetch-strava-activity-data", async () => {
      const { data, error } = await supabase.from('strava_profiles')
        .select('refresh_token')
        .eq('profile_id', userId)
        .single()

      if(error || !data.refresh_token) {
        const msg = `No refresh token was found for user ${userId}`
        console.error(msg)
        if(error) console.error(error.message)
        throw new Error(error?.message || msg)
      }
      const refreshToken = data.refresh_token

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

      await supabase.from('strava_profiles')
        .update({
          sync_status: "IDLE",
          last_synced_at: new Date().toISOString()
        })
        .eq('profile_id', userId)
    })

    return { fastest5Ks };
  },
);

export const cleanupFailedSyncStravaData = inngest.createFunction(
  { id: `${functionId}-failed` },
  {
    event: "inngest/function.failed",
    // The function ID is a hyphenated slug of the App ID w/ the functions' id
    if: `event.data.function_id == '${process.env.INNGEST_APP_ID}-${functionId}'`
  },
  async ({ event, step, logger }) => {
    await step.run("reset-strava-profile-sync-status", async () => {
      const originalTriggeringEvent = event.data.event;
      logger.info(`Sync was failed: ${originalTriggeringEvent.data.importId}`)

      const supabase = await createAdminClient()
      await supabase.from('strava_profiles')
      .update({
        sync_status: "IDLE"
      })
      .eq('profile_id', originalTriggeringEvent.data.userId)
    })
  }
);
