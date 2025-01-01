export type StravaAuthTokenResponseSuccess = {
  message: undefined;
  errors: undefined;

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

export type StravaAuthTokenResponseError = {
  message: string;
  errors: {
    resource: string;
    field: string;
    code: string;
  }[];

  token_type: undefined;
  expires_at: undefined;
  expires_in: undefined;
  refresh_token: undefined;
  access_token: undefined;
  athlete: undefined;
}

export type StravaAuthTokenResponse = StravaAuthTokenResponseSuccess | StravaAuthTokenResponseError


export type StravaActivitySummary = {
  resource_state: number;
  athlete: {
    id: number;
    resource_state: number;
  };
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: number;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  location_city?: null;
  location_state?: null;
  location_country?: null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id?: null;
  start_latlng: [number, number];
  end_latlng: [number, number];
  average_speed: number;
  max_speed: number;
  has_heartrate: boolean;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number;
  elev_low: number;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
}

export type StravaAthleteProfile = {
  id: number;
  resource_state: number;
  username: string;
  firstname: string;
  lastname: string;
  bio: string;
  profile_medium: string;
  profile: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  follower_count: number;
  friend_count: number;
  mutual_friend_count: number;
  athlete_type: number;
  date_preference: string;
  measurement_preference: 'feet' | 'meters';
  weight: number;
  clubs: {
    id: number;
    name: string;
    profile: string;
    cover_photo: string;
    cover_photo_small: string;
    sport_type: string;
    member_count: number;
    private: boolean;
    membership: string;
    admin: boolean;
    owner: boolean;
  }[];
}