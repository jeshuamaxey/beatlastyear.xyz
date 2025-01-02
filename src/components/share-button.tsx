"use client"

import { useEffect, useState } from "react";

const ShareButton = ({ slug, url, text }: { slug: string, url: string, text: string }) => {
  const [blobImageAsset, setBlobImageAsset] = useState<Blob | null>(null)

  useEffect(() => {
    const fetchBlobImageAsset = async () => {
      const response = await fetch(url.toString());
      const blob = await response.blob();
      setBlobImageAsset(blob)
    }
    fetchBlobImageAsset()
  }, [])

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

  return <button onClick={shareImageAsset}>{text}</button>
}

export default ShareButton
