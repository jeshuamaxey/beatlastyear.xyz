// api/share/generate-share-graphic
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";
import PostHogServerClient from '@/lib/posthog';
import { formatTime } from '@/lib/utils';
import canvas from 'canvas'
import { DOMParser } from '@xmldom/xmldom'
import { Canvg, presets } from 'canvg';
// import sharp from 'sharp'
// import { convert } from 'convert-svg-to-png'
// import svg2img from 'svg2img'

const WIDTH = 1080
const HEIGHT = 1920

const preset = presets.node({
  DOMParser,
  canvas,
  fetch
});

export type GenerateShareGraphicPayload = {
  message: string
  svgUrl: string
  pngUrl: string
  svgString: string
}

export type ErrorPayload = {
  error: string
}

const getHtml = (svgString: string) => {
  return `
    <!DOCTYPE html>
    <html>

    <head>
      <style>
        body {
          margin: 0;
        }
      </style>
    </head>
    <body>${svgString}</body>
    </html>`
}

let puppeteer: any
let chrome: any

if(process.env.AWS_LAMBDA_FUNCTION_NAME) {
  chrome = require('chrome-aws-lambda')
  puppeteer = require('puppeteer-core')
} else {
  puppeteer = require('puppeteer')
}

export async function GET(req: Request): Promise<NextResponse<GenerateShareGraphicPayload> | NextResponse<ErrorPayload>> {
  const posthog = PostHogServerClient()

  const supabase = await createClient()

  const { data: { user}, error } = await supabase.auth.getUser()

  if(!user) {
    console.error(error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error: timesError } = await supabase.from('times')
    .select('*')
    .eq('distance', '5km')
    .order('time', { ascending: false })
    .limit(3)

  if(timesError || !data || data.length < 3) {
    return NextResponse.json({ error: "Error fetching times" }, { status: 500 })
  }

  const [time1, time2, time3] = data

  const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

  const templateUrl = `${defaultUrl}/ig-story-simple-template.svg`

  console.log("process.env.VERCEL_PROJECT_PRODUCTION_URL :: ", process.env.VERCEL_PROJECT_PRODUCTION_URL)
  console.log("defaultUrl :: ", defaultUrl)
  console.log("templateUrl :: ", templateUrl)

  // load file from url
  const response = await fetch(templateUrl)

  if(!response.ok) {
    console.error("Error fetching template", response)
    return NextResponse.json({ error: "Error fetching template" }, { status: 500 })
  }

  const svgTemplate = await response.text()

  console.log(svgTemplate)

  const svgString = svgTemplate
    .replace('{{FIRST_DATE}}', time1.date || time1.year.toString())
    .replace('{{FIRST_TIME}}', formatTime(time1.time))
    .replace('{{SECOND_DATE}}', time2.date || time2.year.toString())
    .replace('{{SECOND_TIME}}', formatTime(time2.time))
    .replace('{{THIRD_DATE}}', time3.date || time3.year.toString())
    .replace('{{THIRD_TIME}}', formatTime(time3.time))

  const date = new Date().toISOString()

  // upload svgString to svg file
  const {data: svgUploadData, error: svgUploadError} = await supabase.storage.from('share_graphics')
    .upload(`${user.id}-${date}.svg`, svgString, {
      contentType: 'image/svg',
    })

  if(svgUploadError) {
    console.error(svgUploadError)
    return NextResponse.json({ error: "Error uploading share graphic" }, { status: 500 })
  }

  const svgPublicUrl = supabase.storage.from('share_graphics').getPublicUrl(svgUploadData.path)

  // Canvg

  // const canvas = preset.createCanvas(WIDTH, HEIGHT)
  // const ctx = canvas.getContext('2d')
  // const v = Canvg.fromString(ctx, svgString, {
  //   ...preset,
  //   enableRedraw: true,
  // })

  // // Render only first frame, ignoring animations.
  // await v.render({
  //   ...preset,
  //   enableRedraw: true,
  // })

  // const pngBuffer = canvas.toBuffer()

  // Puppeteer
  let browser: any
  if(process.env.AWS_LAMBDA_FUNCTION_NAME) {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true
    });
  } else {
    browser = await puppeteer.launch();
  }

  const page = await browser.newPage();
  const contentHtml = getHtml(svgString)
  await page.setContent(contentHtml);
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT
  })
  const pngBuffer = await page.screenshot({ type: 'png' });
  await browser.close();

  // sharp conversion from svg to png
  // works, but embedded fonts are not supported by sharp
  // const svgBuffer = Buffer.from(svg)
  // const pngBuffer = await sharp(svgBuffer)
  //   .resize(1080, 1920)
  //   .png()
  //   .toBuffer()
  
  // convert svg to png
  // total failure
  // const pngBuffer = await convert(`<html><body>${svg}</body></html>`)

  // svg2img
  // let pngBuffer: Buffer | undefined
  // let pngError: Error | undefined

  // svg2img(svgString, (error, buffer) => {
  //   pngError = error
  //   pngBuffer = buffer
  // })

  // if(pngError || !pngBuffer) {
  //   console.error(pngError)
  //   return NextResponse.json({ error: "Error converting svg to png" }, { status: 500 })
  // }

  const {data: pngUploadData, error: pngUploadError} = await supabase.storage.from('share_graphics')
    .upload(`${user.id}-${date}.png`, pngBuffer, {
      contentType: 'image/png',
    })

  if(pngUploadError) {
    console.error(pngUploadError)
    return NextResponse.json({ error: "Error uploading share graphic" }, { status: 500 })
  }

  const pngPublicUrl = supabase.storage.from('share_graphics').getPublicUrl(pngUploadData.path)

  return NextResponse.json({
    message: "Share graphic generated",
    pngUrl: pngPublicUrl.data.publicUrl,
    svgUrl: svgPublicUrl.data.publicUrl,
    svgString
  }, { status: 200 })
}
