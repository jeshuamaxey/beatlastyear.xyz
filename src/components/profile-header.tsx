"use client"

import Image from "next/image"
import useProfileQuery from "@/hooks/use-profile-query"

type ProfileHeaderProps = {
  slug: string
}

const ProfileHeader = ({ slug }: ProfileHeaderProps) => {
  const profileQuery = useProfileQuery({slug})

  if(profileQuery.isLoading) {
    return <p className="text-center text-lg">Loading...</p>
  }

  if(profileQuery.isError) {
    return <p className="text-center text-lg">Error loading profile</p>
  }

  const profile = profileQuery.data!.data!

  const stravaProfile = profile.strava_profiles?.athlete_profile

  console.log({ stravaProfile})

  if(!stravaProfile) {
    return <p className="text-center text-lg">No Strava profile found</p>
  }

  // TODO: move this into a util that pulls this from strava when first connected
  let location = ''
  if(stravaProfile.city && stravaProfile.state && stravaProfile.country) {
    location = `${stravaProfile.city}, ${stravaProfile.state}, ${stravaProfile.country}`
  } else if(stravaProfile.city && stravaProfile.state) {
    location = `${stravaProfile.city}, ${stravaProfile.state}`
  } else if(stravaProfile.city) {
    location = stravaProfile.city
  } else if(stravaProfile.state) {
    location = stravaProfile.state
  } else if(stravaProfile.country) {
    location = stravaProfile.country
  }

  return <div className="w-full px-4 flex gap-4">
    <div className="w-1/3">
      <Image className="rounded-lg overflow-hidden" src={stravaProfile.profile} alt={stravaProfile.firstname} width={124} height={124} />
    </div>

    <div className="w-2/3 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{stravaProfile.firstname} {stravaProfile.lastname}</h1>
      {location && <p className="text-sm text-gray-500">{location}</p>}
      {/* {stravaProfile.clubs.length > 0 ? <p className="text-sm text-gray-500">{stravaProfile.clubs[0].name}</p> : <p className="text-sm text-gray-500">No club affiliation</p>} */}
    </div>
  </div>
}

export default ProfileHeader
