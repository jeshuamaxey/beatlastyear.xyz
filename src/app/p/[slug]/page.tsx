import AreaChart from "@/components/area-chart";
import BarChart from "@/components/bar-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import { TabsContent } from "@radix-ui/react-tabs";
import { notFound } from "next/navigation";

export default async function ProtectedPage({params}: {params: {slug: string}}) {
  const supabase = await createClient();

  const {data: profile, error: profileError} = await supabase.from('profiles').select('*').eq('slug', params.slug).single()

  if(profileError) {
    return notFound()
  }

  const {data: times, error: timesError} = await supabase.from('times').select('*').eq('profile_id', profile.id)

  if(timesError || times.length === 0) {
    return <p className="text-center text-lg">This profile has no times yet</p>
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="areachart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="areachart">Line chart</TabsTrigger>
          <TabsTrigger value="barchart">Bar chart</TabsTrigger>
        </TabsList>
        <TabsContent value="areachart">
          <AreaChart times={times} profile={profile} />
        </TabsContent>
        <TabsContent value="barchart">
          <BarChart times={times} profile={profile}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
