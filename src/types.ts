import * as z from "zod";

export const formSchema = z.object({
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

export type FormSchema = z.infer<typeof formSchema>;

export type InvestmentData = FormSchema & {
  moneyArray: { totalInvested: number; profit: number; month: number }[];
};
