"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

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
import { formatCurrency, formatNumber } from "@/lib/utils";

const chartConfig = {
  profit: {
    label: "Profit",
  },
  totalInvested: {
    label: "Total Invested",
  },
} satisfies ChartConfig;

const TOOLTIP_LABELS: Record<string, string> = {
  profit: "Profit",
  totalInvested: "Total Invested",
};

function tooltipFormatter(
  value: number | string | (string | number)[],
  name: string,
  item: { color?: string },
) {
  const label = TOOLTIP_LABELS[name] ?? name;
  const color = item?.color;
  const raw = Array.isArray(value) ? value[0] : value;
  const numValue = typeof raw === "number" ? raw : Number(raw);
  return (
    <>
      {color != null && (
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
      )}
      <div className="flex flex-1 justify-between leading-none items-center gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-mono font-medium tabular-nums">
          {formatCurrency(numValue)}
        </span>
      </div>
    </>
  );
}

interface MainChartProps {
  investmentData: InvestmentData | undefined;
  isLoading?: boolean;
}

const MainChart: React.FC<MainChartProps> = ({ investmentData, isLoading = false }) => {
  // Validar que tenemos datos válidos antes de renderizar
  const hasValidData = 
    investmentData && 
    investmentData.moneyArray && 
    investmentData.moneyArray.length > 0;

  // Calcular el interés total ganado
  const totalInterest = hasValidData
    ? investmentData.moneyArray[investmentData.moneyArray.length - 1].profit -
      investmentData.moneyArray[investmentData.moneyArray.length - 1].totalInvested
    : 0;

  return (
    <Card className="pt-6 col-span-5 my-5">
      <CardHeader>
        <CardTitle>Compound Interest Chart</CardTitle>
        {hasValidData ? (
          <CardDescription>
            Initial investment of {formatCurrency(investmentData.initialAmount)} in a span of{" "}
            {formatNumber(investmentData.timeLength)}{" "}
            {investmentData.timeUnit === "year" ? "years" : "months"}
          </CardDescription>
        ) : (
          <CardDescription>
            {isLoading ? "Calculating..." : "Enter investment details to see the chart"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Calculating compound interest...</p>
            </div>
          </div>
        ) : !hasValidData ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">
              No data available. Please fill in the form and click &quot;Calculate&quot; to see the chart.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={investmentData.moneyArray}
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={(value, name, item) =>
                  tooltipFormatter(value, String(name), item)
                }
              />

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
        )}
      </CardContent>
      {hasValidData && (
        <CardFooter className="flex flex-col items-start gap-2">
          <div>
            <span className="text-sm font-medium">Total amount: </span>
            <span className="text-sm">
              {formatCurrency(investmentData.moneyArray[investmentData.moneyArray.length - 1].profit)}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Total invested: </span>
            <span className="text-sm">
              {formatCurrency(investmentData.moneyArray[investmentData.moneyArray.length - 1].totalInvested)}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Interest gained: </span>
            <span className="text-sm text-[var(--primary)] dark:text-[var(--primary)]">
              {formatCurrency(totalInterest)}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MainChart;
