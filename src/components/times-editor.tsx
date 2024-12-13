"use client"

import { Database } from '@/utils/supabase/autogen.types';
import { Button } from './ui/button';
import Link from 'next/link';
import useTimesQuery from '@/hooks/useTimesQuery';
import EditTimeDialog from './edit-time-dialog';
import { ArrowRight } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { TableBody, TableCaption, TableHead, TableHeader, TableRow, Table } from './ui/table';
import { TableCell } from './ui/table';
import SyncWithStravaButton from './sync-with-strava-button';
import { useRouter } from 'next/navigation';



const TimeRow = ({time}: { time: Database["public"]["Tables"]["times"]["Row"]}) => {
  return <TableRow>
    <TableCell>{time.year}</TableCell>
    <TableCell>{formatTime(time.time)}</TableCell>
    <TableCell>
      <EditTimeDialog mode="edit" defaults={time} />
    </TableCell>
  </TableRow>
}

const TimesEditor = () => {
  const router = useRouter()
  const timesQuery = useTimesQuery()
  
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

  const handleStravaSyncSuccess = () => {
    router.push(`/p/me`)
  }

  return <div className="flex flex-col gap-4">
    {/* <CardHeader> */}
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-xl pl-2">My times</h3>
      <SyncWithStravaButton onSuccess={handleStravaSyncSuccess} className="mb-0" />
    </div>
    {/* </CardHeader> */}
    {/* <CardContent> */}

    {/* <pre>{JSON.stringify(times, null, 2)}</pre> */}

    {times.length > 0 ? (
      <div className="flex flex-col gap-2 mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead>Time</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {times.map((time) => <TimeRow key={time.id} time={time} /> )}
          </TableBody>
        </Table>
      </div>
    ) : (
      <div className="flex flex-col gap-2 mb-2">
        <p className="text-sm">no times set</p>
      </div>
    )}

    <div className="flex gap-2">
      <EditTimeDialog mode="create" defaults={{year: defaultYear}} />

      <Button asChild>
          <Link href={`/p/me`}>see chart <ArrowRight /></Link>
      </Button>
    </div>
    
    {/* </CardContent> */}
  </div>
}

export default TimesEditor
