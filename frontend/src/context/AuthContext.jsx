import { createContext, useState, useEffect, useCallback } from "react";
import { getMe, loginRequest, signupRequest, logoutRequest } from "../api/authApi.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session state from the cookie (required because we use
  // cookie sessions, not localStorage).
  useEffect(() => {
    getMe()
      .then((res) => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginRequest(credentials);
    setCurrentUser(res.data.user);
    return res.data;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await signupRequest(data);
    setCurrentUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
