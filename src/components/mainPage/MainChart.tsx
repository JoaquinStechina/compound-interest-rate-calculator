"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { InvestmentData } from "@/types";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 186, mobile: 80 },
  { month: "August", desktop: 305, mobile: 200 },
  { month: "September", desktop: 237, mobile: 120 },
  { month: "October", desktop: 73, mobile: 190 },
  { month: "November", desktop: 209, mobile: 130 },
  { month: "December", desktop: 214, mobile: 140 },
];

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
  totalInvested: {
    label: "Total Invested",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface MainChartProps {
  investmentData: InvestmentData | undefined;
}

const MainChart: React.FC<MainChartProps> = ({ investmentData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compound Interest Chart</CardTitle>
        <CardDescription>
          Time unit: {investmentData?.timeUnit.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={investmentData?.moneyArray}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={1}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="profit"
              type="monotone"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="totalInvested"
              type="monotone"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        Total amount gained from interest: $
        {
          investmentData?.moneyArray[investmentData.moneyArray.length - 1]
            .profit
        }
      </CardFooter>
    </Card>
  );
};

export default MainChart;
