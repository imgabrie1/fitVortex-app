import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { navigate } from "@/navigation/RootNavigation";
import {
  UserContextData,
  iDataRegister,
  Credentials,
  iUserResponse,
  iResponse,
  MicroCycle,
  CycleItems,
  Set,
  WorkoutExercise,
  WorkoutExerciseWithSets,
  WorkoutWithSets,
  MacroCycle,
  iCreateMacroCycle,
  iCreateMicroCycle,
} from "./interface";
import { AxiosError } from "axios";
import { Alert } from "react-native";

export const UserContext = createContext<UserContextData>(
  {} as UserContextData
);

type Props = { children: ReactNode };

const TOKEN_KEY = "@TOKEN";
const USER_KEY = "@USER";

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<iUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.warn("Erro carregando dados:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const requireUser = () => {
    if (!user) throw new Error("Usuário não autenticado");
    return user;
  };

  const assertUser = () => {
    if (!user) throw new Error("Usuário não autenticado");
  };

  const registerUser = async (data: iDataRegister): Promise<void> => {
    setLoadingForm(true);
    try {
      await api.post("/user", data);
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
      const { data } = await api.post<iResponse>("/login", {
        email,
        password,
      });

      const { token, user } = data;

      if (!token || !user) throw new Error("Resposta inválida do servidor");

      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

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
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      navigate("Login");
    } catch (err) {
      console.warn("Erro no logout:", err);
    } finally {
      setLoadingForm(false);
    }
  };

  const getAllWorkouts = async (): Promise<WorkoutWithSets[]> => {
    const currentUser = requireUser();

    try {
      const { data } = await api.get(`/workout/${currentUser.id}`);

      const workouts: WorkoutWithSets[] = data.data.flatMap(
        (microCycle: MicroCycle) =>
          microCycle.cycleItems.map((cycleItem: CycleItems) => {
            const workout = cycleItem.workout;

            const normalizedSets = cycleItem.sets.map((set: Set) => ({
              ...set,
              exerciseId:
                (set as any).exercise?.id ?? (set as any).exerciseId ?? null,
            }));

            const workoutExercisesWithSets: WorkoutExerciseWithSets[] = (
              workout.workoutExercises || []
            ).map((we: WorkoutExercise) => ({
              ...we,
              sets: normalizedSets.filter((st: any) => {
                const setExerciseId =
                  (st as any).exercise?.id ?? (st as any).exerciseId;
                return setExerciseId === we.exercise.id;
              }),
            }));

            return {
              ...workout,
              createdAt: cycleItem.createdAt,
              workoutExercises: workoutExercisesWithSets,
            };
          })
      );

      return workouts;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar treinos";
      throw new Error(String(msg));
    }
  };

  const getAllMacroCycles = async (): Promise<MacroCycle[]> => {
    assertUser();

    try {
      const { data } = await api.get("/macrocycle");

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Macros Ciclo";
      throw new Error(String(msg));
    }
  };

  const getMacroCycleByID = async (macroID: string): Promise<MacroCycle> => {
    assertUser();

    try {
      const { data } = await api.get(`/macrocycle/${macroID}`);

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Macro Ciclo";
      throw new Error(String(msg));
    }
  };

  const getMicroCycleByID = async (microID: string): Promise<MicroCycle> => {
    assertUser();

    try {
      const { data } = await api.get(`/microcycle/${microID}`);

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Micro Ciclo";
      throw new Error(String(msg));
    }
  };

  const getAllMicroCycles = async (): Promise<MicroCycle[]> => {
    assertUser();

    try {
      const { data } = await api.get("/microcycle");

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Macros Ciclo";
      throw new Error(String(msg));
    }
  };

  const toWorkOut = async (
    microID: string,
    workoutID: string,
    workoutData: any
  ): Promise<any> => {
    assertUser();
    try {
      const { data } = await api.patch(
        `microcycle/${microID}/workouts/${workoutID}/record`,
        workoutData
      );
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      let errorData = currentError?.response?.data;

      if (typeof errorData === "object" && errorData !== null) {
        errorData = JSON.stringify(errorData);
      }

      const msg =
        errorData || err?.message || "Erro ao registrar o treino. Desculpa :(";
      throw new Error(String(msg));
    }
  };

  const createMacroCycle = async (payload: any): Promise<iCreateMacroCycle> => {
    assertUser();
    try {
      const { data } = await api.post("/macrocycle", payload);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao criar Macro Ciclo";
      throw new Error(String(msg));
    }
  };

  const createMicroCycle = async (payload: any): Promise<iCreateMicroCycle> => {
    assertUser();
    try {
      const { data } = await api.post("/microcycle", payload);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao criar Micro Ciclo";
      throw new Error(String(msg));
    }
  };

  const addMicroInMacro = async (
    macroID: string,
    microID: string
  ): Promise<any> => {
    assertUser();
    try {
      await api.patch(`/macrocycle/${macroID}/micro/${microID}`);
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao adicionar micro no macro";
      throw new Error(String(msg));
    }
  };

  const deleteCycles = async (cycle: string, cycleID: string) => {
    try {
      await api.delete(`/${cycle}/${cycleID}`)
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao deletar Ciclo";
      throw new Error(String(msg));
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        loading,
        loadingForm,
        login,
        registerUser,
        logout,
        getAllWorkouts,
        getAllMacroCycles,
        getAllMicroCycles,
        getMacroCycleByID,
        getMicroCycleByID,
        toWorkOut,
        createMacroCycle,
        createMicroCycle,
        addMicroInMacro,
        deleteCycles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
