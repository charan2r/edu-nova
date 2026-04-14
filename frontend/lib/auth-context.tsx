"use client";

import { createContext, useContext, type ReactNode } from "react";

export type UserRole = "student" | "instructor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Implement authentication logic with backend API

  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        login: async () => false,
        register: async () => false,
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
