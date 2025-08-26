import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message, LLMModel } from '../types';

interface ChatMessageProps {
  message: Message;
  model?: LLMModel;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, model }) => {
  const isUser = message.sender === 'user';
  
  const getBgColor = () => {
    if (isUser) return 'bg-blue-600';
    if (model?.color === 'blue') return 'bg-blue-500';
    if (model?.color === 'purple') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const getTextColor = () => {
    return isUser || model ? 'text-white' : 'text-gray-800';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">
            {isUser ? 'You' : (model?.name || 'Assistant')}
          </span>
          {model?.role && !isUser && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {model.role.charAt(0).toUpperCase() + model.role.slice(1).replace('-', ' ')}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div 
          className={`inline-block max-w-full p-3 rounded-lg ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : model?.color === 'purple'
                ? 'bg-purple-100 text-gray-800 border border-purple-200 rounded-bl-none'
                : 'bg-blue-100 text-gray-800 border border-blue-200 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};