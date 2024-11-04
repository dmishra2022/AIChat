import React from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { generateResponse } from './utils/mockApi';
import type { Message, Chat } from './types/chat';

function ChatApp() {
  const { user, loading } = useAuth();
  const [chats, setChats] = React.useState<Chat[]>(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChat, setCurrentChat] = React.useState<Chat | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChat(newChat);
  };

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    updateChat(currentChat.id, {
      messages: updatedMessages,
      title: updatedMessages.length === 1 ? content.slice(0, 30) : currentChat.title,
    });

    setIsLoading(true);
    try {
      const responseContent = await generateResponse(content);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      updateChat(currentChat.id, {
        messages: [...updatedMessages, assistantMessage],
      });
    } catch (error) {
      console.error('Failed to generate response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onNewChat={createNewChat}
        onSelectChat={setCurrentChat}
      />
      
      <main className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {currentChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="py-8 bg-gray-50">
                  <div className="max-w-3xl mx-auto px-4">
                    <div className="flex gap-6">
                      <div className="w-8" />
                      <div className="flex-1">
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
              <p className="text-gray-600 mb-8">Start a new chat or select an existing one.</p>
              <button
                onClick={createNewChat}
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatApp />
    </AuthProvider>
  );
}

export default App;