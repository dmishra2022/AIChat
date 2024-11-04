import React from 'react';
import { PlusCircle, MessageSquare, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import type { Chat } from '../types/chat';

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
}

export function Sidebar({ chats, currentChat, onNewChat, onSelectChat }: SidebarProps) {
  return (
    <div className="flex h-full w-[260px] flex-col bg-gray-900 text-gray-200">
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 rounded-md border border-white/20 p-3 m-2 hover:bg-gray-700 transition-colors"
      >
        <PlusCircle className="h-5 w-5" />
        New chat
      </button>

      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              chat.id === currentChat?.id
                ? 'bg-gray-800'
                : 'hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {chat.title}
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-white/20 p-2 space-y-2">
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-700 transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <UserMenu />
      </div>
    </div>
  );
}