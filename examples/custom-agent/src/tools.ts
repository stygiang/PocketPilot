/**
 * Tools that the agent can use to perform calculations and provide advice
 */

import type { Tool } from '@anthropic-ai/sdk/resources/messages.mjs';

// Tool definitions for the agent
export const tools: Tool[] = [
  {
    name: 'calculate_safe_to_spend',
    description:
      'Calculates how much money is safe to spend based on income, bills, and current balance. Returns the safe amount for today and per day until next payday.',
    input_schema: {
      type: 'object',
      properties: {
        current_balance: {
          type: 'number',
          description: 'Current account balance in dollars',
        },
        monthly_income: {
          type: 'number',
          description: 'Monthly income in dollars',
        },
        monthly_bills: {
          type: 'number',
          description: 'Total monthly bills in dollars',
        },
        days_until_payday: {
          type: 'number',
          description: 'Number of days until next payday',
        },
        savings_goal_percentage: {
          type: 'number',
          description: 'Percentage of income to save (0-100)',
          default: 0,
        },
      },
      required: ['current_balance', 'monthly_income', 'monthly_bills', 'days_until_payday'],
    },
  },
  {
    name: 'analyze_spending_pattern',
    description:
      'Analyzes spending patterns and provides insights on where money is going and potential areas to cut back.',
    input_schema: {
      type: 'object',
      properties: {
        spending_by_category: {
          type: 'object',
          description: 'Object with category names as keys and amounts as values',
          additionalProperties: {
            type: 'number',
          },
        },
        income: {
          type: 'number',
          description: 'Monthly income in dollars',
        },
      },
      required: ['spending_by_category', 'income'],
    },
  },
  {
    name: 'create_budget_plan',
    description:
      'Creates a recommended budget plan based on the 50/30/20 rule or custom allocation.',
    input_schema: {
      type: 'object',
      properties: {
        monthly_income: {
          type: 'number',
          description: 'Monthly income in dollars',
        },
        budget_method: {
          type: 'string',
          enum: ['50-30-20', 'custom'],
          description: 'Budget allocation method',
          default: '50-30-20',
        },
        custom_needs_percentage: {
          type: 'number',
          description: 'Custom percentage for needs (only if budget_method is custom)',
        },
        custom_wants_percentage: {
          type: 'number',
          description: 'Custom percentage for wants (only if budget_method is custom)',
        },
        custom_savings_percentage: {
          type: 'number',
          description: 'Custom percentage for savings (only if budget_method is custom)',
        },
      },
      required: ['monthly_income'],
    },
  },
];

// Tool execution functions
export async function executeTool(toolName: string, toolInput: any): Promise<string> {
  switch (toolName) {
    case 'calculate_safe_to_spend':
      return calculateSafeToSpend(toolInput);
    case 'analyze_spending_pattern':
      return analyzeSpendingPattern(toolInput);
    case 'create_budget_plan':
      return createBudgetPlan(toolInput);
    default:
      return `Unknown tool: ${toolName}`;
  }
}

function calculateSafeToSpend(input: {
  current_balance: number;
  monthly_income: number;
  monthly_bills: number;
  days_until_payday: number;
  savings_goal_percentage?: number;
}): string {
  const { current_balance, monthly_income, monthly_bills, days_until_payday, savings_goal_percentage = 0 } = input;

  // Calculate savings amount
  const savingsAmount = (monthly_income * savings_goal_percentage) / 100;

  // Calculate available after bills and savings
  const afterBillsAndSavings = current_balance - monthly_bills - savingsAmount;

  // Calculate safe per day
  const safePerDay = afterBillsAndSavings / days_until_payday;

  // Calculate safe today (accounting for remaining days)
  const safeToday = Math.max(0, safePerDay);

  return JSON.stringify({
    safe_today: safeToday.toFixed(2),
    safe_per_day: safePerDay.toFixed(2),
    safe_until_payday: afterBillsAndSavings.toFixed(2),
    bills_reserved: monthly_bills.toFixed(2),
    savings_reserved: savingsAmount.toFixed(2),
    days_remaining: days_until_payday,
  });
}

function analyzeSpendingPattern(input: {
  spending_by_category: Record<string, number>;
  income: number;
}): string {
  const { spending_by_category, income } = input;

  const totalSpending = Object.values(spending_by_category).reduce((sum, amount) => sum + amount, 0);
  const spendingPercentage = (totalSpending / income) * 100;

  // Find highest spending category
  const sortedCategories = Object.entries(spending_by_category).sort(([, a], [, b]) => b - a);

  const analysis = {
    total_spending: totalSpending.toFixed(2),
    spending_percentage_of_income: spendingPercentage.toFixed(1),
    top_categories: sortedCategories.slice(0, 3).map(([category, amount]) => ({
      category,
      amount: amount.toFixed(2),
      percentage_of_total: ((amount / totalSpending) * 100).toFixed(1),
    })),
    recommendations: [],
  };

  // Add recommendations based on spending
  if (spendingPercentage > 90) {
    analysis.recommendations.push('You are spending more than 90% of your income. Consider reducing discretionary expenses.');
  }

  sortedCategories.forEach(([category, amount]) => {
    const categoryPercentage = (amount / income) * 100;
    if (categoryPercentage > 30 && category.toLowerCase().includes('dining')) {
      analysis.recommendations.push(`Dining expenses are ${categoryPercentage.toFixed(1)}% of income. Consider meal planning to reduce costs.`);
    }
    if (categoryPercentage > 40 && category.toLowerCase().includes('housing')) {
      analysis.recommendations.push(`Housing costs are ${categoryPercentage.toFixed(1)}% of income. This is above the recommended 30%.`);
    }
  });

  return JSON.stringify(analysis, null, 2);
}

function createBudgetPlan(input: {
  monthly_income: number;
  budget_method?: string;
  custom_needs_percentage?: number;
  custom_wants_percentage?: number;
  custom_savings_percentage?: number;
}): string {
  const { monthly_income, budget_method = '50-30-20' } = input;

  let needsPercentage = 50;
  let wantsPercentage = 30;
  let savingsPercentage = 20;

  if (budget_method === 'custom') {
    needsPercentage = input.custom_needs_percentage || 50;
    wantsPercentage = input.custom_wants_percentage || 30;
    savingsPercentage = input.custom_savings_percentage || 20;
  }

  const needsAmount = (monthly_income * needsPercentage) / 100;
  const wantsAmount = (monthly_income * wantsPercentage) / 100;
  const savingsAmount = (monthly_income * savingsPercentage) / 100;

  return JSON.stringify({
    budget_method,
    monthly_income: monthly_income.toFixed(2),
    allocation: {
      needs: {
        percentage: needsPercentage,
        amount: needsAmount.toFixed(2),
        description: 'Essential expenses: housing, utilities, groceries, transportation, insurance',
      },
      wants: {
        percentage: wantsPercentage,
        amount: wantsAmount.toFixed(2),
        description: 'Discretionary spending: dining out, entertainment, hobbies, subscriptions',
      },
      savings: {
        percentage: savingsPercentage,
        amount: savingsAmount.toFixed(2),
        description: 'Emergency fund, retirement, investments, debt repayment',
      },
    },
  }, null, 2);
}
