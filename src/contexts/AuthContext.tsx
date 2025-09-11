import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { navigate } from "@/navigation/RootNavigation";

type Credentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  token: string | null;
  loading: boolean;
  loadingForm: boolean;
  login: (creds: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type Props = { children: ReactNode };

const TOKEN_KEY = "@TOKEN";

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
        }
      } catch (err) {
        console.warn("Erro carregando token:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password }: Credentials) => {
    setLoadingForm(true);
    try {
      const { data } = await api.post<{ token: string }>("/login", {
        email,
        password,
      });

      const token = data.token;

      if (!token) throw new Error("Resposta inválida do servidor");

      await AsyncStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);

      navigate("BottomRoutes", { screen: "Home" });
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || "Erro ao logar";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const logout = async () => {
    setLoadingForm(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      delete api.defaults.headers.common["Authorization"];
      navigate("Login");
    } catch (err) {
      console.warn("Erro no logout:", err);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        loadingForm,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
