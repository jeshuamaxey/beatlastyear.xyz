"use client"

import React, { ChangeEvent, SyntheticEvent, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from "./ui/card";
import { Database } from '@/utils/supabase/autogen.types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import useTimeUpsert from '@/hooks/useTimeUpsert';
import TimeInput from './time-input';
import Link from 'next/link';
import useTimesQuery from '@/hooks/useTimesQuery';

const TimeRow = ({time}: { time: Database["public"]["Tables"]["times"]["Row"]}) => {
  const [newYear, setNewYear] = useState<number>(time.year)
  const [newTimeSeconds, setNewTimeSeconds] = useState<number>(time.time)

  const timeUpsert = useTimeUpsert({})
  
  const updateYear = (ev: ChangeEvent) => {
    const year = Number((ev.target as HTMLInputElement).value)
    const update = {
      year: year,
      time: newTimeSeconds
    }
    setNewYear(year)

    console.log(update)

    timeUpsert.mutate([update])
  }
  
  const updateTime = (timeSeconds: number) => {
    const update = {
      year: newYear,
      time: timeSeconds
    }
    setNewTimeSeconds(timeSeconds)
    
    console.log(update)
    timeUpsert.mutate([update])
  }


  return <form className="flex gap-2">
    <Input onChange={updateYear} name="year" type="number" defaultValue={time.year} />
    <TimeInput onChange={updateTime} defaultValue={time.time} />
  </form>
}

const TimesEditor = () => {
  const timeInputRef = useRef<HTMLInputElement | null>(null)
  const [newTimeSeconds, setNewTimeSeconds] = useState<number>(0)

  const timesQuery = useTimesQuery()

  const timeUpsert = useTimeUpsert({
    onSuccess: () => {
      if(timeInputRef.current) {
        timeInputRef.current.value = ''
        timeInputRef.current.focus()
      }
    }
  })

  
  
  if(timesQuery.isLoading) {
    return <p>Loading</p>
  }
  if(timesQuery.isError) {
    return <p>Something went wrong</p>
  }
  
  const times = timesQuery.data!.data!
  
  const thisYear = new Date().getFullYear()
  const mostRecentYear = Math.max(...times.map(t => t.year), thisYear)
  const defaultYear = Math.min(mostRecentYear + 1, thisYear)

  // console.log({defaultYear, thisYear, mostRecentYear, times})

  const handleNewTime = (ev: SyntheticEvent) => {
    ev.preventDefault()

    const data = new FormData(ev.target as HTMLFormElement)

    const newTime = {
      year: Number(data.get('year')),
      time: newTimeSeconds
    }

    console.log(newTime)

    timeUpsert.mutate([newTime])
  }

  return <div>
    {/* <CardHeader> */}
      <h3 className="font-bold text-xl">Edit my times</h3>
    {/* </CardHeader> */}
    {/* <CardContent> */}

    {/* <pre>{JSON.stringify(times, null, 2)}</pre> */}
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex gap-2">
        <p>Year</p>
        <p>Time</p>
      </div>
      {times.map((time) => <TimeRow key={time.id} time={time} /> )}
    </div>

    <form className={`flex flex-col gap-2 ${timeUpsert.isPending ? "opacity-50" : null}`} onSubmit={handleNewTime}>

      <div className="flex gap-2">
        <Input required placeholder="year" name="year" type="number" defaultValue={defaultYear} />
        {/* <Input ref={timeInputRef} required placeholder="time" name="time" type="number" /> */}
        <TimeInput onChange={setNewTimeSeconds} name="time" />
      </div>
      <Button type="submit" disabled={timeUpsert.isPending}>
        {timeUpsert.isPending ? "Adding..." : "Add"}
      </Button>

    </form>

    <Link href="/protected">see chart</Link>
    
    {/* </CardContent> */}
  </div>
}

export default TimesEditor
