// api/share/generate-share-graphic

// setting inspired by https://github.com/stephankaag/chromium-on-vercel
export const maxDuration = 60;

import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";
import PostHogServerClient from '@/lib/posthog';
import { formatTime } from '@/lib/utils';
import chromium from '@sparticuz/chromium';

const WIDTH = 1080
const HEIGHT = 1920

export type GenerateShareGraphicPayload = {
  message: string
  imgUrl: string
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

export async function GET(req: NextRequest): Promise<NextResponse<GenerateShareGraphicPayload> | NextResponse<ErrorPayload>> {
  let puppeteer: typeof import('puppeteer-core') | undefined
  let puppeteerOptions: any

  if(process.env.AWS_LAMBDA_FUNCTION_NAME) {
    puppeteer = require('puppeteer-core')
    puppeteerOptions = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true
    }
  } else {
    puppeteer = require('puppeteer')
    puppeteerOptions = {}
  }

  const posthog = PostHogServerClient()
  // const posthogProperties = {
  //   endpoint: 'api/share/generate-share-graphic',
  //   requestId: req.headers.get('x-vercel-trace-id')
  // }

  const supabase = await createClient()

  const { data: { user}, error } = await supabase.auth.getUser()

  if(!user) {
    console.error(error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  posthog.identify({ distinctId: user?.id })

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

  const svgString = svgTemplate
    .replace('{{FIRST_DATE}}', time1.date || time1.year.toString())
    .replace('{{FIRST_TIME}}', formatTime(time1.time))
    .replace('{{SECOND_DATE}}', time2.date || time2.year.toString())
    .replace('{{SECOND_TIME}}', formatTime(time2.time))
    .replace('{{THIRD_DATE}}', time3.date || time3.year.toString())
    .replace('{{THIRD_TIME}}', formatTime(time3.time))

  const date = new Date().toISOString()

  // Puppeteer
  chromium.setHeadlessMode = true;
  // disable webgl
  chromium.setGraphicsMode = false;

  const browser = await puppeteer!.launch(puppeteerOptions);

  const page = await browser.newPage();
  const contentHtml = getHtml(svgString)
  await page.setContent(contentHtml);
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT
  })
  const pngBuffer = await page.screenshot({ type: 'png' });
  await browser.close();

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
    imgUrl: pngPublicUrl.data.publicUrl
  }, { status: 200 })
}
