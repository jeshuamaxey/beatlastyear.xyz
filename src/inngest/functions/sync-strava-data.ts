import { ActivitiesInsert } from "@/utils/supabase/database.types";
import { inngest } from "../client";
import { StravaAPI } from "@/lib/strava";
import { createAdminClient } from "../utils/supabase";

const functionId = "sync-strava-data"

export const syncStravaData = inngest.createFunction(
  { id:  functionId },
  { event: "strava/sync" },
  async ({ event, logger, step }) => {
    const userId = event.data.userId

    if(!userId) {
      throw new Error("Function requires userId to run")
    }

    // create supabase client
    const supabase = await createAdminClient()

    const accessToken = await step.run("get-strava-access-token", async () => {
      const { data, error } = await supabase.from('strava_refresh_tokens')
        .select('refresh_token')
        .eq('profile_id', userId)
        .single()

      if(error || !data.refresh_token) {
        const msg = `No refresh token was found for user ${userId}`
        console.error(msg)
        if(error) console.error(error.message)
        throw new Error(error?.message || msg)
      }

      const accessToken = await StravaAPI.getAuthToken(data.refresh_token);

      return accessToken
    })
    
    // get data from strava
    const allActivities: any[] = []
    let page = 1
    let moreAvailable = true

    logger.info(`strava activity loop starts. page = ${page}`)

    while(moreAvailable) {
      const activities = await step.run(`fetch-strava-activity-page-${page}`, async () => {
        // Fetch activities
        return await StravaAPI.fetchActivities(accessToken, page);
      })

      if(activities.length > 0) {
        allActivities.push(...activities)
        page++;
        logger.info(`strava activity loop continues. page = ${page}`)
      } else {
        moreAvailable = false
        logger.info(`strava activity loop ends. page = ${page}`)
      }
    }

    await step.run("store-strava-activities-in-supabase", async () => {
      const activitiesToInsert : ActivitiesInsert[] = allActivities.map((act) => ({
        profile_id: userId,
        id: act.id,
        activity_summary_json: act
      }))
  
      const { error } = await supabase.from("strava_activities").upsert(
        activitiesToInsert
      );
  
      if (error) throw error;
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

      const activitySummaries = data.map(a => a.activity_summary_json)

      const times = StravaAPI.getTimesFromActivitySummaries(activitySummaries, userId)
  
      const { error } = await supabase.from("times").upsert(
        times,
        {
          onConflict: "profile_id, year, distance, sport",
          ignoreDuplicates: false
        },
      );
  
      if (error) throw error;

      return {
        times: times.length,
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
