# Financial Advisor Agent

A custom AI agent built with the Claude API that provides personalized financial advice, budgeting help, and spending analysis.

## What is This?

This is a **custom AI agent** that demonstrates how to build intelligent assistants using Claude's API. Unlike simple chatbots, agents can:

- **Use tools** to perform calculations and analysis
- **Maintain conversation context** across multiple turns
- **Make decisions** about when to use tools vs. respond directly
- **Provide structured outputs** based on real calculations

## Features

The Financial Advisor Agent can:

- **Calculate Safe-to-Spend**: Determine how much you can safely spend today based on bills, income, and savings goals
- **Analyze Spending Patterns**: Break down spending by category and identify areas for improvement
- **Create Budget Plans**: Generate personalized budget allocations using the 50/30/20 rule or custom splits
- **Multi-turn Conversations**: Maintain context across questions for natural dialogue

## Architecture

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent (Claude) │ ◄──── System Prompt (defines behavior)
└────────┬────────┘
         │
         ├─► Text Response
         │
         └─► Tool Use Decision
                │
                ▼
         ┌──────────────┐
         │ Execute Tool │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Tool Result  │
         └──────┬───────┘
                │
                ▼
         Back to Agent for final response
```

## Setup

### 1. Install Dependencies

```bash
cd examples/custom-agent
npm install
```

### 2. Configure API Key

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from: https://console.anthropic.com/settings/keys

### 3. Run the Examples

```bash
npm start
```

This will run 4 example scenarios showing different agent capabilities.

## How It Works

### 1. Agent Class ([src/agent.ts](src/agent.ts))

The `FinancialAdvisorAgent` class manages:
- **Conversation history**: Stores all messages between user and agent
- **Agent loop**: Handles the tool use cycle (query → tool use → tool result → response)
- **System prompt**: Defines the agent's personality and capabilities

```typescript
const agent = new FinancialAdvisorAgent(apiKey);
const response = await agent.run("How much can I spend today?");
```

### 2. Tools ([src/tools.ts](src/tools.ts))

Tools are functions that the agent can call to perform specific tasks:

```typescript
// Tool definition (tells Claude what it can do)
{
  name: 'calculate_safe_to_spend',
  description: 'Calculates how much money is safe to spend...',
  input_schema: {
    // JSON Schema defining parameters
  }
}

// Tool execution (the actual function)
function calculateSafeToSpend(input) {
  // Perform calculation
  return JSON.stringify(result);
}
```

### 3. Agent Loop

The agent automatically:
1. Receives user query
2. Decides if it needs to use tools
3. Calls appropriate tools
4. Receives tool results
5. Formulates final response
6. Returns answer to user

This happens **automatically** - you just call `agent.run(query)` and the agent handles the rest!

## Key Concepts

### Tool Use

Claude decides when to use tools based on the user's query. For example:

**Query**: "How much can I spend if I have $2,000 and $800 in bills?"

**Agent's thought process**:
1. User wants a calculation → Use `calculate_safe_to_spend` tool
2. Execute tool with provided parameters
3. Get result: `{"safe_today": "80.00", ...}`
4. Formulate human-friendly response with the data

### Conversation Memory

The agent maintains conversation history, enabling follow-up questions:

```typescript
// First query
await agent.run("Analyze my spending: Rent $1200, Food $400...");

// Follow-up (agent remembers previous context)
await agent.run("How can I reduce my food costs?");
```

### System Prompt

The system prompt defines the agent's:
- **Role**: "You are a helpful financial advisor..."
- **Capabilities**: Tools it can use
- **Behavior**: How to respond, tone, guidelines

```typescript
private getSystemPrompt(): string {
  return `You are a helpful financial advisor agent...

  Your role is to:
  1. Help users understand their safe-to-spend amounts
  2. Analyze spending patterns
  ...`;
}
```

## Example Queries

Try these with the agent:

**Safe to Spend Calculation**:
```
"I have $3,000, make $5,000/month, bills are $2,200, payday in 14 days. How much can I spend?"
```

**Spending Analysis**:
```
"Analyze my spending: Housing $1500, Food $600, Entertainment $400, Gas $200"
```

**Budget Planning**:
```
"I make $4,500/month. Create a 50/30/20 budget for me."
```

**Multi-turn Conversation**:
```
User: "I'm overspending on dining out. What should I do?"
Agent: [Provides advice]
User: "How much should I allocate to groceries instead?"
Agent: [Uses context from previous message]
```

## Advanced: Building Your Own Tools

To add a new tool:

### 1. Define the tool schema in [src/tools.ts](src/tools.ts):

```typescript
{
  name: 'calculate_debt_payoff',
  description: 'Calculate how long it will take to pay off debt',
  input_schema: {
    type: 'object',
    properties: {
      debt_amount: { type: 'number' },
      monthly_payment: { type: 'number' },
      interest_rate: { type: 'number' }
    },
    required: ['debt_amount', 'monthly_payment', 'interest_rate']
  }
}
```

### 2. Implement the tool function:

```typescript
function calculateDebtPayoff(input: {
  debt_amount: number;
  monthly_payment: number;
  interest_rate: number;
}): string {
  // Your calculation logic here
  const months = /* calculation */;
  return JSON.stringify({ months_to_payoff: months });
}
```

### 3. Add to tool executor:

```typescript
export async function executeTool(toolName: string, toolInput: any) {
  switch (toolName) {
    case 'calculate_debt_payoff':
      return calculateDebtPayoff(toolInput);
    // ... other cases
  }
}
```

That's it! Claude will automatically understand when to use your new tool.

## Integration with Safe to Spend

This agent could be integrated into your Safe to Spend app to provide:

- **On-demand financial advice** in the app
- **Chatbot interface** for budget questions
- **Automated insights** based on user's actual data
- **Personalized recommendations** using real spending history

Example integration:

```typescript
// In your Next.js API route
import { FinancialAdvisorAgent } from './agent';

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  // Get user's financial data from database
  const userData = await getUserFinancialData(userId);

  // Create agent with context
  const agent = new FinancialAdvisorAgent(process.env.ANTHROPIC_API_KEY);

  // Run agent with user's question
  const response = await agent.run(message);

  return Response.json({ response });
}
```

## Next Steps

1. **Customize the system prompt** to match your brand voice
2. **Add more tools** for specific financial calculations
3. **Integrate with your database** to use real user data
4. **Add streaming responses** for better UX
5. **Implement conversation persistence** to save chat history
6. **Add safety guardrails** for sensitive financial advice

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Claude API Reference](https://docs.anthropic.com/en/api/messages)
- [Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)

## License

MIT
