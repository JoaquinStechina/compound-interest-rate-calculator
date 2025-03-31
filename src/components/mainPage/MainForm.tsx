"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface MainFormProps {
  handleSubmit: React.Dispatch<
    React.SetStateAction<InvestmentData | undefined>
  >;
}

const MainForm: React.FC<MainFormProps> = ({ handleSubmit }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 0,
      monthlyContribution: 0,
      timeLength: 0,
      annualInterestRate: 0,
    },
  });

  const onSubmit = (values: FormSchema) => {
    let investmentDataObject: InvestmentData = {
      ...values,
      moneyArray: [
        {
          profit: values.initialAmount,
          totalInvested: values.initialAmount,
          month: 0,
        },
      ],
    };
    //TEA = (1 + TNA/N*100)^N -1
    //N es el numero de capitalizaciones en un año(12 si es mensual, 365 si es diario, etc)
    //TODO agregar posibilidad de cambiar cantidad de capitalizaciones por año
    //Anual - Mensual - Diaria; Por ahora solamente todo es mensual

    const TNA = investmentDataObject.annualInterestRate; //Tasa Nominal Anual

    const n = 12 * 100; // 12 meses * 100 para tener TNA en decimales
    const m = 2 * 100; // 2 meses * 100 para tener TNA en decimales
    const o = 365 * 100; // 365 dias * 100 para tener TNA en decimales

    const TED = 1 + TNA / o; //Tasa Efectiva Diaria
    const TESA = 1 + TNA / m; //Tasa Efectiva Semi Anual
    const TEM = 1 + TNA / n; //Tasa Efectiva Mensual
    const TEA = Math.pow(TEM, 12); //Tasa Efectiva Anual

    let timeLength = investmentDataObject.timeLength;

    if (investmentDataObject.timeUnit === "year") {
      timeLength = investmentDataObject.timeLength * 12;
    }

    if (investmentDataObject.compoundFrequency === "daily") {
      if (investmentDataObject.timeUnit === "year") {
        timeLength = 365 * investmentDataObject.timeLength;
      } else {
        timeLength = 30 * investmentDataObject.timeLength;
      }
    }

    for (let i = 1; i <= timeLength; i++) {
      const P =
        investmentDataObject.moneyArray[i - 1].profit +
        investmentDataObject.monthlyContribution; //Dinero a invertir en el mes
      const T =
        investmentDataObject.moneyArray[i - 1].totalInvested +
        investmentDataObject.monthlyContribution; //Dinero invertido hasta el momento

      let capitalizationMoney = P;
      if (investmentDataObject.compoundFrequency === "annualy" && i % 12 == 0) {
        capitalizationMoney = truncateToTwoDecimals(P * (1 + TNA / 100));
      } else if (
        investmentDataObject.compoundFrequency === "semiannualy" &&
        i % 6 == 0
      ) {
        capitalizationMoney = truncateToTwoDecimals(P * TESA);
      } else if (investmentDataObject.compoundFrequency === "monthly") {
        capitalizationMoney = truncateToTwoDecimals(P * TEM);
      } else if (investmentDataObject.compoundFrequency === "daily") {
        capitalizationMoney = truncateToTwoDecimals(P * TED);
      }

      investmentDataObject.moneyArray.push({
        profit: capitalizationMoney,
        totalInvested: T,
        month: i,
      });
    }
    handleSubmit(investmentDataObject);
    console.log(investmentDataObject);
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

          <Button type="submit">Calculate</Button>
        </div>
      </form>
    </Form>
  );
};

export default MainForm;
