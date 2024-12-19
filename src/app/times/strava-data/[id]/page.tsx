import { createClient } from "@/utils/supabase/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const StravaActivityJsonPage = async ({ params }: { params: { id: number } }) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("strava_activities")
    .select("*")
    .eq("id", params.id)

  return <div className="flex flex-col gap-4">
    <Link className="flex gap-1" href="/times/strava-data">
      <ArrowLeft />
      <span>Back</span>
    </Link>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}

export default StravaActivityJsonPage
