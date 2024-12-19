"use client"

import useStravaActivitiesQuery from '@/hooks/use-strava-activities';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from '@/utils/supabase/client';
import { StravaActivitySummary } from '@/app/api/strava/types';
import { Database } from '@/utils/supabase/database.types';
import { useState } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';

// type JsonDataDialogProps = {
//   open: boolean
//   allData: Database["public"]["Tables"]["strava_activities"]["Row"]
// }

// const JsonDataDialog = ({allData, open}: JsonDataDialogProps) => {
//   return <Dialog open={open}>
//     <DialogTrigger>view JSON</DialogTrigger>
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>The kitchen sink</DialogTitle>
//         <DialogDescription className="overflow-hidden">
//           <ScrollArea className="h-96">
//             <pre>{JSON.stringify(allData, null, 2)}</pre>
//           </ScrollArea>
//         </DialogDescription>
//       </DialogHeader>
//     </DialogContent>
//   </Dialog>
// }

const StravaActivitiesTable = () => {
  const [openRowId, setOpenRowId] = useState<number | null>(null)
  const supabase = createClient()

  const { data, isLoading, isError } = useStravaActivitiesQuery(supabase);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong</div>;

  const activities = data!

  const fields = [
    "name",
    "start_date",
    "distance",
    "moving_time",
    "elapsed_time",
    "total_elevation_gain",
    "type",
    "sport_type",
    "location_city",
    "average_speed",
    "max_speed",
  ] as (keyof StravaActivitySummary)[]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          {fields.map(fieldName => (
            <TableCell key={fieldName}>{fieldName}</TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => {
          return (
            <TableRow key={activity.id} onClick={() => setOpenRowId(activity.id)}>
              <TableCell>{activity.id}</TableCell>
              {fields.map(fieldName => (
                // @ts-expect-error: couldn't get the types to sing here. In a hurry
                <TableCell key={fieldName}>{activity.activity_summary_json[fieldName]}</TableCell>
              ))}
              <TableCell>
                <Link href={`/times/strava-data/${activity.id}`}>Raw JSON</Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
};

export default StravaActivitiesTable;

