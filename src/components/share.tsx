"use client"

import Image from "next/image"
import ShareButton from "./share-button"
import { useState, useRef } from "react"
import { Button } from "./ui/button"

const Share = ({slug}: {slug: string}) => {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [svgString, setSvgString] = useState<string | null>(null)
  const onSuccess = ({svgString}: {svgString: string}) => {
    setSvgString(svgString)
  }

  const share = () => {
    if(!svgContainerRef.current) return
    const svgElement = svgContainerRef.current.querySelector('svg')
    if(!svgElement) return

    // render svg to canvas and create png from canvas
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')
    if(!ctx) return

    ctx.fill(new Path2D(svgElement.outerHTML))
    const png = canvas.toDataURL('image/png')

    console.log({png})

    navigator.share({
      files: [new File([png], `{slug}.png`, {type: 'image/png'})]
    })
  }

  return <div>
    <ShareButton slug={slug} onSuccess={onSuccess} />
    {svgString && <Button onClick={share}>Share</Button>}

    {svgString && (
      <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgString }} />
    )}

  </div>
}

export default Share