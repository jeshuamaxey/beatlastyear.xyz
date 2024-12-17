// api/strava/connect
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const host = req.headers.get('host')
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const protocol = host?.includes('localhost:') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/strava/callback`;

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if(!user) {
    return NextResponse.json({
      error: "Cannot connect to strava unless the user is logged in"
    }, {
      status: 401
    })
  }

  const authUrl = `https://www.strava.com/oauth/authorize?` + [
    `client_id=${clientId}`,
    `response_type=code`,
    `redirect_uri=${redirectUri}`,
    `approval_prompt=force`,
    `scope=read,activity:read`,
    `state=${user.id}`,
  ].join("&")

  return redirect(authUrl);
}