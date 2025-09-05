import axios from "axios";
import { Platform } from "react-native";

const HOST =
  Platform.OS === "android"
    ? "192.168.1.107"
    : "localhost";

export const API_BASE_URL = `http://${HOST}:3000`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
