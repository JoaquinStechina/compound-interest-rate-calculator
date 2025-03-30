"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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

const formSchema = z.object({
  initialAmount: z.coerce
    .number({
      required_error: "The initial amount is required!",
      invalid_type_error: "The initial amount must be a number!",
    })
    .positive({ message: "The initial amount cannot be zero or negative!" }),
  monthlyContribution: z.coerce
    .number({
      invalid_type_error: "The monthly contribution must be a number!",
    })
    .nonnegative({ message: "The monthly contribution cannot be negative!" }),
  timeUnit: z.string({
    required_error: "The time unit is required!",
  }),
  timeLength: z.coerce
    .number({
      required_error: "The length of time is required!",
      invalid_type_error: "The length of time must be a number!",
    })
    .positive({ message: "The length of time cannot be zero or negative!" }),
  annualInterestRate: z.coerce
    .number({
      required_error: "The annual interest rate is required!",
      invalid_type_error: "The annual interest rate must be a number!",
    })
    .positive({
      message: "The annual interest rate cannot be zero or negative!",
    }),
});

const MainForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 0,
      monthlyContribution: 0,
      timeLength: 0,
      annualInterestRate: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    let moneyArray = [values.initialAmount];
    if (values.timeUnit === "month") {
      for (let i = 1; i <= values.timeLength; i++) {
        const P = moneyArray[i - 1] + values.monthlyContribution; //Dinero a invertir en el mes
        const r = values.annualInterestRate; //TNA
        const n = 12 * 100; // 12 meses * 100 para tener TNA en decimales
        const Q = 1 + r / n;

        const endOfMonthMoney = P * Q;
        moneyArray.push(parseFloat(endOfMonthMoney.toFixed(2)));
      }
    }
    console.log(moneyArray);
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
