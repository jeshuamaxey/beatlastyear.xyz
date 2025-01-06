"use client"

import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle } from "./ui/dialog"
import { useState } from "react"
import { GenerateShareGraphicPayload } from "@/app/api/share/generate-share-graphic/route"
import { Button } from "./ui/button"

const Share = ({slug}: {slug: string}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [graphic, setGraphic] = useState<{
    url: string,
    blob: Blob
  } | null>(null)

  const generateGraphic = async () => {
    setGenerating(true)
    const shareGraphicResponse = await fetch(`/api/share/generate-share-graphic`)
    const json = await shareGraphicResponse.json() as GenerateShareGraphicPayload
    const pngResponse = await fetch(json.imgUrl)
    const pngBlob = await pngResponse.blob()

    setGraphic({
      url: json.imgUrl,
      blob: pngBlob
    })
    setGenerating(false)
  }

  const shareGraphic = async (): Promise<boolean> => {
    if(!graphic) {
      return false
    }

    const filesArray = [
      new File([graphic.blob], `${slug}.png`, {
        type: 'image/png',
        lastModified: new Date().getTime(),
      }),
    ];
    const shareData = {
      title: `${slug}`,
      files: filesArray,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true
    }
    return false
  };

  const openModal = () => {
    setIsOpen(true)
    if(!generating) {
      generateGraphic()
    }
  }

  const status : "GENERATING" | "GENERATED" | "IDLE" = generating ? "GENERATING" : graphic ? "GENERATED" : "IDLE"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={openModal}>Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your personal bests</DialogTitle>
        </DialogHeader>
        {status === "GENERATING" && (
          <div className="flex flex-col gap-2">
            <div className="animate-pulse bg-foreground/10 max-w-[1080px] max-h-[1920px] aspect-[9/16] flex flex-col items-center justify-center">
              <p>Generating...</p>
            </div>
          </div>
        )}
        {status === "GENERATED" && (
          <div className="flex flex-col gap-2">
            <img className="fade-in-0" src={graphic?.url} alt="Share Graphic" />
            <Button onClick={shareGraphic}>Share</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Share