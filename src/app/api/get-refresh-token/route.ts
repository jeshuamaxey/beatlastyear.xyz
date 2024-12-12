// api/get-refresh-token.ts
import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    const host = req.headers.get('host')
    const clientId = process.env.STRAVA_CLIENT_ID;
    const redirectUri = `https://${host}/api/get-refresh-token`;
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all`;
    return redirect(authUrl);
  }

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

    const data = await tokenResponse.json();
    return NextResponse.json({ refresh_token: data.refresh_token }, {
      status: 200
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get refresh token' }, {
      status: 500
    })
  }
}