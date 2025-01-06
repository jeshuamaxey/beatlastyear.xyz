"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { GenerateShareGraphicPayload } from "@/app/api/share/generate-share-graphic/route";

const ShareButton = ({ slug, onSuccess }: { slug: string, onSuccess?: ({svgUrl, svgString}: GenerateShareGraphicPayload) => void }) => {
  const [loading, setLoading] = useState(false)

  const [blobImageAsset, setBlobImageAsset] = useState<Blob | null>(null)

  const generateShareGraphic = async () => {
    setLoading(true)
    const shareGraphicResponse = await fetch(`/api/share/generate-share-graphic`)
    // const { message, svgUrl, pngUrl } 
    const json = await shareGraphicResponse.json() as GenerateShareGraphicPayload
    
    // console.log(message, svgUrl, pngUrl)
    console.log(json)

    // create pngFileBlob from pngUrl
    const pngResponse = await fetch(json.pngUrl)
    const pngBlob = await pngResponse.blob()

    console.log({pngResponse, pngBlob})
    setBlobImageAsset(pngBlob)

    // const response = await fetch(svgUrl.toString());
    // const blob = await response.blob();
    // setBlobImageAsset(blob)
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
