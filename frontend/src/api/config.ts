import { Platform } from "react-native";

/**
 * Returns the default API base URL based on execution environment.
 * Android Emulator uses 10.0.2.2 to reach host localhost.
 * iOS Simulator and Web use localhost directly.
 */
const getDefaultBaseUrl = (): string => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return "http://localhost:5000/api";
};

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || getDefaultBaseUrl(),
  TIMEOUT_MS: 10000,
};
