import { useState, useEffect, useCallback } from "react";
import { getHealthCheck } from "../api/health";
import { HealthResponse } from "../types";

export interface UseHealthCheckResult {
  data: HealthResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHealthCheck = (): UseHealthCheckResult => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHealthCheck();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
};
