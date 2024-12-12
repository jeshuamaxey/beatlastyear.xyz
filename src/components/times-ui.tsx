"use client"

import { useState } from "react"
import SyncWithStravaButton from "./sync-with-strava-button"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import TimesEditor from "./times-editor"
import useTimeUpsert from "@/hooks/useTimeUpsert"

const TimesUI = () => {
  const router = useRouter()
  const [enterManually, setEnterManually] = useState(false)

  const handleStravaSyncSuccess = () => {
    router.push(`/protected`)
  }

  return <div className="max-w-5xl w-full">
    {!enterManually && <div className="flex flex-col items-center justify-center">
        <SyncWithStravaButton className="max-w-48" onSuccess={handleStravaSyncSuccess} />
        <p className="text-center">or</p>
        <Button className="max-w-48" variant="link" onClick={() => setEnterManually(true)}>Enter times manually</Button>
      </div>
    }

    {enterManually && <TimesEditor />}
  </div>
}

export default TimesUI;
