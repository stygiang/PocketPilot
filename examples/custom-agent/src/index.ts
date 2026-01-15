/**
 * Example usage of the Financial Advisor Agent
 *
 * Run with: npm start
 */

import 'dotenv/config';
import { FinancialAdvisorAgent } from './agent.js';

async function main() {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
    console.error('   Create a .env file with: ANTHROPIC_API_KEY=your_key_here');
    console.error('   Get your key from: https://console.anthropic.com/settings/keys');
    process.exit(1);
  }

  console.log('🤖 Financial Advisor Agent - Starting...\n');

  // Create the agent
  const agent = new FinancialAdvisorAgent(apiKey);

  // Example 1: Calculate safe to spend
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Example 1: Calculate Safe to Spend');
  console.log('═══════════════════════════════════════════════════════════\n');

  const query1 = `I have $2,500 in my account, I make $4,000 per month,
and my monthly bills are $1,800. My next payday is in 15 days.
I want to save 10% of my income. How much is safe to spend today?`;

  console.log(`[User] ${query1}\n`);
  const response1 = await agent.run(query1);
  console.log(`\n[Agent Response]\n${response1}\n`);

  // Reset for next example
  agent.reset();

  // Example 2: Analyze spending pattern
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('Example 2: Analyze Spending Pattern');
  console.log('═══════════════════════════════════════════════════════════\n');

  const query2 = `Can you analyze my spending? I make $4,000 per month and here's where my money goes:
- Housing: $1,200
- Groceries: $400
- Dining out: $600
- Transportation: $300
- Entertainment: $350
- Utilities: $200
- Shopping: $450`;

  console.log(`[User] ${query2}\n`);
  const response2 = await agent.run(query2);
  console.log(`\n[Agent Response]\n${response2}\n`);

  // Reset for next example
  agent.reset();

  // Example 3: Create budget plan
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('Example 3: Create Budget Plan');
  console.log('═══════════════════════════════════════════════════════════\n');

  const query3 = `I make $5,500 per month. Can you help me create a budget plan
using the 50/30/20 rule? Break it down for me.`;

  console.log(`[User] ${query3}\n`);
  const response3 = await agent.run(query3);
  console.log(`\n[Agent Response]\n${response3}\n`);

  // Reset for next example
  agent.reset();

  // Example 4: Multi-turn conversation
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('Example 4: Multi-turn Conversation');
  console.log('═══════════════════════════════════════════════════════════\n');

  const query4a = `I'm trying to save money but struggling. I make $3,800/month
and my bills are $2,200. What should I do?`;

  console.log(`[User] ${query4a}\n`);
  const response4a = await agent.run(query4a);
  console.log(`\n[Agent Response]\n${response4a}\n`);

  // Follow-up question (using same agent instance to maintain context)
  const query4b = `That's helpful! Can you create a specific budget plan for me
that prioritizes building an emergency fund?`;

  console.log(`\n[User] ${query4b}\n`);
  const response4b = await agent.run(query4b);
  console.log(`\n[Agent Response]\n${response4b}\n`);

  console.log('\n✅ All examples completed!\n');
}

// Run the examples
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
