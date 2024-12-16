"use client"

import { Database } from '@/utils/supabase/autogen.types';
import { Button } from './ui/button';
import Link from 'next/link';
import useTimesQuery from '@/hooks/useTimesQuery';
import EditTimeDialog from './edit-time-dialog';
import { ArrowRight } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { TableBody, TableHead, TableHeader, TableRow, Table } from './ui/table';
import { TableCell } from './ui/table';
import SyncWithStravaButton from './sync-with-strava-button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

type TimeInsert = Database["public"]["Tables"]["times"]["Insert"]

const TimeRow = ({time}: { time: Database["public"]["Tables"]["times"]["Row"]}) => {
  return <TableRow>
    <TableCell>{time.year}</TableCell>
    <TableCell className="font-mono">{formatTime(time.time)}</TableCell>
    <TableCell><Badge className={`capitalize ${time.data_source === "strava" ? "bg-orange-600" : ""}`}>{time.data_source}</Badge></TableCell>
    <TableCell>
      {time.data_source === "manual" &&  <EditTimeDialog mode="edit" defaults={time} />}
    </TableCell>
  </TableRow>
}

const TimesEditor = () => {
  const { toast } = useToast()
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

  const handleStravaSyncStart = () => {
    toast({
      title: "Syncing",
      description: `We are retrieving your Strava activity`
    })
  }

  const handleStravaSyncSuccess = () => {
    toast({
      title: "Sync complete",
      description: `Your times have been updated with data from Strava`
    })
  }

  const handleStravaDisconnectSuccess = () => {
    toast({
      title: "Strava disconnected",
      description: `Your strava account is no longer connected to Beat Last Year.`
    })
  }

  return <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-xl pl-2">My times</h3>
      <SyncWithStravaButton
        onSyncStart={handleStravaSyncStart}
        onSyncSuccess={handleStravaSyncSuccess}
        onDisconnectSuccess={handleStravaDisconnectSuccess} className="mb-0" />
    </div>

    {times.length > 0 ? (
      <div className="flex flex-col gap-2 mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Source</TableHead>
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
