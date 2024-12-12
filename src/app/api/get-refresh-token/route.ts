// api/get-refresh-token.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code) {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const redirectUri = `https://${req.headers.host}/api/get-refresh-token`;
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all`;
    res.redirect(authUrl);
    return;
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
    res.status(200).json({ refresh_token: data.refresh_token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get refresh token' });
  }
}