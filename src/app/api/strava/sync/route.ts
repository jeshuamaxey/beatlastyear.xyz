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

  try {
    const { data, error: userError } = await supabase.auth.getUser()

    if(userError) {
      console.error(userError)
      throw new Error(userError.message)
    }

    const user = data.user!
    await supabase.from('strava_profiles')
      .update({sync_status: "SYNCING"})
      .eq('profile_id', data.user.id)

    const { ids } = await inngest.send({
      name: "strava/sync",
      eventKey: process.env.INNGEST_EVENT_KEY,
      data: {
        userId: user.id
      },
    });

    return NextResponse.json({
      message: "Sync started",
      eventIds: ids
    }, {
      status: 200
    })

  } catch (error) {
    console.error("Sync failed to start:", error);

    return NextResponse.json({ message: "Sync failed to start", error: String(error) }, {
      status: 500
    })
  }
}
