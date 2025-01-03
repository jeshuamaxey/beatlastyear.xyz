"use client"

import Image from "next/image"
import ShareButton from "./share-button"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
// import canvasRenderer from "canvas-renderer"
import { Canvg } from 'canvg';

type SVGResponse = {
  svgString: string
  svgUrl: string
}

const Share = ({slug}: {slug: string}) => {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [svg, setSvg] = useState<SVGResponse | null>(null)
  const onSuccess = ({svgString, svgUrl}: SVGResponse) => {
    setSvg({svgString, svgUrl})
  }

  const share = async () => {
    if(!svgContainerRef.current || !svg) return
    const svgElement = svgContainerRef.current.querySelector('svg')
    if(!svgElement) return

    // using DOM APIs
    // render svg to canvas and create png from canvas
    // const canvas = canvasRef.current
    // if(!canvas) return
    // canvas.width = 1080
    // canvas.height = 1920
    // const ctx = canvas.getContext('2d')

    // using canvg
    const canvas = canvasRef.current
    if(!canvas) return
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')

    if(!ctx) return

    // create svg document
    const svgDoc = new DOMParser().parseFromString(svg.svgString, 'image/svg+xml')
    const v = new Canvg(ctx, svgDoc)
    await v.render()

    if(!ctx) return

    // ctx.fill(new Path2D(svgElement.outerHTML))
    const png = canvas.toDataURL('image/png')
    const pngFile = new File([png], `${slug}.png`, {type: 'image/png'})

    // // save png to supabase
    // const supabase = createClient()
    // const pngFileName = `${svg.svgUrl.replace('.svg', '').split('/').pop()}.png`
    // const {data, error} = await supabase.storage.from('share_graphics').upload(pngFileName, pngFile, {
    //   contentType: 'image/png',
    //   // upsert: true
    // })

    // if(error) {
    //   console.error(error)
    //   return
    // }

    // const pngUrl = supabase.storage.from('share_graphics').getPublicUrl(data.path)

    // console.log({pngUrl})

    navigator.share({
      files: [pngFile]
    })

    const pngBlob = canvas.toBlob(async (blob) => {
      if(!blob) return

      const pngFile = new File([blob], `${slug}.png`, {type: 'image/png'})
      console.log({pngFile})

      // save png to supabase
      const supabase = createClient()
      const pngFileName = `${svg.svgUrl.replace('.svg', '').split('/').pop()}.png`
      const {data, error} = await supabase.storage.from('share_graphics').upload(pngFileName, pngFile, {
          contentType: 'image/png',
          // upsert: true
        })

         if(error) {
      console.error(error)
      return
    }
        
        console.log({data})
        const pngUrl = supabase.storage.from('share_graphics').getPublicUrl(data.path)

        console.log(pngUrl)
    })
  }

  return <div>
    <ShareButton slug={slug} onSuccess={onSuccess} />

    <canvas className="border border-red-500" width={1080} height={1920} ref={canvasRef}></canvas>

    {svg && <Button onClick={share}>Share</Button>}

    {svg && (
      <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svg.svgString }} />
    )}

  </div>
}

export default Share