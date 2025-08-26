import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ModelPanel } from './components/ModelPanel';
import { StorageService } from './services/storage';
import { LLMService } from './services/llm';
import { ConversationSession, LLMModel, Message } from './types';

function App() {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultModels: LLMModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      isActive: true,
      color: 'blue',
      role: 'neutral'
    },
    {
      id: 'claude',
      name: 'Claude',
      provider: 'Anthropic',
      isActive: true,
      color: 'purple',
      role: 'devils-advocate'
    }
  ];

  // Load sessions and current session on mount
  useEffect(() => {
    const loadedSessions = StorageService.getAllSessions();
    setSessions(loadedSessions);

    const savedCurrentSessionId = StorageService.getCurrentSessionId();
    if (savedCurrentSessionId) {
      const session = StorageService.getSession(savedCurrentSessionId);
      if (session) {
        setCurrentSessionId(savedCurrentSessionId);
        setCurrentSession(session);
      }
    }
  }, []);

  const createNewSession = () => {
    const newSession: ConversationSession = {
      id: `session-${Date.now()}`,
      title: `New Conversation ${new Date().toLocaleDateString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      models: [...defaultModels],
      messages: []
    };

    StorageService.saveSession(newSession);
    StorageService.setCurrentSessionId(newSession.id);
    
    setCurrentSession(newSession);
    setCurrentSessionId(newSession.id);
    setSessions(prev => [newSession, ...prev]);
  };

  const selectSession = (sessionId: string) => {
    const session = StorageService.getSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setCurrentSessionId(sessionId);
      StorageService.setCurrentSessionId(sessionId);
    }
  };

  const deleteSession = (sessionId: string) => {
    StorageService.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      setCurrentSession(null);
      setCurrentSessionId(null);
      StorageService.clearCurrentSessionId();
    }
  };

  const updateModel = (modelId: string, updates: Partial<LLMModel>) => {
    if (!currentSession) return;

    const updatedModels = currentSession.models.map(model =>
      model.id === modelId ? { ...model, ...updates } : model
    );

    const updatedSession = {
      ...currentSession,
      models: updatedModels,
      updatedAt: new Date()
    };

    setCurrentSession(updatedSession);
    StorageService.saveSession(updatedSession);
    setSessions(prev => 
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    );
  };

  const sendMessage = async (messageContent: string) => {
    if (!currentSession || isLoading) return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...currentSession.messages, userMessage];

    // Get responses from active models
    try {
      const modelResponses = await LLMService.sendMessage(
        currentSession.models,
        updatedMessages,
        messageContent
      );

      const allMessages = [...updatedMessages, ...modelResponses];
      
      const updatedSession = {
        ...currentSession,
        messages: allMessages,
        updatedAt: new Date(),
        title: currentSession.messages.length === 0 
          ? messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '')
          : currentSession.title
      };

      setCurrentSession(updatedSession);
      StorageService.saveSession(updatedSession);
      setSessions(prev => 
        prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create initial session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !currentSession) {
      createNewSession();
    }
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewSession={createNewSession}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1">
          {currentSession ? (
            <ChatArea
              messages={currentSession.messages}
              models={currentSession.models}
              onSendMessage={sendMessage}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  No Session Selected
                </h2>
                <p className="text-gray-500">Create a new conversation to get started</p>
              </div>
            </div>
          )}
        </div>
        
        {currentSession && (
          <ModelPanel
            models={currentSession.models}
            onUpdateModel={updateModel}
          />
        )}
      </div>
    </div>
  );
}

export default App;