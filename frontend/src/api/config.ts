import { Platform } from "react-native";

/**
 * Returns the default API base URL based on execution environment.
 * Android Emulator uses 10.0.2.2 to reach host localhost.
 * iOS Simulator and Web use localhost directly.
 */
const getDefaultBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  // If accessed from a mobile browser on LAN (e.g. http://10.x.x.x:8082), use that IP for API
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:5000/api`;
    }
  }

  if (envUrl) {
    return envUrl;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://localhost:5000/api";
};

export const API_CONFIG = {
  BASE_URL: getDefaultBaseUrl(),
  TIMEOUT_MS: 10000,
};
