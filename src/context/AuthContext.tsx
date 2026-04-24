import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (payload: any) => Promise<User>;
  logout: () => void;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    authService.me()
      .then(({ data }) => setUser(data.data))
      .catch(() => {
        // Token invalid or expired — clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * login — calls the API, stores tokens, sets user in state.
   * Returns the user so the caller can decide where to navigate.
   */
  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    return data.data.user;
  };

  /**
   * signup — calls the API, stores tokens, sets user in state.
   * Returns the user so the caller can decide where to navigate.
   * New users always have onboardingCompleted = false so the caller
   * should redirect to /onboarding.
   */
  const signup = async (payload: any): Promise<User> => {
    const { data } = await authService.signup(payload);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const ctxValue: AuthContextType = { user, loading, login, signup, logout, setUser };

  return (
    <AuthContext.Provider value={ctxValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};