"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema, InvestmentDataObject } from "@/types";
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

interface MainFormProps {
  handleSubmit: React.Dispatch<
    React.SetStateAction<InvestmentDataObject | undefined>
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
    let investmentDataObject: InvestmentDataObject = {
      ...values,
      moneyArray: [
        { profit: values.initialAmount, totalInvested: values.initialAmount },
      ],
    };
    if (values.timeUnit === "month") {
      for (let i = 1; i <= values.timeLength; i++) {
        const P =
          investmentDataObject.moneyArray[i - 1].profit +
          values.monthlyContribution; //Dinero a invertir en el mes
        const r = values.annualInterestRate; //TNA
        const n = 12 * 100; // 12 meses * 100 para tener TNA en decimales
        const Q = 1 + r / n;
        const T =
          investmentDataObject.moneyArray[i - 1].totalInvested +
          values.monthlyContribution; //Dinero invertido hasta el momento

        const endOfMonthMoney = P * Q;
        investmentDataObject.moneyArray.push({
          profit: parseFloat(endOfMonthMoney.toFixed(2)),
          totalInvested: T,
        });
      }
    }
    handleSubmit(investmentDataObject);
    console.log(investmentDataObject);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-auto bg-white p-8 shadow-lg rounded-lg dark:bg-background space-y-8"
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
          <div className="grid grid-cols-4">
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
                      <SelectTrigger className="w-3/4">
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

        <Button type="submit">Calculate</Button>
      </form>
    </Form>
  );
};

export default MainForm;
