import React from 'react';
import { MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { ConversationSession } from '../types';

interface SessionListProps {
  sessions: ConversationSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
            session.id === currentSessionId
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onSelectSession(session.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {session.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(session.updatedAt)}</span>
                <span>•</span>
                <span>{session.messages.length} messages</span>
                <span>•</span>
                <span>{session.models.filter(m => m.isActive).length} models</span>
              </div>

              <div className="flex gap-1 mt-2">
                {session.models.filter(m => m.isActive).map((model) => (
                  <div
                    key={model.id}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: model.color === 'blue' ? '#3B82F6' : '#8B5CF6' }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};