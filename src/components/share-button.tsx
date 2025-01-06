"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { GenerateShareGraphicPayload } from "@/app/api/share/generate-share-graphic/route";

const ShareButton = ({ slug, onSuccess }: { slug: string, onSuccess?: (payload: GenerateShareGraphicPayload) => void }) => {
  const [loading, setLoading] = useState(false)

  const [blobImageAsset, setBlobImageAsset] = useState<Blob | null>(null)

  const generateShareGraphic = async () => {
    setLoading(true)
    const shareGraphicResponse = await fetch(`/api/share/generate-share-graphic`)
    const json = await shareGraphicResponse.json() as GenerateShareGraphicPayload
    const pngResponse = await fetch(json.imgUrl)
    const pngBlob = await pngResponse.blob()

    setBlobImageAsset(pngBlob)

    onSuccess?.(json)
    setLoading(false)
  }

  const shareImageAsset = async (): Promise<boolean> => {
    if(!blobImageAsset) {
      return false
    }

    const filesArray = [
      new File([blobImageAsset], `${slug}.png`, {
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

  const text = loading ? "Generating..." : blobImageAsset ? "Share x" : "Generate graphic"

  return <Button onClick={blobImageAsset ? shareImageAsset : generateShareGraphic} disabled={loading}>{text}</Button>
}

export default ShareButton
