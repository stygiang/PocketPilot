/**
 * Financial Advisor Agent
 *
 * This agent helps users with budgeting advice, spending analysis,
 * and safe-to-spend calculations using Claude's API.
 */

import Anthropic from '@anthropic-ai/sdk';
import { tools, executeTool } from './tools.js';

export class FinancialAdvisorAgent {
  private client: Anthropic;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Run the agent with a user query
   */
  async run(userMessage: string): Promise<string> {
    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    let continueLoop = true;
    let finalResponse = '';

    while (continueLoop) {
      // Call Claude with tools
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: this.getSystemPrompt(),
        messages: this.conversationHistory,
        tools,
      });

      console.log(`\n[Agent] Stop reason: ${response.stop_reason}`);

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.content,
      });

      // Check if Claude wants to use tools
      if (response.stop_reason === 'tool_use') {
        // Execute all tool calls
        const toolResults: Anthropic.MessageParam = {
          role: 'user',
          content: [],
        };

        for (const block of response.content) {
          if (block.type === 'tool_use') {
            console.log(`\n[Tool] Executing: ${block.name}`);
            console.log(`[Tool] Input:`, JSON.stringify(block.input, null, 2));

            const result = await executeTool(block.name, block.input);

            console.log(`[Tool] Result:`, result);

            (toolResults.content as any[]).push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: result,
            });
          }
        }

        // Add tool results to conversation
        this.conversationHistory.push(toolResults);
      } else {
        // Extract text response
        for (const block of response.content) {
          if (block.type === 'text') {
            finalResponse += block.text;
          }
        }
        continueLoop = false;
      }
    }

    return finalResponse;
  }

  /**
   * Reset the conversation history
   */
  reset() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * System prompt that defines the agent's behavior
   */
  private getSystemPrompt(): string {
    return `You are a helpful financial advisor agent specializing in personal budgeting and spending advice.

Your role is to:
1. Help users understand their safe-to-spend amounts based on their income, bills, and financial goals
2. Analyze spending patterns and provide actionable insights
3. Create personalized budget plans
4. Give practical, empathetic advice that considers the user's unique situation

Guidelines:
- Always use the tools available to you for calculations and analysis
- Be encouraging and non-judgmental about financial situations
- Provide specific, actionable recommendations
- Explain financial concepts in simple terms
- Consider both short-term needs and long-term financial health
- Ask clarifying questions if you need more information

Available tools:
- calculate_safe_to_spend: Calculate how much is safe to spend
- analyze_spending_pattern: Analyze spending by category
- create_budget_plan: Create a budget allocation plan

Remember: You're here to empower users to make better financial decisions, not to shame them for past choices.`;
  }
}
