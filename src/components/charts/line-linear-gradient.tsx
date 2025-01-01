"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Database } from "@/utils/supabase/database.types"
import { formatTime } from "@/lib/utils"

const chartConfig = {
  pbs: {
    label: "pbs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type LineLinearGradientChartProps = {
  title: string
  description?: string
  chartData: Database["public"]["Tables"]["times"]["Row"][]
}

export function LineLinearGradientChart({ title, description, chartData }: LineLinearGradientChartProps) {
  const slowestTime = chartData.sort((a, b) => b.time - a.time)[0].time
  const fastestTime = chartData.sort((a, b) => a.time - b.time)[0].time
  const scaleFactor = 1.2

  const mapper = (time: LineLinearGradientChartProps["chartData"][0]) => {
    return {
      ...time,
      plottableTime: timeToPlottableTime(time.time)
    }
  }

  const timeToPlottableTime = (time: number) => {
    return (slowestTime*scaleFactor) - time
  }

  const plottableTimeToTime = (plottableTime: number) => {
    return (slowestTime*scaleFactor) - plottableTime
  }

  const roundToNearest = (value: number, nearest: number, direction: "up" | "down" = "up", buffer: number = 0) => {
    if (direction === "up") {
      return Math.ceil((value + buffer) / nearest) * nearest
    } else {
      return Math.floor((value - buffer) / nearest) * nearest
    }
  }

  const plottingData = chartData.map(mapper).sort((a, b) => a.year - b.year)

  const buffer = 10
  const timeTicks = [
    Math.floor(((fastestTime*scaleFactor) - fastestTime - buffer) / 60) * 60,
    Math.ceil(((slowestTime*scaleFactor) - slowestTime + buffer) / 60) * 60
  ]

  // const ticks = timeTicks.map(t => (slowestTime * scaleFactor) - t)

  // console.log({
  //   fastestTime,
  //   slowestTime,
  //   f: formatTime(fastestTime),
  //   s: formatTime(slowestTime)
  // })

  const slowestPlottable = timeToPlottableTime(slowestTime)
  const fastestPlottable = timeToPlottableTime(fastestTime)

  const domain = [
    roundToNearest(slowestPlottable, 60, "down", 10),
    roundToNearest(fastestPlottable, 60, "up", 10),
  ]

  // console.log(domain)

  const formatYAxis = (value: number) => {
    const time = plottableTimeToTime(value)
    return `${formatTime(time)}`
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={plottingData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              type="number"
              domain={domain}
              tickCount={10}
              // interval={"preserveStartEnd"}
              // ticks={ticks}
              tickMargin={8}
              tickFormatter={formatYAxis}
              />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={
              <ChartTooltipContent
                /* @ts-expect-error: some type shenanigans */
                formatter={(_0, _1, _2, _3, time: LineLinearGradientChartProps["chartData"][0]) => {
                  return <p>{time.year}: {formatTime(time.time as number)}</p>
                }}
              />
              } />
            <defs>
              <linearGradient id="fillRunning" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pbs)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pbs)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="plottableTime"
              type="bumpX"
              fill="url(#fillRunning)"
              fillOpacity={0.4}
              stroke="var(--color-pbs)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </>
  )
}
