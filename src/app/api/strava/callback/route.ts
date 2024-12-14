// api/strave/callback
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";

type StravaRefreshTokenResponse = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    bio: string;
    city: string | null;
    state: string | null;
    country: string | null;
    sex: string;
    premium: boolean;
    summit: boolean;
    created_at: string;
    updated_at: string;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    // friend: null;
    // follower: null;
  };
}

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  try {
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const stravaRes = await tokenResponse.json() as StravaRefreshTokenResponse;
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if(userError) {
      console.error(userError.message)
      throw new Error(userError.message)
    }

    const { data, error } = await supabase.from('strava_profiles').upsert({
      profile_id: user!.id,
      refresh_token: stravaRes.refresh_token,
      athlete_profile: stravaRes.athlete
    })

    if(error) {
      console.error(error)
      throw new Error(error.message)
    }    
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