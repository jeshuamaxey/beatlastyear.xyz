"use client"

import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

import React from 'react';

import { LineLinearGradientChart } from "./charts/line-linear-gradient";
import { Card } from "./ui/card";
import RunningTimesChart from "./charts/running-times-chart";

const TimesTable = () => {
  const supabase = createClient()

  const timesQuery = useQuery({
    queryFn: async () => await supabase.from('times').select(`*`).order('year', { ascending: true }),
    queryKey: ['times']
  })

  if(timesQuery.isLoading) {
    return <p>Loading</p>
  }
  if(timesQuery.isError) {
    return <p>Something went wrong</p>
  }

  const times = timesQuery.data!.data!

  return <div>
    <h3>times</h3>

    {/* <pre>{JSON.stringify(times, null, 2)}</pre> */}

    {times.map(({id, year, time, data_source}) => {
      const ss = time % 60
      const mm = (time - ss)/60

      return <p key={id}>
        {year}: {mm}:{ss} seconds ({data_source})
      </p>
    })}

    {/* <RunningTimesChart data={times} /> */}

    <Card className="w-full max-w-2xl">
      <LineLinearGradientChart
        title="Best 5k times"
        description="Showing total visitors for the last 6 months"
        chartData={times}
        />
    </Card>
    
  </div>
}

export default TimesTable
