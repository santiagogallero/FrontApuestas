import { useCallback } from 'react';
import { apiLogin, apiGetMe } from '../api';
import { useAuthContext } from '../context/AuthContext';
import type { CurrentUser } from '../types/auth';

export function useAuth() {
  const { token, currentUser, isLoading, onLoginSuccess, onLogout } = useAuthContext();

  const login = useCallback(async (email: string, password: string): Promise<CurrentUser> => {
    const data = await apiLogin(email, password);
    const user = await apiGetMe();
    onLoginSuccess(data.token, user);
    return user;
  }, [onLoginSuccess]);

  const logout = useCallback(async () => {
    await onLogout();
  }, [onLogout]);

  return { token, currentUser, isLoading, login, logout, isAuthenticated: !!token };
}
