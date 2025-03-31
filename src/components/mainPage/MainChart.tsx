"use client";

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

const chartConfig = {
  profit: {
    label: "Profit",
  },
  totalInvested: {
    label: "Total Invested",
  },
} satisfies ChartConfig;

interface MainChartProps {
  investmentData: InvestmentData | undefined;
}

const MainChart: React.FC<MainChartProps> = ({ investmentData }) => {
  return (
    <Card className="pt-6 col-span-5 my-5">
      <CardHeader>
        <CardTitle>Compound Interest Chart</CardTitle>
        <CardDescription>
          Initial investment of {investmentData?.initialAmount} in a span of{" "}
          {investmentData?.timeLength}{" "}
          {investmentData?.timeUnit === "year" ? "years" : "months"}
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
              stroke="var(--color-chart-3)"
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
