import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const TOKEN_STORAGE = "@fitvortex:token";
const REFRESH_TOKEN_STORAGE = "@fitvortex:refresh-token";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await AsyncStorage.getItem(
            REFRESH_TOKEN_STORAGE
          );

          if (!refreshToken) {
            // TODO: Chamar função de logout do UserContext aqui
            console.error("No refresh token found, logging out.");
            // Ex: authContext.signOut();
            return Promise.reject(error);
          }

          // Assumindo que seu backend tem um endpoint para refresh de token
          const response = await axios.post(
            `${API_BASE_URL}/sessions/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );

          const { token, refresh_token } = response.data;

          await AsyncStorage.setItem(TOKEN_STORAGE, token);
          await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE, refresh_token);

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          failedRequestsQueue.forEach((request) => request.onSuccess(token));
          failedRequestsQueue = [];
        } catch (refreshError: any) {
          failedRequestsQueue.forEach((request) =>
            request.onFailure(refreshError)
          );
          failedRequestsQueue = [];

          console.error("Refresh token failed, logging out.", refreshError);
        } finally {
          isRefreshing = false;
        }
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
