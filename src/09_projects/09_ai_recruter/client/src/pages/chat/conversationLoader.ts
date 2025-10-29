import { apiClient } from "@/services/apiClient";

export const conversationLoader = async () => {
  const { data: res, error } = await apiClient.GET("/api/conversations");
  if (error) return [];
  return res;
};

export default conversationLoader;
