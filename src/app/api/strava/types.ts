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
