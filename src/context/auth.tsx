import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "todo_demo_users";
const AUTH_KEY = "todo_demo_auth";

function readUsers(): Array<{ id: string; name: string; email: string; password: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveUsers(users: Array<{ id: string; name: string; email: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = async (email: string, password: string) => {
    // mimic async
    await new Promise((r) => setTimeout(r, 300));
    const users = readUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return Promise.reject(new Error("Invalid email or password"));
    }
    const u: User = { id: found.id, name: found.name, email: found.email };
    setUser(u);
    return Promise.resolve();
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      return Promise.reject(new Error("Email already registered"));
    }
    const id = Math.random().toString(36).slice(2, 9); // simple id for demo
    users.push({ id, name, email, password });
    saveUsers(users);
    const u: User = { id, name, email };
    setUser(u);
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
