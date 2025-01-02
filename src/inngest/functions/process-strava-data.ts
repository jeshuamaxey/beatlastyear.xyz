import { Database } from "@/utils/supabase/database.types";
import { inngest } from "../client";
import { StravaAPI } from "@/lib/strava";
import { createAdminClient } from "../utils/supabase";

const functionId = "process-strava-data"

type TimeInsert = Database["public"]["Tables"]["times"]["Insert"]

export const processStravaData = inngest.createFunction(
  { id:  functionId },
  { event: "strava/process" },
  async ({ event, logger, step }) => {
    const userId = event.data.userId

    if(!userId) {
      throw new Error("Function requires userId to run")
    }

    // create supabase client
    const supabase = await createAdminClient()

    await step.run("set-sync-status", async () => {
      await supabase.from('strava_profiles')
        .update({ sync_status: "SYNCING" })
        .eq('profile_id', userId)
    })

    // process and upload to supabase
    await step.run("store-strava-times-in-supabase", async () => {
      const { data, error: selectErr } = await supabase.from("strava_activities")
        .select("*")
        .eq('profile_id', userId)

      if(selectErr) {
        logger.error(selectErr)
        throw new Error(selectErr.message)
      }

      console.log(`Found ${data.length} activites for user ${userId}`)

      const activities = data.map(a => a.activity_summary_json)

      const fastest5Ks = StravaAPI.analyzeFastest5KPerYear(activities)
      const fastest10Ks = StravaAPI.analyzeFastest10KPerYear(activities)

      const times5K: TimeInsert[] = fastest5Ks.map((run) => ({
        profile_id: userId,
        year: run.year,
        time: run.time,
        distance: "5km",
        sport: "running",
        date: run.date,
        strava_activity_id: run.activity_id,
        data_source: "strava"
      }))

      const times10K: TimeInsert[] = fastest10Ks.map((run) => ({
        profile_id: userId,
        year: run.year,
        time: run.time,
        distance: "10km",
        sport: "running",
        date: run.date,
        strava_activity_id: run.activity_id,
        data_source: "strava"
      }))

      const timesToInsert = [
        ...times5K,
        ...times10K
      ]

      console.log(timesToInsert)
  
      const { error } = await supabase.from("times").upsert(
        timesToInsert,
        {
          onConflict: "profile_id, year, distance, sport",
          ignoreDuplicates: false
        },
      );
  
      if (error) throw error;

      return {
        fastest5Ks: fastest5Ks.length,
        fastest10Ks: fastest10Ks.length,
       };
    })

    await step.run("reset-strava-profile-sync-status", async () => {
      await supabase.from('strava_profiles')
        .update({
          sync_status: "IDLE",
          last_synced_at: new Date().toISOString()
        })
        .eq('profile_id', userId)
    })
  },
);

export const cleanupFailedprocessStravaData = inngest.createFunction(
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
