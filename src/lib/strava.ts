import { StravaAuthTokenResponseError, StravaAuthTokenResponseSuccess } from "@/app/api/strava/types";

// lib/strava.ts
export class StravaAPI {
  private static AFTER = "2000-01-01"
  private static AUTH_URL = "https://www.strava.com/oauth/token";
  private static ACTIVITIES_URL =
    "https://www.strava.com/api/v3/athlete/activities";

  static async getAuthToken(refreshToken: string): Promise<string> {
    const response = await fetch(StravaAPI.AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const data = await response.json() as StravaAuthTokenResponseError;
      console.error(data.message)
      console.error(data.errors)

      const refreshTokenInvalid = data.errors && data.errors.some(err => err.field === "refresh_token" && err.code === "invalid")

      console.error(`refreshTokenInvalid: ${refreshTokenInvalid}`)

      throw new Error(`Failed to authenticate with Strava. Msg: ${data.message}.`);
    }

    const data = await response.json() as StravaAuthTokenResponseSuccess;
    return data.access_token;
  }

  static async fetchActivities(accessToken: string, page: number): Promise<any[]> {
    const after = new Date(StravaAPI.AFTER).getTime() / 1000; // Unix timestamp for Jan 1, 2022

    console.log(`Fetching page ${page} of activities...`);
    const response = await fetch(
      `${StravaAPI.ACTIVITIES_URL}?page=${page}&per_page=200&after=${after}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const err = await response.json();
      console.error(err)
      throw new Error("Failed to fetch activities");
    }

    const activities = await response.json();

    console.log(`New activities fetched: ${activities.length}`)

    return activities;
  }

  static async fetchAllActivities(accessToken: string): Promise<any[]> {
    let page = 1;
    let allActivities: any[] = [];
    const after = new Date(StravaAPI.AFTER).getTime() / 1000; // Unix timestamp for Jan 1, 2022

    while (true) {
      console.log(`Fetching page ${page} of activities...`);
      const response = await fetch(
        `${StravaAPI.ACTIVITIES_URL}?page=${page}&per_page=200&after=${after}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const err = await response.json();
        console.error(err)
        throw new Error("Failed to fetch activities");
      }

      const activities = await response.json();

      console.log(`New activities fetched: ${activities.length}`)

      if (activities.length === 0) break;

      allActivities = [...allActivities, ...activities];
      page++;
    }

    console.log(`Total activities fetched: ${allActivities.length}`);
    return allActivities;
  }

  static is5KRun(activity: any): boolean {
    return (
      activity.type === "Run" &&
      activity.distance >= 4980 && // 4.98km
      activity.distance <= 5200 // 5.2km
    );
  }

  static analyzeFastest5KPerYear(activities: any[]): any[] {
    console.log("Starting analysis of activities");

    // Filter 5K runs
    const runs5K = activities.filter(this.is5KRun).map((activity) => ({
      date: new Date(activity.start_date_local),
      time: activity.moving_time,
      distance: activity.distance,
      activity_id: activity.id,
      average_speed: activity.average_speed,
    }));

    console.log(`Found ${runs5K.length} 5K runs to analyze`);

    // Group by year and find fastest
    const yearlyBests = new Map();

    runs5K.forEach((run) => {
      const year = run.date.getFullYear();
      const existing = yearlyBests.get(year);

      // Calculate 5K time by scaling the moving time to exactly 5000m
      console.warn("check this logic is sound with james")
      const scaled5KTime = (5000 * run.time) / run.distance;

      if (!existing || scaled5KTime < existing.time) {
        yearlyBests.set(year, {
          year,
          date: run.date.toISOString().split("T")[0],
          time: scaled5KTime,
          pace: scaled5KTime / 5, // pace per km
          activity_id: run.activity_id,
          actual_distance: Math.round(run.distance),
        });
      }
    });

    return Array.from(yearlyBests.values()).sort((a, b) => b.year - a.year);
  }
}
