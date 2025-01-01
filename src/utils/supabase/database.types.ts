import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from './autogen.types'
import { StravaActivitySummary, StravaAthleteProfile } from '@/app/api/strava/types'
export type { Json } from './autogen.types'

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        strava_activities: {
          Row: {
            activity_summary_json: StravaActivitySummary
          },
          Insert: {
            activity_summary_json: StravaActivitySummary
          },
          Update: {
            activity_summary_json: StravaActivitySummary
          }
        },
        strava_profiles: {
          Row: {
            athlete_profile: StravaAthleteProfile
          },
          Insert: {
            athlete_profile: StravaAthleteProfile
          },
          Update: {
            athlete_profile: StravaAthleteProfile
          }
        }
      }
    }
  }
>