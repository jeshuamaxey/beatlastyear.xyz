// api/sync-strava.ts
import { StravaAPI } from "@/lib/strava";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/autogen.types";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {  
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, {
      status: 405
    })
  }

  const supabase = await createClient()

  try {
    console.warn("Hardcoded refresh token used here")
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN;
    if (!refreshToken) {
      throw new Error("Strava refresh token not configured");
    }

    const { data, error: userError } = await supabase.auth.getUser()

    if(userError) {
      console.error(userError)
      throw new Error(userError.message)
    }

    const user = data.user!

    // Get fresh access token
    const accessToken = await StravaAPI.getAuthToken(refreshToken);

    // Fetch activities
    const activities = await StravaAPI.fetchAllActivities(accessToken);

    // Analyze fastest 5Ks
    const fastest5Ks = StravaAPI.analyzeFastest5KPerYear(activities);

    // Store in Supabase
    const timesToInsert: Database["public"]["Tables"]["times"]["Insert"][] = fastest5Ks.map((run) => ({
      profile_id: user.id,
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
      { onConflict: "profile_id, year, distance, sport" },
    );

    if (error) throw error;

    return NextResponse.json({ message: "Sync completed" }, {
      status: 200
    })

  } catch (error) {
    console.error("Sync failed:", error);

    return NextResponse.json({ message: "Sync failed", error: String(error) }, {
      status: 500
    })
  }
}
