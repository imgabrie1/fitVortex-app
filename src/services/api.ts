import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "@/navigation/RootNavigation";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const TOKEN_STORAGE = "@fitvortex:token";
export const USER_STORAGE = "@fitvortex:user";
export const REFRESH_TOKEN_STORAGE = "@fitvortex:refreshToken";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}[] = [];

let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const handleUnauthorized = async () => {
  if (logoutCallback) {
    logoutCallback();
    return;
  }

  await AsyncStorage.multiRemove([
    TOKEN_STORAGE,
    USER_STORAGE,
    REFRESH_TOKEN_STORAGE,
  ]);
  delete api.defaults.headers.common["Authorization"];
  navigate("Login");
};

const processTokenRefresh = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/login/refresh-token`,
      {
        refresh_token: refreshToken,
      }
    );

    const { token, refresh_token } = response.data;

    await AsyncStorage.setItem(TOKEN_STORAGE, token);
    if (refresh_token) {
      await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE, refresh_token);
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    failedRequestsQueue.forEach((request) => request.onSuccess(token));
    failedRequestsQueue = [];
  } catch (refreshError: any) {
    failedRequestsQueue.forEach((request) => request.onFailure(refreshError));
    failedRequestsQueue = [];

    console.error("Refresh token failed, logging out.", refreshError);
    await handleUnauthorized();
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;
        processTokenRefresh();
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            if (originalConfig!.headers) {
              originalConfig!.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(api(originalConfig!));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE);
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
