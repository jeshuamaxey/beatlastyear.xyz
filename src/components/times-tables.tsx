"use client"

import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

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

    {times.map(({id, year, time}) => <p key={id}>
      {year}: {time} seconds
    </p>)}
  </div>
}

export default TimesTable
