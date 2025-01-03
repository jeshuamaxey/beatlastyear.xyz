"use client"

import { useEffect, useState } from "react";

const ShareButton = ({ slug, onSuccess }: { slug: string, onSuccess?: ({svgUrl, svgString}: {svgUrl: string, svgString: string}) => void }) => {
  // const defaultUrl = process.env.VERCEL_URL
  // ? `https://${process.env.VERCEL_URL}`
  // : "http://localhost:3000";

  const [blobImageAsset, setBlobImageAsset] = useState<Blob | null>(null)

  const generateShareGraphic = async () => {
    const shareGraphicResponse = await fetch(`/api/share/generate-share-graphic`)
    // const { message, svgUrl, pngUrl } 
    const json = await shareGraphicResponse.json()
    
    // console.log(message, svgUrl, pngUrl)
    console.log(json)

    // const response = await fetch(svgUrl.toString());
    // const blob = await response.blob();
    // setBlobImageAsset(blob)
    onSuccess?.(json)
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

  const text = blobImageAsset ? "Share" : "Generate graphic"

  return <button onClick={blobImageAsset ? shareImageAsset : generateShareGraphic}>{text}</button>
}

export default ShareButton
