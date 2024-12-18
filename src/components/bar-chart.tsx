"use client"

import React from 'react';

import { Card } from "./ui/card";
import useTimesQuery from "@/hooks/useTimesQuery";
import useMyProfileQuery from '@/hooks/useMyProfileQuery';
import { BarLinearGradientChart } from './charts/bar-linear-gradient';

const BarChart = () => {
  const timesQuery = useTimesQuery()
  const profileQuery = useMyProfileQuery()

  const isLoading = profileQuery.isLoading || timesQuery.isLoading
  const isError = profileQuery.isError || timesQuery.isError

  if(isLoading) {
    return <p>Loading</p>
  }
  if(isError) {
    return <p>Something went wrong</p>
  }

  const times = timesQuery.data!.data!
  const profile = profileQuery.data!.data!

  console.log({profile})

  const yearMin = times[0].year
  const yearMax = times[times.length-1].year

  const name = profile.name ? `${profile.name}'s` : "Your"
  const description = `${name} 5k PBs from ${yearMin} to ${yearMax}`

  return <div>
    <Card className="w-full max-w-2xl">
      <BarLinearGradientChart
        title="Best 5k times"
        description={description}
        chartData={times}
        />
    </Card>
  </div>
}

export default BarChart
