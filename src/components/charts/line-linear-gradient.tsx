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
  const longestTime = chartData.sort((a, b) => b.time - a.time)[0].time
  const scaleFactor = 1.2

  const timeToPlottableTime = (time: LineLinearGradientChartProps["chartData"][0]) => {
    return {
      ...time,
      plottableTime: (longestTime*scaleFactor) - time.time
    }
  }

  const plottableTimeToTime = (plottableTime: number) => {
    return (longestTime*scaleFactor) - plottableTime
  }

  const plottingData = chartData.map(timeToPlottableTime).sort((a, b) => b.year - a.year)

  const formatYAxis = (value: number) => {
    return formatTime(plottableTimeToTime(value))
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
            <YAxis tickFormatter={formatYAxis} />
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
              type="natural"
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
