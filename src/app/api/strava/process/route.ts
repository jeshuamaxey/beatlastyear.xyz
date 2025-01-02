// api/strava/sync
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(
  req: Request
) {  
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, {
      status: 405
    })
  }

  const supabase = await createClient()

  const body = await req.json()
  const profileId = body.profileId
  
  if(!profileId) {
    return NextResponse.json({ message: "Profile ID is required" }, {
      status: 400
    })
  }

  try {

    await supabase.from('strava_profiles')
      .update({sync_status: "SYNCING"})
      .eq('profile_id', profileId)

    const { ids } = await inngest.send({
      name: "strava/process",
      eventKey: process.env.INNGEST_EVENT_KEY,
      data: {
        userId: profileId
      },
    });

    return NextResponse.json({
      message: "Processing started",
      eventIds: ids
    }, {
      status: 200
    })

  } catch (error) {
    console.error("Proecessing failed to start:", error);

    return NextResponse.json({ message: "Proecessing failed to start", error: String(error) }, {
      status: 500
    })
  }
}
