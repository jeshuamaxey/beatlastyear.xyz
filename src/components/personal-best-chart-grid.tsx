"use client"

import useProfileQuery from "@/hooks/use-profile-query"
import AreaChart from "./area-chart"

type PersonalBestChartGridProps = {
  slug: string
}

const PersonalBestChartGrid = ({ slug }: PersonalBestChartGridProps) => {
  const profileQuery = useProfileQuery({slug})

  if(profileQuery.isLoading) {
    return <p className="text-center text-lg">Loading...</p>
  }

  if(profileQuery.isError) {
    return <p className="text-center text-lg">Error loading profile</p>
  }

  const profile = profileQuery.data!.data!

  const times5km = profile.times.filter(time => time.distance === '5km')
  const times10km = profile.times.filter(time => time.distance === '10km')
  
  return <div className="w-full px-4 flex gap-4">
    {times5km.length > 0 && (
      <div className="w-1/2">
        <AreaChart times={times5km} profile={profile} />
      </div>
    )}
    {times10km.length > 0 && (
      <div className="w-1/2">
        <AreaChart times={times10km} profile={profile} />
      </div>
    )}
  </div>
} 

export default PersonalBestChartGrid