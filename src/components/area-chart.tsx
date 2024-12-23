"use client"

import React from 'react';

import { LineLinearGradientChart } from "./charts/line-linear-gradient";
import { Card } from "./ui/card";
// import useTimesQuery from "@/hooks/useTimesQuery";
// import useMyProfileQuery from '@/hooks/useMyProfileQuery';
import { Database } from '@/utils/supabase/database.types';

type AreaChartProps = {
  times: Database['public']['Tables']['times']['Row'][]
  profile: Database['public']['Tables']['profiles']['Row']
}

const AreaChart = ({ times, profile }: AreaChartProps) => {
  const yearMin = times[0].year
  const yearMax = times[times.length-1].year

  const name = profile.name ? `${profile.name}'s` : "Your"
  const description = `${name} 5k PBs from ${yearMin} to ${yearMax}`

  return <div>
    <Card className="w-full max-w-2xl">
      <LineLinearGradientChart
        title="Best 5k times"
        description={description}
        chartData={times}
        />
    </Card>
  </div>
}

export default AreaChart
