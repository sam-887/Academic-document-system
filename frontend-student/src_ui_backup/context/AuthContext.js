import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
const TOKEN_KEY = 'student_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.user?.role === 'student') {
          setUser(res.data.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    if (res.data.user?.role !== 'student') {
      throw {
        response: {
          data: {
            message: 'This portal is for student accounts only.',
          },
        },
      };
    }

    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);

    if (res.data.user?.role !== 'student') {
      throw {
        response: {
          data: {
            message: 'Only student accounts can register here.',
          },
        },
      };
    }

    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
