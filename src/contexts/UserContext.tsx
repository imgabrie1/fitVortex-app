import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { navigate } from "@/navigation/RootNavigation";
import { UserContextData, iDataRegister, Credentials } from "./interface";
import { AxiosError } from "axios";
import { Alert } from "react-native";


export const UserContext = createContext<UserContextData>({} as UserContextData);

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

  const registerUser = async (data: iDataRegister): Promise<void> => {
    setLoadingForm(true);
    try {
      await api.post("/user", data);

      // Alert.alert("Sucesso", "Cadastro efetuado com sucesso");

      navigate("BottomRoutes", { screen: "Home" });
    } catch (err) {
      const currentError = err as AxiosError;

      const message =
        (currentError.response?.data as string) || "Algo deu errado!";

      Alert.alert("Erro!", message);
    } finally {
      setLoadingForm(false);
    }
  };

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
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data || err?.message || "Erro ao logar";
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
    <UserContext.Provider
      value={{
        token,
        loading,
        loadingForm,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
