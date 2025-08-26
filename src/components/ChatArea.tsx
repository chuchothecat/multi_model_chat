import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Message, LLMModel } from '../types';
import { MessageSquare } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  models: LLMModel[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  models,
  onSendMessage,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeModels = models.filter(m => m.isActive);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getModelForMessage = (message: Message) => {
    return models.find(model => model.id === message.modelId);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Welcome to Multi-Model Chat
            </h2>
            <p className="text-gray-500 mb-4 max-w-md">
              Configure your AI models on the right panel and start a conversation. 
              Each active model will respond based on their assigned role.
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 max-w-sm mx-auto">
              <p className="text-sm text-gray-600 mb-2">Currently Active:</p>
              <div className="space-y-1">
                {activeModels.map(model => (
                  <div key={model.id} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: model.color === 'blue' ? '#3B82F6' : '#8B5CF6' }}
                    />
                    <span>{model.name}</span>
                    <span className="text-gray-400">({model.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ChatInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading}
          disabled={activeModels.length === 0}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              model={getModelForMessage(message)}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
              </div>
              <span>Models are responding...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput 
        onSendMessage={onSendMessage} 
        isLoading={isLoading}
        disabled={activeModels.length === 0}
      />
    </div>
  );
};