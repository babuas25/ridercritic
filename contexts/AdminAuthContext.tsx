"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AdminAuthContextType {
  admin: any;
  isAdmin: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for token and fetch admin info
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.is_superuser) setAdmin(data);
          else setAdmin(null);
          setLoading(false);
        });
    } else {
      setAdmin(null);
      setLoading(false);
    }
  }, []);

  // Call this after successful login
  const login = (token: string) => {
    localStorage.setItem("admin_token", token);
    // Fetch admin info and update state
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.is_superuser) setAdmin(data);
        else setAdmin(null);
      });
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAdmin: !!admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
} 