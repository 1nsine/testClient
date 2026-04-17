import axios from "axios";
import { env } from "./env";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
});

// Добавляем interceptor для всех запросов
api.interceptors.request.use((config) => {
  const lang = localStorage.getItem("i18nextLng") || "ru";
  if (!config.params) config.params = {};
  config.headers["lang"] = lang;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
