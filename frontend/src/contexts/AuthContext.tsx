import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = 'https://meetup-network-1.preview.emergentagent.com';

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      // Handle session_id from URL fragment FIRST
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const sessionId = params.get('session_id');
      
      if (sessionId) {
        console.log('Processing session_id:', sessionId);
        setIsLoading(true);
        try {
          const response = await fetch(`${backendUrl}/api/auth/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-ID': sessionId
            },
            credentials: 'include'
          });

          console.log('Session response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('Session data:', data);
            if (data.success) {
              setUser(data.data.user);
              console.log('User set:', data.data.user);
              // Clean URL fragment
              window.history.replaceState({}, document.title, window.location.pathname);
              setIsLoading(false);
              return; // Don't check auth status if we just processed session
            }
          } else {
            console.error('Session processing failed:', response.status);
          }
        } catch (error) {
          console.error('Error processing session:', error);
        }
        setIsLoading(false);
      } else {
        // Only check existing auth status if no session_id
        checkAuthStatus();
      }
    };

    initializeAuth();
  }, [backendUrl]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const redirectUrl = `${window.location.origin}/`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};