import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getErrorMessage } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("sevanear_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        if (!ignore) setUser(data.user);
      } catch {
        if (!ignore) {
          localStorage.removeItem("sevanear_token");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login({ email, password }) {
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem("sevanear_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, "Invalid email or password.") };
    }
  }

  async function register({ name, email, password }) {
    try {
      await authApi.register({ name, email, password });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, "Could not create your account.") };
    }
  }

  function updateUser(patch) {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }

  function logout() {
    localStorage.removeItem("sevanear_token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
