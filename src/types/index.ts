export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  color: string;
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | string; // 'user' or model id
  timestamp: Date;
  modelId?: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  models: LLMModel[];
  messages: Message[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  prompt: string;
}