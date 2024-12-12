import SyncWithStravaButton from "@/components/sync-with-strava-button";
import TimesTable from "@/components/times-tables";
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
    <div className="w-full max-w-5xl flex-1 flex flex-col gap-12">

      <SyncWithStravaButton />

      <TimesTable />

    </div>
  );
}
