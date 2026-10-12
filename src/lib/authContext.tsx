'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { getAllUsers, getFromStorage, saveToStorage } from './store';
import { INITIAL_USERS } from './initialData';

interface AuthContextType {
  currentUser: User | null;
  login: (identifierOrUsername: string, password?: string) => boolean;
  quickSwitch: (userId: string) => void;
  logout: () => void;
  users: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedUsers = getAllUsers();
    setUsers(loadedUsers);

    const savedUser = getFromStorage<User | null>('siakad_current_user_v1', null);
    if (savedUser) {
      // Find latest user data from users list
      const matched = loadedUsers.find(u => u.id === savedUser.id) || savedUser;
      setCurrentUser(matched);
    } else {
      // Default to Budi Santoso (mahasiswa) for immediate interactive experience if none selected
      setCurrentUser(loadedUsers[0] || INITIAL_USERS[0]);
    }
    setIsLoaded(true);
  }, []);

  const refreshUsers = () => {
    const updated = getAllUsers();
    setUsers(updated);
    if (currentUser) {
      const current = updated.find(u => u.id === currentUser.id);
      if (current) setCurrentUser(current);
    }
  };

  const login = (identifierOrUsername: string, password?: string): boolean => {
    const currentUsers = getAllUsers();
    const query = identifierOrUsername.trim().toLowerCase();
    const found = currentUsers.find(
      u => u.username.toLowerCase() === query || 
           u.identifier.toLowerCase() === query || 
           u.email.toLowerCase() === query
    );

    if (found) {
      if (password && found.password && found.password !== password) {
        return false;
      }
      setCurrentUser(found);
      saveToStorage('siakad_current_user_v1', found);
      return true;
    }
    return false;
  };

  const quickSwitch = (userId: string) => {
    const currentUsers = getAllUsers();
    const found = currentUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      saveToStorage('siakad_current_user_v1', found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('siakad_current_user_v1');
    }
  };

  if (!isLoaded) {
    return null; // Prevents hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, quickSwitch, logout, users, refreshUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
