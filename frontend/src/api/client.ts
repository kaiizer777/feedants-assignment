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
    const data = error.response?.data as any;
    const errorObj = data?.error;
    const errorMsg =
      (typeof errorObj === "object" ? errorObj?.message : errorObj) ||
      data?.message ||
      error.message ||
      "Unknown network error occurred";

    const enhancedError: any = new Error(errorMsg);
    enhancedError.code =
      (typeof errorObj === "object" ? errorObj?.code : undefined) ||
      error.code;
    enhancedError.status = error.response?.status;
    enhancedError.details = typeof errorObj === "object" ? errorObj?.details : undefined;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
