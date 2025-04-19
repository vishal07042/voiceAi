import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get('/api/verify-token/', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.valid) {
              setUser(response.data.user);
            } else {
              localStorage.removeItem('token');
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, retryCount = 0) => {
    try {
      const response = await axios.post('/api/login/', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);

      if (error.message === 'Network Error' && retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return login(email, password, retryCount + 1);
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               error.message === 'Network Error' ? 
               'Unable to connect to server. Please check your internet connection.' : 
               'Login failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 