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

  return <div className="w-full px-4 flex gap-4">
  <div className="w-1/3">
    <Image src={stravaProfile.profile} alt={stravaProfile.firstname} width={124} height={124} />
  </div>
  <div className="w-2/3 flex flex-col gap-2">
    <h1 className="text-2xl font-bold">{stravaProfile.firstname} {stravaProfile.lastname}</h1>
    <p className="text-sm text-gray-500">{stravaProfile.city}, {stravaProfile.state}, {stravaProfile.country}</p>
    {/* {stravaProfile.clubs.length > 0 && <p className="text-sm text-gray-500">{stravaProfile.clubs[0].name}</p>} */}
  </div>
</div>
}

export default ProfileHeader
