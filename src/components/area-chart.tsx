"use client"

import React from 'react';

import { LineLinearGradientChart } from "./charts/line-linear-gradient";
import { Card } from "./ui/card";
import { Database } from '@/utils/supabase/database.types';

type AreaChartProps = {
  times: Database['public']['Tables']['times']['Row'][]
  profile: Database['public']['Tables']['profiles']['Row']
}

const AreaChart = ({ times, profile }: AreaChartProps) => {
  const distance = times[0].distance
  const yearMin = times[0].year
  const yearMax = times[times.length-1].year

  const name = profile.name ? `${profile.name}'s` : "Your"
  const title = `Best ${distance} times`
  const description = `${name} ${distance} PBs from ${yearMin} to ${yearMax}`

  return <div>
    <Card className="w-full max-w-2xl">
      <LineLinearGradientChart
        title={title}
        description={description}
        chartData={times}
        />
    </Card>
  </div>
}

export default AreaChart
