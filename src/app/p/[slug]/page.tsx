import TimesTable from "@/components/times-tables";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
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
      <div className="flex">
        <Button asChild>
          <Link href="/times">
            Edit my times
          </Link>
        </Button>
      </div>

      <TimesTable />
    </div>
  );
}
