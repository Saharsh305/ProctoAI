import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context-value';
import { getMe } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) return;
    let active = true;
    getMe(token)
      .then((u) => { if (active) { setUser(u); setLoading(false); } })
      .catch(() => {
        if (active) {
          localStorage.removeItem('token');
          setToken(null);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [token]);

  const loginUser = (accessToken) => {
    localStorage.setItem('token', accessToken);
    setLoading(true);
    setToken(accessToken);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
