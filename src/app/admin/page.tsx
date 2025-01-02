import ReprocessStravaDataButton from "@/components/reprocess-strava-data-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PROFILE_SELECT } from "@/hooks/use-profile-query"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

const AdminPage = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select(PROFILE_SELECT)

  return <div className="flex flex-col">
    <h1 className="text-2xl font-bold">Admin Page</h1>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Sync status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.id}</TableCell>
            <TableCell>{profile.name}</TableCell>
            <TableCell><Link className="hover:underline" href={`/p/${profile.slug}`}>{profile.slug}</Link></TableCell>
            <TableCell>{profile.strava_profiles?.sync_status}</TableCell>
            <TableCell>
              <ReprocessStravaDataButton profileId={profile.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
}

export default AdminPage
