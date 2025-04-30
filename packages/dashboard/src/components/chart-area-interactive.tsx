"use client"

import * as React from "react"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import {useIsMobile} from "@/hooks/use-mobile"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {ToggleGroup, ToggleGroupItem,} from "@/components/ui/toggle-group"

interface LogEntry {
    type: "error" | "info" | "transaction"
    message: string
    context?: Record<string, unknown>
    timestamp: number
    app: string
    release: string
}

const chartConfig = {
    error: {
        label: "Error",
        color: "hsl(var(--chart-1))",
    },
    info: {
        label: "Info",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("30d")
    const [data, setData] = React.useState<{ date: string, error: number, info: number }[]>([])

    React.useEffect(() => {
        if (isMobile) setTimeRange("7d")
    }, [isMobile])

    React.useEffect(() => {
        ;(async () => {
            const res = await fetch("http://localhost:3000/api/logs", {cache: "no-store"})
            const logs: LogEntry[] = await res.json()

            const counts: Record<string, { error: number; info: number }> = {}

            for (const log of logs) {
                const date = new Date(log.timestamp).toISOString().slice(0, 10)
                if (!counts[date]) counts[date] = {error: 0, info: 0}
                if (log.type === "error") counts[date].error++
                if (log.type === "info") counts[date].info++
            }

            const series = Object.entries(counts)
                .map(([date, value]) => ({date, ...value}))
                .sort((a, b) => a.date.localeCompare(b.date))

            setData(series)
        })()
    }, [])

    const filteredData = React.useMemo(() => {
        const referenceDate = new Date()
        let days = 90
        if (timeRange === "30d") days = 30
        if (timeRange === "7d") days = 7

        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - days)

        return data.filter(item => new Date(item.date) >= startDate)
    }, [data, timeRange])

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardTitle>Errors & Info Logs</CardTitle>
                <CardDescription>
                    <span className="@[540px]/card:block hidden">Total for selected range</span>
                    <span className="@[540px]/card:hidden">Selected range</span>
                </CardDescription>
                <div className="absolute right-4 top-4">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="@[767px]/card:flex hidden"
                    >
                        <ToggleGroupItem value="90d" className="h-8 px-2.5">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="30d" className="h-8 px-2.5">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d" className="h-8 px-2.5">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="@[767px]/card:hidden flex w-40">
                            <SelectValue placeholder="Last 3 months"/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                            <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area dataKey="error" type="natural" fill="url(#fillError)" stroke="var(--color-error)"/>
                        <Area dataKey="info" type="natural" fill="url(#fillInfo)" stroke="var(--color-info)"/>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
