import { LLMModel, Message } from '../types';

// Environment variables for API keys
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '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';
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const APP_MODE = import.meta.env.VITE_APP_MODE || 'production';

// Simulated API responses for demonstration
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

export class LLMService {
  private static generateMockResponse(model: LLMModel, conversation: Message[], userMessage: string): string {
    const responses = {
      'gpt-4': {
        'neutral': [
          `That's an interesting perspective on "${userMessage}". Let me analyze this from multiple angles...`,
          `Based on the conversation so far, I think we should consider both the immediate implications and long-term consequences...`,
          `This raises several important questions that we should explore further...`
        ],
        'devils-advocate': [
          `I need to challenge that assumption about "${userMessage}". What if we're missing something critical here?`,
          `Hold on - isn't there a fundamental flaw in this reasoning? Let me play devil's advocate...`,
          `Before we accept this, shouldn't we consider the counterarguments? What about...`
        ],
        'summarizer': [
          `Let me summarize what we've discussed so far regarding "${userMessage}"...`,
          `The key points that have emerged from our conversation are...`,
          `To synthesize the different perspectives we've heard...`
        ],
        'creative': [
          `What if we approached "${userMessage}" from a completely different angle? Imagine if...`,
          `This reminds me of an interesting creative solution I've seen before...`,
          `Let's think outside the box here. What would happen if we...`
        ],
        'analyst': [
          `Looking at "${userMessage}" analytically, we need to break this down into components...`,
          `The data suggests several patterns we should examine...`,
          `From a systematic analysis perspective, here's what stands out...`
        ],
        'optimist': [
          `I see great potential in what you're discussing about "${userMessage}". Here's why this could work really well...`,
          `This is actually quite exciting! The possibilities here include...`,
          `I'm optimistic about this direction because...`
        ]
      },
      'claude': {
        'neutral': [
          `Thank you for raising "${userMessage}". I'd like to contribute a balanced perspective on this...`,
          `Building on what's been shared, I think there are several dimensions to consider...`,
          `This is a nuanced topic that deserves careful consideration from multiple viewpoints...`
        ],
        'devils-advocate': [
          `I appreciate the discussion about "${userMessage}", but I must respectfully disagree. Here's why...`,
          `As devil's advocate, I feel compelled to point out some potential issues with this approach...`,
          `Let me challenge this constructively - what about the risks we haven't discussed?`
        ],
        'summarizer': [
          `To summarize our discussion of "${userMessage}" and bring together the various viewpoints...`,
          `The conversation has revealed several key insights about this topic...`,
          `Drawing together the threads of our discussion, here's what emerges...`
        ],
        'creative': [
          `Your mention of "${userMessage}" sparks an interesting creative connection for me...`,
          `What if we reimagined this entire problem? I'm thinking of a creative approach where...`,
          `This opens up fascinating creative possibilities. Consider this alternative...`
        ],
        'analyst': [
          `Analyzing "${userMessage}" systematically, I see several patterns and relationships...`,
          `From an analytical standpoint, let me break down the key factors at play...`,
          `The logical structure of this problem suggests we should examine...`
        ],
        'optimist': [
          `I'm genuinely excited about the direction this discussion of "${userMessage}" is taking...`,
          `There's so much positive potential here! I can see multiple pathways to success...`,
          `This gives me great hope because it demonstrates...`
        ]
      }
    };

    const modelResponses = responses[model.id as keyof typeof responses];
    if (!modelResponses) return `As ${model.name}, I appreciate your message about "${userMessage}". Let me contribute to this discussion...`;

    const roleResponses = modelResponses[model.role as keyof typeof modelResponses] || modelResponses['neutral'];
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  }

  private static async callOpenAI(model: LLMModel, conversation: Message[], userMessage: string): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation history for OpenAI format
    const messages = [
      {
        role: 'system',
        content: `You are ${model.name}. ${this.getRolePrompt(model.role || 'neutral')} Respond as part of a multi-model conversation where other AI models are also participating.`
      },
      ...conversation.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  }

  private static async callAnthropic(model: LLMModel, conversation: Message[], userMessage: string): Promise<string> {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not configured');
    }

    // Build conversation history for Anthropic format
    const systemPrompt = `You are ${model.name}. ${this.getRolePrompt(model.role || 'neutral')} Respond as part of a multi-model conversation where other AI models are also participating.`;
    
    const messages = [
      ...conversation.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'Sorry, I could not generate a response.';
  }

  private static getRolePrompt(role: string): string {
    const rolePrompts = {
      'neutral': 'Respond in a balanced, objective manner. Provide thoughtful analysis without taking extreme positions.',
      'devils-advocate': 'Act as a devil\'s advocate. Challenge the ideas presented, ask probing questions, and present counterarguments to encourage deeper thinking.',
      'summarizer': 'Your role is to summarize and synthesize the key points from the conversation. Highlight the most important insights and connections.',
      'creative': 'Approach topics with creativity and imagination. Offer unique perspectives, innovative solutions, and think outside conventional boundaries.',
      'analyst': 'Analyze topics systematically. Focus on data, logical reasoning, and structured analysis. Break down complex problems methodically.',
      'optimist': 'Focus on positive aspects, potential opportunities, and constructive solutions. Maintain an optimistic outlook while being realistic.'
    };
    return rolePrompts[role as keyof typeof rolePrompts] || rolePrompts.neutral;
  }

  static async sendMessage(models: LLMModel[], conversation: Message[], userMessage: string): Promise<Message[]> {
    const activeModels = models.filter(model => model.isActive);
    const responses: Message[] = [];

    // Use mock responses only in development mode
    const useMockResponses = APP_MODE === 'development';

    if (useMockResponses) {
      console.log('Using mock responses. Set VITE_APP_MODE=production and configure API keys for real responses.');
    } else {
      console.log('Using real API calls. OpenAI key configured:', !!OPENAI_API_KEY);
    }

    // Process each active model
    for (const model of activeModels) {
      try {
        let responseContent: string;

        if (useMockResponses) {
          await simulateDelay();
          responseContent = this.generateMockResponse(model, conversation, userMessage);
        } else {
          // Make real API calls
          if (model.id === 'gpt-4') {
            console.log('Making OpenAI API call...');
            responseContent = await this.callOpenAI(model, conversation, userMessage);
          } else if (model.id === 'claude') {
            if (ANTHROPIC_API_KEY) {
              responseContent = await this.callAnthropic(model, conversation, userMessage);
            } else {
              console.log('No Anthropic API key, using mock response for Claude');
              await simulateDelay();
              responseContent = this.generateMockResponse(model, conversation, userMessage);
            }
          } else {
            responseContent = `Model ${model.name} is not yet implemented for real API calls.`;
          }
        }

        responses.push({
          id: `msg-${Date.now()}-${Math.random()}`,
          content: responseContent,
          sender: model.id,
          timestamp: new Date(),
          modelId: model.id
        });
      } catch (error) {
        console.error(`Error getting response from ${model.name}:`, error);
        
        // Fallback to mock response on API error
        await simulateDelay();
        const fallbackContent = this.generateMockResponse(model, conversation, userMessage);
        
        responses.push({
          id: `msg-${Date.now()}-${Math.random()}`,
          content: `[API Error - Using Mock Response] ${fallbackContent}`,
          sender: model.id,
          timestamp: new Date(),
          modelId: model.id
        });
      }
    }

    return responses;
  }
}