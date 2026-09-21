/**
 * Backend health check response contract
 */
export interface HealthResponse {
  status: "ok" | string;
  timestamp: string;
  database: "connected" | "disconnected" | "connecting" | "disconnecting" | string;
}

/**
 * Standard API error structure
 */
export interface ApiErrorPayload {
  success: boolean;
  error: string;
  stack?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}
