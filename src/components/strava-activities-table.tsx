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
import { createClient } from '@/utils/supabase/client';
import { StravaActivitySummary } from '@/app/api/strava/types';
import { useState } from 'react';
import Link from 'next/link';

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

