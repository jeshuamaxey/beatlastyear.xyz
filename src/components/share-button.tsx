"use client"

import { useEffect, useState } from "react";

const ShareButton = ({ slug }: { slug: string }) => {
  const [blobImageAsset, setBlobImageAsset] = useState<Blob | null>(null)
  const url = "/ig-story.png"

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

  return <button onClick={shareImageAsset}>Share</button>
}

export default ShareButton