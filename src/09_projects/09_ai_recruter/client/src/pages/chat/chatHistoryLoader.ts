import { apiClient } from "@/services/apiClient";
import { type NonIndexRouteObject } from "react-router";


export const chatHistoryLoader: NonIndexRouteObject["loader"] = async ({
  params,
}) => {

  if(params.conversationId){
      const {data:res, error} = await apiClient.GET("/api/history/{conversationId}",{
        params:{
          path:{
            conversationId: params.conversationId
          }
        }
      })
      if(error)
        return []
      return res
  }
  return [];
};

export default chatHistoryLoader;
