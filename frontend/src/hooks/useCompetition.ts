import { useState, useEffect, useCallback } from "react";
import { Competition, MockUser } from "../types/competition";
import {
  getCompetitionDetails,
  getLatestCompetition,
  registerForCompetition,
  submitCompetitionEntry,
} from "../api/competition";
import { MOCK_USERS } from "../constants/mockUsers";

interface UseCompetitionReturn {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  activeUser: MockUser;
  setActiveUser: (user: MockUser) => void;
  refetch: () => Promise<void>;
  register: () => Promise<{ success: boolean; message?: string; error?: string }>;
  submitEntry: (payload: {
    content?: string;
    mediaUrl?: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  isActionLoading: boolean;
}

export const useCompetition = (
  competitionId?: string
): UseCompetitionReturn => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<MockUser>(MOCK_USERS[0]);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const fetchDetails = useCallback(
    async (targetId?: string) => {
      try {
        setLoading(true);
        setError(null);
        setErrorCode(null);
        const resolvedId =
          targetId ||
          (competitionId && competitionId.trim() ? competitionId.trim() : undefined);
        const data = resolvedId
          ? await getCompetitionDetails(resolvedId, activeUser.token)
          : await getLatestCompetition(activeUser.token);
        setCompetition(data);
      } catch (err: any) {
        console.error("Failed to load competition details:", err);
        setError(err.message || "Failed to load competition");
        setErrorCode(err.code || "LOAD_ERROR");
      } finally {
        setLoading(false);
      }
    },
    [competitionId, activeUser.token]
  );

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const register = async (): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => {
    if (!competition) {
      return { success: false, error: "Competition data not loaded" };
    }

    try {
      setIsActionLoading(true);
      const res = await registerForCompetition(competition._id, activeUser.token);
      // Immediately refetch to refresh composite state cleanly
      await fetchDetails(competition._id);
      return {
        success: true,
        message: res.message || "Successfully registered for competition!",
      };
    } catch (err: any) {
      console.error("Registration error:", err);
      const msg = err.message || "Registration failed";
      // Even on error, refetch state in case spots changed concurrently
      fetchDetails(competition._id).catch(() => {});
      return {
        success: false,
        error: msg,
      };
    } finally {
      setIsActionLoading(false);
    }
  };

  const submitEntry = async (payload: {
    content?: string;
    mediaUrl?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => {
    if (!competition) {
      return { success: false, error: "Competition data not loaded" };
    }

    try {
      setIsActionLoading(true);
      const res = await submitCompetitionEntry(
        competition._id,
        activeUser.token,
        payload
      );
      // Immediately refetch to sync submitted status
      await fetchDetails(competition._id);
      return {
        success: true,
        message: res.message || "Submission successfully uploaded!",
      };
    } catch (err: any) {
      console.error("Submission error:", err);
      const msg = err.message || "Submission failed";
      return {
        success: false,
        error: msg,
      };
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    competition,
    loading,
    error,
    errorCode,
    activeUser,
    setActiveUser,
    refetch: () => fetchDetails(competition?._id),
    register,
    submitEntry,
    isActionLoading,
  };
};

