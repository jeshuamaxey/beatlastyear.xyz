// api/strava/connect
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const host = req.headers.get('host')
  const clientId = process.env.STRAVA_CLIENT_ID;
  const protocol = host?.includes('localhost:') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/strava/callback`;

  const authUrl = `https://www.strava.com/oauth/authorize?` + [
    `client_id=${clientId}`,
    `response_type=code`,
    `redirect_uri=${redirectUri}`,
    `approval_prompt=force`,
    `scope=read,activity:read`
  ].join("&")

  return redirect(authUrl);
}