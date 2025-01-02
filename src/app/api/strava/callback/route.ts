// api/strave/callback
import { createClient } from '@/utils/supabase/server';
import { inngest } from "@/inngest/client";
import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";
import { StravaAthleteProfile, StravaAuthTokenResponseSuccess } from '../types';
import PostHogServerClient from '@/lib/posthog';

export async function GET(req: Request) {
  const posthog = PostHogServerClient()
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const userId = requestUrl.searchParams.get("state") as string;

  try {
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const stravaRes = await tokenResponse.json() as StravaAuthTokenResponseSuccess;

    if(tokenResponse.ok) {
      posthog.capture({
        distinctId: userId,
        event: 'strava-connect-successful'
      })
    } else {
      posthog.capture({
        distinctId: userId,
        event: 'strava-connect-failed'
      })
      throw new Error(`${tokenResponse.status} :: ${tokenResponse.statusText}`)
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if(userError) {
      console.error(userError.message)
      throw new Error(userError.message)
    }

    const { error } = await supabase.from('strava_profiles').upsert({
      profile_id: user!.id,
      athlete_profile: stravaRes.athlete as StravaAthleteProfile,
      sync_status: "SYNCING"
    })

    if(error) {
      console.error(error)
      throw new Error(error.message)
    }

    const { data: refreshTokenData, error: refreshTokenError } = await supabase.from('strava_refresh_tokens').upsert({
      profile_id: user!.id,
      refresh_token: stravaRes.refresh_token,
    })

    if(refreshTokenError) {
      console.error(refreshTokenError)
      throw new Error(refreshTokenError.message)
    }

    await inngest.send({
      name: "strava/sync",
      eventKey: process.env.INNGEST_EVENT_KEY,
      data: {
        userId: user!.id,
        refreshToken: stravaRes.refresh_token
      },
    });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to get refresh token' }, {
      status: 500
    })
  }
  
  const host = req.headers.get('host')
  const protocol = host?.includes('localhost:') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/times`;
  return redirect(redirectUri)
}