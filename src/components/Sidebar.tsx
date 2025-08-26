import React, { useState } from 'react';
import { Plus, History, X } from 'lucide-react';
import { SessionList } from './SessionList';
import { ConversationSession } from '../types';

interface SidebarProps {
  sessions: ConversationSession[];
  currentSessionId?: string;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-900 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Multi-Model Chat</h1>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-300">Recent Sessions</h2>
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No conversations yet</p>
            <p className="text-gray-500 text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <SessionList
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
          />
        )}
      </div>
    </div>
  );
};