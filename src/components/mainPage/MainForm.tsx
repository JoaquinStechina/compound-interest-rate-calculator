"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { formSchema, FormSchema, InvestmentData } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const truncateToTwoDecimals = (num: number): number => {
  return Math.trunc(num * 100) / 100;
};

// Máximo de puntos a mostrar en el gráfico para evitar problemas de rendimiento
const MAX_CHART_POINTS = 1000;

interface MainFormProps {
  handleSubmit: React.Dispatch<
    React.SetStateAction<InvestmentData | undefined>
  >;
  onLoadingChange?: (isLoading: boolean) => void;
}

const MainForm: React.FC<MainFormProps> = ({ handleSubmit, onLoadingChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 0,
      monthlyContribution: 0,
      timeLength: 0,
      annualInterestRate: 0,
    },
  });

  const onSubmit = async (values: FormSchema) => {
    // Indicar que el cálculo está en progreso
    setIsLoading(true);
    onLoadingChange?.(true);
    
    // Usar setTimeout para permitir que la UI se actualice y mostrar el estado de carga
    // También permite que cálculos largos no bloqueen completamente la UI
    setTimeout(() => {
    const investmentDataObject: InvestmentData = {
      ...values,
      moneyArray: [
        {
          profit: values.initialAmount,
          totalInvested: values.initialAmount,
          month: 0,
        },
      ],
    };

    const TNA = investmentDataObject.annualInterestRate; // Tasa Nominal Anual en porcentaje (ej: 10 para 10%)

    // Convertir TNA a decimal (ej: 10% -> 0.10)
    const TNADecimal = TNA / 100;

    // Calcular número de períodos de capitalización por año según la frecuencia
    let periodsPerYear: number;
    switch (investmentDataObject.compoundFrequency) {
      case "daily":
        periodsPerYear = 365;
        break;
      case "monthly":
        periodsPerYear = 12;
        break;
      case "semiannualy":
        periodsPerYear = 2;
        break;
      case "annualy":
        periodsPerYear = 1;
        break;
      default:
        periodsPerYear = 12; // Default a mensual
    }

    // Calcular tasa periódica efectiva
    // Fórmula: Tasa Periódica = TNA / períodosPorAño
    // Para capitalización: Factor = 1 + Tasa Periódica
    const periodicRate = TNADecimal / periodsPerYear;
    const compoundFactor = 1 + periodicRate;

    // Convertir tiempo a meses (unidad base para contribuciones mensuales)
    const timeInMonths = investmentDataObject.timeUnit === "year" 
      ? investmentDataObject.timeLength * 12 
      : investmentDataObject.timeLength;

    const monthlyContribution = investmentDataObject.monthlyContribution;

    // Estrategia diferente según frecuencia:
    // - Para frecuencia diaria: iterar día por día
    // - Para otras frecuencias: iterar mes por mes
    let currentBalance = values.initialAmount;
    let totalInvested = values.initialAmount;

    // Calcular el intervalo de muestreo para limitar puntos del gráfico
    // Mantenemos el cálculo preciso pero limitamos los puntos guardados
    let totalPeriods: number;
    if (investmentDataObject.compoundFrequency === "daily") {
      totalPeriods = Math.round(timeInMonths * 30.44);
    } else {
      totalPeriods = timeInMonths;
    }

    // Calcular intervalo de muestreo para no exceder MAX_CHART_POINTS
    // Siempre incluimos el primer punto (mes 0) y el último punto
    const sampleInterval = totalPeriods > MAX_CHART_POINTS 
      ? Math.ceil(totalPeriods / MAX_CHART_POINTS)
      : 1;

    if (investmentDataObject.compoundFrequency === "daily") {
      // Para capitalización diaria, iterar día por día
      const totalDays = Math.round(timeInMonths * 30.44); // Promedio de días por mes
      
      for (let day = 1; day <= totalDays; day++) {
        // Aplicar contribución mensual cada ~30 días (aproximadamente cada mes)
        if (monthlyContribution > 0 && day % 30 === 0) {
          currentBalance += monthlyContribution;
          totalInvested += monthlyContribution;
        }

        // Capitalizar diariamente
        currentBalance = truncateToTwoDecimals(currentBalance * compoundFactor);

        // Guardar puntos muestreados para el gráfico (manteniendo precisión en el cálculo)
        // Siempre guardamos el último punto y puntos distribuidos uniformemente
        const shouldSavePoint = 
          day === totalDays || // Siempre guardar el último punto
          day === 1 || // Siempre guardar el primer punto
          day % sampleInterval === 0; // Guardar puntos distribuidos uniformemente

        if (shouldSavePoint) {
          investmentDataObject.moneyArray.push({
            profit: currentBalance,
            totalInvested: totalInvested,
            month: day,
          });
        }
      }
    } else {
      // Para otras frecuencias, iterar mes por mes
      for (let month = 1; month <= timeInMonths; month++) {
        // Aplicar contribución mensual al inicio de cada mes
        if (monthlyContribution > 0) {
          currentBalance += monthlyContribution;
          totalInvested += monthlyContribution;
        }

        // Determinar si debemos capitalizar en este mes según la frecuencia
        let shouldCapitalize = false;

        switch (investmentDataObject.compoundFrequency) {
          case "monthly":
            // Capitalización mensual: capitalizar cada mes
            shouldCapitalize = true;
            break;

          case "semiannualy":
            // Capitalización semestral: capitalizar cada 6 meses
            shouldCapitalize = month % 6 === 0;
            break;

          case "annualy":
            // Capitalización anual: capitalizar cada 12 meses
            shouldCapitalize = month % 12 === 0;
            break;
        }

        // Aplicar capitalización si corresponde
        if (shouldCapitalize) {
          currentBalance = truncateToTwoDecimals(currentBalance * compoundFactor);
        }

        // Guardar puntos muestreados para el gráfico (manteniendo precisión en el cálculo)
        // Siempre guardamos el último punto y puntos distribuidos uniformemente
        const shouldSavePoint = 
          month === timeInMonths || // Siempre guardar el último punto
          month === 1 || // Siempre guardar el primer punto
          month % sampleInterval === 0; // Guardar puntos distribuidos uniformemente

        if (shouldSavePoint) {
          investmentDataObject.moneyArray.push({
            profit: currentBalance,
            totalInvested: totalInvested,
            month: month,
          });
        }
      }
    }

    handleSubmit(investmentDataObject);
    setIsLoading(false);
    onLoadingChange?.(false);
    }, 0);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-auto bg-white shadow-lg rounded-lg dark:bg-background space-y-8 py-5 md:max-w-[500px] col-span-5 col-start-2"
      >
        <FormField
          control={form.control}
          name="initialAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Amount</FormLabel>
              <FormControl>
                <Input type={"number"} {...field} />
              </FormControl>
              <FormDescription>
                This will be the initial amount of your investment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyContribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly contribution</FormLabel>
              <FormControl>
                <Input type={"number"} {...field} />
              </FormControl>
              <FormDescription>
                This will be the monthly contribution of your investment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="mb-3">Length in time</FormLabel>
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="timeUnit"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-input">
                      <SelectItem value="year">Years</SelectItem>
                      <SelectItem value="month">Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeLength"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormControl>
                    <Input type={"number"} {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the length of your investment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="annualInterestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Interest Rate</FormLabel>
              <FormControl>
                <Input type={"number"} {...field} />
              </FormControl>
              <FormDescription>
                This will be the annual interest rate of your investment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel className="mb-0 pb-3">Compound frequency</FormLabel>
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="compoundFrequency"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-input">
                    <SelectItem value="annualy">Annualy</SelectItem>
                    <SelectItem value="semiannualy">Semiannualy</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  This will be the compound frequency of your investment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MainForm;
