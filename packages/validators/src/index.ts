import { z } from 'zod';

const centsSchema = z.number().int();

export const balanceInputSchema = z.object({
  balanceCents: centsSchema,
});

export const incomeSourceBaseSchema = z.object({
  name: z.string().min(1),
  amountCents: centsSchema,
  cadence: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM']),
  nextPayDate: z.string().min(8),
  active: z.boolean().default(true),
});

export const incomeSourceCreateSchema = incomeSourceBaseSchema;
export const incomeSourceUpdateSchema = incomeSourceBaseSchema.partial();

export const billBaseSchema = z.object({
  name: z.string().min(1),
  amountCents: centsSchema,
  cadence: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM']),
  dueDayOfMonth: z.number().int().min(1).max(31).nullable().optional(),
  nextDueDate: z.string().min(8).nullable().optional(),
  active: z.boolean().default(true),
});

export const billCreateSchema = billBaseSchema;
export const billUpdateSchema = billBaseSchema.partial();

export const expenseBaseSchema = z.object({
  amountCents: centsSchema,
  date: z.string().min(8),
  category: z.string().min(1).nullable().optional(),
  note: z.string().min(1).nullable().optional(),
});

export const expenseCreateSchema = expenseBaseSchema;
export const expenseUpdateSchema = expenseBaseSchema.partial();

export const settingsUpdateSchema = z.object({
  timezone: z.string().min(1).optional(),
  plannedSavingsCentsPerPaycheck: centsSchema.optional(),
});

export type BalanceInput = z.infer<typeof balanceInputSchema>;
export type IncomeSourceCreate = z.infer<typeof incomeSourceCreateSchema>;
export type IncomeSourceUpdate = z.infer<typeof incomeSourceUpdateSchema>;
export type BillCreate = z.infer<typeof billCreateSchema>;
export type BillUpdate = z.infer<typeof billUpdateSchema>;
export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;