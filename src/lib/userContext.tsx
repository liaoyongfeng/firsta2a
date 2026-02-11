'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface UserInfo {
  userId: string;
  name: string;
  avatar?: string;
  email?: string;
  bio?: string;
  selfIntroduction?: string;
}

interface UserContextType {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/secondme/user/info');
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setUserState({
            userId: result.data.userId,
            name: result.data.name,
            avatar: result.data.avatar,
            email: result.data.email,
            bio: result.data.bio,
            selfIntroduction: result.data.selfIntroduction,
          });
        } else {
          setUserState(null);
        }
      } else if (response.status === 401) {
        // 未登录是正常状态，不是错误
        setUserState(null);
      } else {
        setUserState(null);
        setError(`服务器错误 (${response.status})`);
      }
    } catch (err) {
      console.error('Failed to refresh user info:', err);
      setUserState(null);
      setError('无法连接到服务器，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 组件挂载时自动获取用户信息
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);                           

  const setUser = useCallback((newUser: UserInfo | null) => {
    setUserState(newUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    setError(null);
  }, []);

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated,
        setUser,
        clearUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
