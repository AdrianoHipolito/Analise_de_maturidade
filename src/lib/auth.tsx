import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definir o tipo de usuário
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Definir o tipo do contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provedor de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error loading user session:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromSession();
  }, []);

  // Função de login
  async function login(email: string, password: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  // Função de logout
  async function logout() {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Função de registro
  async function register(name: string, email: string, password: string) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  // Valor do contexto
  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
