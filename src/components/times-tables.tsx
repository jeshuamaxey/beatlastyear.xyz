"use client"

import React from 'react';

import { LineLinearGradientChart } from "./charts/line-linear-gradient";
import { Card } from "./ui/card";
import useTimesQuery from "@/hooks/useTimesQuery";

const TimesTable = () => {
  const timesQuery = useTimesQuery()

  if(timesQuery.isLoading) {
    return <p>Loading</p>
  }
  if(timesQuery.isError) {
    return <p>Something went wrong</p>
  }

  const times = timesQuery.data!.data!

  return <div>
    {/* {times.map(({id, year, time, data_source}) => {
      const ss = time % 60
      const mm = (time - ss)/60

      return <p key={id}>
        {year}: {mm}:{ss} seconds ({data_source})
      </p>
    })} */}

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
