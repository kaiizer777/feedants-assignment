import axios, { AxiosInstance, AxiosError } from "axios";
import { API_CONFIG } from "./config";

/**
 * Pre-configured Axios instance for backend communications
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for logging/auth tokens in the future
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMsg =
      (error.response?.data as { error?: string })?.error ||
      error.message ||
      "Unknown network error occurred";
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
