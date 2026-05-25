import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiGetMe, loadToken, clearToken } from '../api';
import type { CurrentUser } from '../types/auth';

interface AuthContextValue {
  token: string | null;
  currentUser: CurrentUser | null;
  isLoading: boolean;
  onLoginSuccess: (token: string, user: CurrentUser) => void;
  onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  currentUser: null,
  isLoading: true,
  onLoginSuccess: () => {},
  onLogout: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadToken().then(async (t) => {
      if (!t) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const user = await apiGetMe();
        if (!cancelled) {
          setToken(t);
          setCurrentUser(user);
        }
      } catch {
        await clearToken();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const onLoginSuccess = useCallback((newToken: string, user: CurrentUser) => {
    setToken(newToken);
    setCurrentUser(user);
  }, []);

  const onLogout = useCallback(async () => {
    await clearToken();
    setToken(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, currentUser, isLoading, onLoginSuccess, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
