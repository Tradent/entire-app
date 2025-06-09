"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PricePoint {
  date: string
  price: number
}

interface PriceHistoryProps {
  priceHistory: PricePoint[]
}

export default function PriceHistory({ priceHistory }: PriceHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="h-64">
        <ChartContainer
          config={{
            price: {
              label: "Price (SOL)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                name="Price (SOL)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">All Time Low</p>
          <p className="text-xl font-bold">{Math.min(...priceHistory.map((point) => point.price))} SOL</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">All Time High</p>
          <p className="text-xl font-bold">{Math.max(...priceHistory.map((point) => point.price))} SOL</p>
        </Card>
      </div>
    </div>
  )
}
