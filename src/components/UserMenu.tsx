import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <User className="w-6 h-6" />
        )}
        <span className="text-sm">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}