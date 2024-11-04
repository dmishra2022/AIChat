import { Message } from '../types/chat';

const THINKING_TIME = 1000;
const MAX_RETRIES = 3;

const TOPICS = {
  GREETING: ['hello', 'hi', 'hey', 'greetings'],
  CODING: ['code', 'programming', 'function', 'algorithm'],
  EXPLANATION: ['explain', 'what', 'how', 'why', 'tell'],
  COMPARISON: ['compare', 'difference', 'versus', 'vs'],
  HELP: ['help', 'assist', 'support', 'guide'],
};

const CODE_EXAMPLES = [
  {
    language: 'javascript',
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    explanation: 'This is a QuickSort implementation in JavaScript.',
  },
  {
    language: 'python',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 numbers
[fibonacci(i) for i in range(10)]`,
    explanation: 'A recursive Fibonacci sequence generator in Python.',
  },
  {
    language: 'typescript',
    code: `interface User {
  id: string;
  name: string;
  email: string;
}

function formatUser(user: User): string {
  return \`\${user.name} (\${user.email})\`;
}`,
    explanation: 'TypeScript interface and type-safe function example.',
  },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function detectTopics(message: string): string[] {
  const lowercaseMessage = message.toLowerCase();
  return Object.entries(TOPICS)
    .filter(([_, keywords]) =>
      keywords.some(keyword => lowercaseMessage.includes(keyword))
    )
    .map(([topic]) => topic);
}

function generateCodeResponse(): string {
  const example = getRandomElement(CODE_EXAMPLES);
  return `Here's an example ${example.language} code snippet:

\`\`\`${example.language}
${example.code}
\`\`\`

${example.explanation}

Would you like me to explain how this code works in detail?`;
}

function generateExplanationResponse(message: string): string {
  const topics = message.match(/about (.+?(?=\?|$))/i)?.[1] || 'this topic';
  
  return `Let me explain about ${topics}:

1. **Key Concepts**
   - Understanding the fundamentals
   - Core principles and patterns
   - Common use cases

2. **Practical Applications**
   - Real-world examples
   - Best practices
   - Implementation strategies

3. **Further Considerations**
   - Performance implications
   - Security aspects
   - Scalability factors

Would you like me to elaborate on any of these points?`;
}

function generateComparisonResponse(): string {
  return `Let's break this comparison down:

| Aspect | Option A | Option B |
|--------|----------|----------|
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Ease of Use | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Features | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Key Differences:**
1. Implementation complexity
2. Resource requirements
3. Community support

Would you like a more detailed analysis of any specific aspect?`;
}

export async function generateResponse(message: string, retryCount = 0): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, THINKING_TIME));
  
  try {
    const topics = detectTopics(message);
    
    if (topics.includes('GREETING')) {
      const greetings = [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Greetings! I'm ready to help with your questions.",
      ];
      return getRandomElement(greetings);
    }
    
    if (topics.includes('CODING')) {
      return generateCodeResponse();
    }
    
    if (topics.includes('EXPLANATION')) {
      return generateExplanationResponse(message);
    }
    
    if (topics.includes('COMPARISON')) {
      return generateComparisonResponse();
    }
    
    // Default response for other queries
    return `I understand you're asking about "${message}".

Let me help you with that. Here are some key points to consider:

1. **Context**: Understanding the background and requirements
2. **Analysis**: Breaking down the problem into manageable parts
3. **Solution**: Providing practical and efficient approaches

Would you like me to:
- Explain any point in more detail?
- Provide specific examples?
- Share relevant resources?

Just let me know what would be most helpful!`;

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      return generateResponse(message, retryCount + 1);
    }
    throw new Error('Failed to generate response');
  }
}