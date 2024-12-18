import AreaChart from "@/components/area-chart";
import BarChart from "@/components/bar-chart";
import { createClient } from "@/utils/supabase/server";
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
      <AreaChart />
      <BarChart />
    </div>
  );
}
