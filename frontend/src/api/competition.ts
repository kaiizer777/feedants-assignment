import { apiClient } from "./client";
import { Competition, ApiResponse } from "../types/competition";

export const getCompetitionDetails = async (
  id: string,
  authToken?: string
): Promise<Competition> => {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers["x-auth-token"] = authToken;
  }

  const response = await apiClient.get<ApiResponse<Competition>>(
    `/competitions/${id}`,
    { headers }
  );

  return response.data.data;
};

export const registerForCompetition = async (
  id: string,
  authToken: string
): Promise<any> => {
  const headers = {
    "x-auth-token": authToken,
  };

  const response = await apiClient.post<ApiResponse<any>>(
    `/competitions/${id}/register`,
    {},
    { headers }
  );

  return response.data.data;
};

export const submitCompetitionEntry = async (
  id: string,
  authToken: string,
  payload: { content?: string; mediaUrl?: string }
): Promise<any> => {
  const headers = {
    "x-auth-token": authToken,
  };

  const response = await apiClient.post<ApiResponse<any>>(
    `/competitions/${id}/submission`,
    payload,
    { headers }
  );

  return response.data.data;
};
