import SiteNav from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LineLinearGradientChart } from "@/components/charts/line-linear-gradient";
import { Card } from "@/components/ui/card";
import { Database } from "@/utils/supabase/database.types";
import { BarLinearGradientChart } from "@/components/charts/bar-linear-gradient";

const SignUpButton = () => (
  <Button size="lg" asChild>
    <Link href="/sign-up">
      Sign up now
    </Link>
  </Button>
)

const finalYear = 2024
const finalTime = 1635.88
const improvementFactorYoY = 0.1

const times: Database["public"]["Tables"]["times"]["Row"][] = [2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => {
  const diff = finalYear - year
  const time = Math.round(finalTime/Math.pow((1 - improvementFactorYoY), diff))

  return {
    data_source: "strava",
    date: `01-01-${year}`,
    distance: "5km",
    id: 1,
    profile_id: "abc",
    sport: "running",
    strava_activity_id: "123",
    time: time,
    year: year
  }
})

export default async function Index() {
  return (
    <div className="flex flex-col">
      <section className={`
        h-svh max-h-svh w-full
        bg-gradient-to-b from-background from-15% to-amber-100
        dark:bg-gradient-to-b dark:from-background dark:to-yellow-950
        flex flex-col items-center
        `}>
        <SiteNav />

        <div className="w-full max-w-5xl flex flex-col flex-1 py-8 md:py-24 px-4">
          <div className="flex-1 flex flex-col gap-6 md:gap-12">
            <h1 className="font-display text-2xl mb-4 md:text-6xl">BEAT LAST YEAR</h1>
            <h2 className="font-display text-2xl mb-2 md:text-4xl">
              Celebrate Your Progress<br/>
              Share Your Pride
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <SignUpButton />
              </div>
              <p className="text-sm italic">It's free!</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 my-6">
          <Card className="w-full max-w-2xl bg-background/60">
            <BarLinearGradientChart
              title="Best 5k times"
              description="Jame's 5k PBs from 2014 to 2024"
              chartData={times}
              />
          </Card>
          </div>
        </div>

      </section>

      <section className={`
          h-svh max-h-svh w-full
          bg-gradient-to-b from-amber-100 to-amber-200
          dark:bg-gradient-to-b dark:from-yellow-950 dark:to-background
          flex flex-col p-2 items-center justify-around
        `}>
        <div className="flex flex-col gap-4 w-full max-w-5xl">
          <h2 className="font-display text-2xl mb-4 md:text-6xl p-2 leading-6">
            Celebrate personal best progression
          </h2>
          
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 -skew-y-[4deg] h-44 flex flex-col rounded-lg justify-around p-4">
            <div className="skew-y-[0deg]">
              <h3 className="font-display">Focused on Growth</h3>
              <p>Running is a journey. Beat Last Year celebrates your long-term progress, not just your latest race.</p>
            </div>
          </div>
          <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 -skew-y-[4deg] h-44 flex flex-col rounded-lg justify-around p-4">
            <div className="skew-y-[0deg]">
              <h3 className="font-display">Effortless integration</h3>
              <p>Connect with Strava or input your personal bests manually.</p>
            </div>
          </div>
          <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 -skew-y-[4deg] h-44 flex flex-col rounded-lg justify-around p-4">
            <div className="skew-y-[0deg]">
              <h3 className="font-display">Show Off With Style</h3>
              <p>Generate stunning graphics that motivate you—and inspire your friends.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`
          h-svh max-h-svh w-full
          bg-gradient-to-b from-amber-200 to-amber-100
          dark:bg-gradient-to-b dark:from-background dark:to-yellow-950
          flex flex-col p-2 items-center justify-around
        `}>
        <div className="h-full flex flex-col gap-4 w-full max-w-5xl">
          <h2 className="font-display text-2xl  my-4 md:text-6xl p-2">
            How it works
          </h2>

          <div className="flex-1 flex flex-col md:flex-row items-center text-center">
            <div className="p-10 flex flex-col justify-center gap-2 rounded-lg bg-white text-slate-950 -ml-24 md:ml-0 w-2/3 md:rounded-full md:w-1/4 md:aspect-square">
              <h3 className="text-xl font-bold">Sign up</h3>
              <p>Create an account in seconds</p>
            </div>

            <div className="flex-1 w-1 md:w-auto md:h-1 bg-white"></div>
            
            <div className="p-10 flex flex-col justify-center gap-2 rounded-lg bg-white text-slate-950 ml-0 md:ml-0 w-2/3 md:rounded-full md:w-1/4 md:aspect-square">
              <h3 className="text-xl font-bold">Add your data</h3>
              <p>Sync with Strava or manually input your PBs</p>
            </div>

            <div className="flex-1 w-1 md:w-auto md:h-1 bg-white"></div>
            
            <div className="p-10 flex flex-col justify-center gap-2 rounded-lg bg-white text-slate-950 ml-24 md:ml-0 w-2/3 md:rounded-full md:w-1/4 md:aspect-square">
              <h3 className="text-xl font-bold">Celebrate</h3>
              <p>Post graphics to Instagram, Facebook, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`
        h-svh max-h-svh w-full
        bg-gradient-to-b from-amber-100 to-background
        dark:bg-gradient-to-b dark:from-yellow-950 dark:to-background
        flex flex-col py-12 px-2 items-center justify-around
        `}>
        <div className="h-full flex flex-col justify-center gap-4 w-full max-w-5xl">
          <div className="relative md:flex">
            <Image className="rounded-md md:w-1/2" src="/jm-ironman-finish-crop.jpg" alt="James McAulay crossing the finish line at an ironman event" width={1392} height={1392} />

            <div className="absolute md:static bottom-0 w-full md:w-1/2 flex flex-col gap-2 justify-center py-4 px-2 md:px-6 bg-gradient-to-t from-slate-950 md:bg-none">
              <blockquote className="italic md:text-xl">
                "Having a place I can track my long term progress and PB improvement has motivated me to improve in so many dimensions"
              </blockquote>
              <p>James McAulay</p>
              <div className="hidden md:block mt-4">
                <SignUpButton />
              </div>
            </div>
          </div>
          <div className="flex md:hidden w-full justify-center">
            <SignUpButton />
          </div>
        </div>
      </section>

      <footer className="h-16 w-full bg-background flex flex-col p-12 items-center">
        <div className="h-full flex flex-col justify-end gap-4 w-full max-w-5xl text-foreground text-center">
          <p>&copy; Beat Last Year {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
