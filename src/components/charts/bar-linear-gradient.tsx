"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

type BarLinearGradientChartProps = {
  title: string
  description?: string
  chartData: Database["public"]["Tables"]["times"]["Row"][]
}

export function BarLinearGradientChart({ title, description, chartData }: BarLinearGradientChartProps) {
  const longestTime = chartData.sort((a, b) => b.time - a.time)[0].time
  const scaleFactor = 1.2

  const timeToPlottableTime = (time: BarLinearGradientChartProps["chartData"][0]) => {
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
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={plottingData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={formatYAxis}
              hide
              type="category"
              dataKey="year"
              />
            <XAxis
              type="number"
              hide
            />
            <defs>
              <linearGradient id="fillRunningVert" x1="1" y1="0" x2="0" y2="0">
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
            <Bar
              dataKey="plottableTime"
              type="natural"
              fill="url(#fillRunningVert)"
              fillOpacity={0.4}
              stackId="a"
              layout="vertical"
              >
                <LabelList
                  dataKey="year"
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
                <LabelList
                  dataKey="plottableTime"
                  formatter={(v: number) => formatTime(plottableTimeToTime(v))}
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  )
}
