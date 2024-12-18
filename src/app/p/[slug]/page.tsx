import AreaChart from "@/components/area-chart";
import BarChart from "@/components/bar-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import { TabsContent } from "@radix-ui/react-tabs";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="areachart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="areachart">Line chart</TabsTrigger>
          <TabsTrigger value="barchart">Bar chart</TabsTrigger>
        </TabsList>
        <TabsContent value="areachart">
          <AreaChart />
        </TabsContent>
        <TabsContent value="barchart">
          <BarChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
