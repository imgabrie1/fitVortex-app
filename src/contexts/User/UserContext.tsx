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
  Exercise,
  iCreateWorkout,
  iPatchWorkout,
  ExerciseInCreateAndPatch,
  ExerciseResponse,
  newMacroWithAI,
  WorkoutResponse,
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
  const [volumes, setVolumes] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          await getTotalVolume(parsedUser.id);
        }
      } catch (err) {
        console.warn("Erro carregando dados:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTotalVolume = async (userId: number) => {
    try {
      const { data } = await api.get(`/workout/${userId}`);
      let totalExecutedSeries = 0;
      data.data.forEach((microCycle: MicroCycle) => {
        microCycle.cycleItems.forEach((cycleItem: CycleItems) => {
          totalExecutedSeries += cycleItem.sets.length;
        });
      });
      setVolumes(totalExecutedSeries);
    } catch (error) {
      console.warn("Erro ao buscar o volume total:", error);
    }
  };

  //      -------------- Auth --------------
  const requireUser = () => {
    if (!user) throw new Error("Usuário não autenticado");
    return user;
  };

  const assertUser = () => {
    if (!user) throw new Error("Usuário não autenticado");
  };

  //        -------------- USER --------------
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
      await getTotalVolume(user.id);

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

  //        -------------- MACRO --------------
  const getAllMacroCycles = async (): Promise<MacroCycle[]> => {
    assertUser();

    try {
      const { data } = await api.get("/macrocycle");

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      if (currentError.response?.status === 404) {
        return [];
      }
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

  const createMacroCycle = async (payload: any): Promise<iCreateMacroCycle> => {
    assertUser();
    setLoadingForm(true);
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
    } finally {
      setLoadingForm(false);
    }
  };

  const ajdustVolume = async (macroID: string, payload: newMacroWithAI) => {
    assertUser();
    setLoadingForm(true);
    try {
      const data = await api.post(
        `/macrocycle/${macroID}/generate-next`,
        payload
      );
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao ajustar o volume";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const deleteCycles = async (cycle: string, cycleID: string) => {
    assertUser();
    setLoadingForm(true);
    try {
      await api.delete(`/${cycle}/${cycleID}`);
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data || err?.message || "Erro ao deletar Ciclo";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const editCycles = async (cycle: string, cycleID: string, payload: any) => {
    assertUser();
    setLoadingForm(true);
    try {
      const { data } = await api.patch(`/${cycle}/${cycleID}`, payload);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data || err?.message || "Erro ao Editar Ciclo";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  //        -------------- MICRO --------------
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
      if (currentError.response?.status === 404) {
        return [];
      }
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Micros Ciclo";
      throw new Error(String(msg));
    }
  };

  const createMicroCycle = async (payload: any): Promise<iCreateMicroCycle> => {
    assertUser();
    setLoadingForm(true);
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
    } finally {
      setLoadingForm(false);
    }
  };

  const addMicroInMacro = async (
    macroID: string,
    microID: string
  ): Promise<any> => {
    assertUser();
    setLoadingForm(true);
    try {
      await api.patch(`/macrocycle/${macroID}/micro/${microID}`);
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao adicionar micro no macro";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const updateWorkoutOrder = async (
    microCycleID: string,
    orderedIds: string[]
  ) => {
    assertUser();
    try {
      await api.patch(`/microcycle/${microCycleID}/reorder`, { orderedIds });
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao reordenar treinos";
      throw new Error(String(msg));
    }
  };

  //        -------------- EXERCISE --------------
  const getAllExercise = async (
    page?: number,
    limit?: number,
    filters?: string
  ): Promise<ExerciseResponse> => {
    assertUser();

    try {
      let url = "/exercise";

      const queryParams: string[] = [];

      if (page !== undefined && limit !== undefined) {
        queryParams.push(`page=${page}`, `limit=${limit}`);
      }

      if (filters) {
        queryParams.push(filters);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const { data } = await api.get(url);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      if (currentError.response?.status === 404) {
        return { data: [], page: 0, lastPage: 0, total: 0, limit: 0 };
      }
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Exercícios";
      throw new Error(String(msg));
    }
  };

  //        -------------- WORKOUT --------------
  const getAllWorkouts = async (
    page?: number,
    limit?: number
  ): Promise<WorkoutResponse> => {
    const currentUser = requireUser();

    try {
      let url = `/workout/${currentUser.id}`;

      const queryParams: string[] = [];

      if (page !== undefined && limit !== undefined) {
        queryParams.push(`page=${page}`, `limit=${limit}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const { data } = await api.get(url);

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

      return { ...data, data: workouts };
    } catch (err: any) {
      const currentError = err as AxiosError;
      if (currentError.response?.status === 404) {
        return { data: [], page: 1, lastPage: 1, total: 0, limit: 10 };
      }
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao carregar Treinos";
      throw new Error(String(msg));
    }
  };

  const refreshWorkoutsData = async () => {
    try {
      if (user) {
        await getTotalVolume(user.id);
      }
    } catch (error) {
      console.warn("Erro ao atualizar dados:", error);
    }
  };

  const saveWorkout = async (
    microID: string,
    workoutID: string,
    workoutData: any,
    isEdit: boolean = false
  ): Promise<any> => {
    assertUser();
    setLoadingForm(true);
    try {
      const endpoint = isEdit
        ? `microcycle/${microID}/workouts/${workoutID}/edit`
        : `microcycle/${microID}/workouts/${workoutID}/record`;

      const { data } = await api.patch(endpoint, workoutData);

      await refreshWorkoutsData();

      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      let errorData = currentError?.response?.data;

      if (typeof errorData === "object" && errorData !== null) {
        errorData = JSON.stringify(errorData);
      }

      const msg =
        errorData || err?.message || "Erro ao salvar o treino. Desculpa :(";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const createWorkout = async (payload: iCreateWorkout): Promise<any> => {
    assertUser();
    setLoadingForm(true);
    try {
      const { data } = await api.post("/workout", payload);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data || err?.message || "Erro ao criar treino";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const addWorkoutInMicro = async (
    microID: string,
    workoutID: string
  ): Promise<any> => {
    assertUser();
    setLoadingForm(true);
    try {
      await api.patch(`/microcycle/${microID}/workouts/${workoutID}`);
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao adicionar treino no micro";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const addExerciseInWorkout = async (
    payload: ExerciseInCreateAndPatch,
    workoutID: string
  ) => {
    assertUser();
    setLoadingForm(true);
    try {
      const { data } = await api.patch(`workout/${workoutID}`, payload);
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao adicionar exercício no treino";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  const skipWorkout = async (
    microID: string,
    workoutID: string,
    workoutData: any
  ): Promise<any> => {
    assertUser();
    setLoadingForm(true);
    try {
      const { data } = await api.patch(
        `microcycle/${microID}/workouts/${workoutID}/skip`,
        workoutData
      );

      await refreshWorkoutsData();
      return data;
    } catch (err: any) {
      const currentError = err as AxiosError;
      let errorData = currentError?.response?.data;

      if (typeof errorData === "object" && errorData !== null) {
        errorData = JSON.stringify(errorData);
      }

      const msg =
        errorData || err?.message || "Erro ao salvar o treino. Desculpa :(";
      throw new Error(String(msg));
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        volumes,
        refreshWorkoutsData,
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
        saveWorkout,
        createMacroCycle,
        createMicroCycle,
        addMicroInMacro,
        deleteCycles,
        getAllExercise,
        createWorkout,
        addWorkoutInMicro,
        addExerciseInWorkout,
        updateWorkoutOrder,
        ajdustVolume,
        editCycles,
        skipWorkout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
