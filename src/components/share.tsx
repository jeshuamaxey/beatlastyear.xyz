"use client"

import ShareButton from "./share-button"
import { useState } from "react"
import { GenerateShareGraphicPayload } from "@/app/api/share/generate-share-graphic/route"

const Share = ({slug}: {slug: string}) => {
  const [svg, setSvg] = useState<GenerateShareGraphicPayload | null>(null)
  const onSuccess = (payload: GenerateShareGraphicPayload) => {
    setSvg(payload)
  }

  return <div className="flex flex-col gap-2">
    <ShareButton slug={slug} onSuccess={onSuccess} />
    {svg && (
      <img src={svg.imgUrl}
        className="max-w-full h-auto"
        alt="Share Graphic"
      />
    )}
  </div>
}

export default Share