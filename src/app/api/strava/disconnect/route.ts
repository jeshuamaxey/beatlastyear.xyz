// api/strave/callback
import createAPIClient from '@/lib/api';
import { StravaAPI } from '@/lib/strava';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient()
  const API = await createAPIClient(supabase)

  
  const refreshToken = await API.getStravaRefreshToken()
  const accessToken = await StravaAPI.getAuthToken(refreshToken)

  try {
    await fetch(`https://www.strava.com/oauth/deauthorize?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const { data : {user}, error: userError} = await supabase.auth.getUser()
    
    if(userError) {
      console.error(userError.message)
      throw new Error(userError.message)
    }

    const { error } = await supabase.from('strava_profiles')
      .delete()
      .eq('profile_id', user!.id)

    if(error) {
      console.error(error)
      throw new Error(error.message)
    }    
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to deauthorise app' }, {
      status: 500
    })
  }
  
  // const host = req.headers.get('host')
  // const protocol = host?.includes('localhost:') ? 'http' : 'https';
  // const redirectUri = `${protocol}://${host}/times`;
  // return redirect(redirectUri)

  return NextResponse.json({ message: 'Deauthorisation successful' }, {
    status: 200
  })
}