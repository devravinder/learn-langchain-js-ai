import { API_URL } from "@/constants";
import { apiRequest } from "@/services/apiClient";
import { type NonIndexRouteObject } from "react-router";


export const chatHistoryLoader: NonIndexRouteObject["loader"] = async ({
  params,
}) => {

  if(params.conversationId){

    try {
      const res = await apiRequest<{content:string, conversationId: string}>(
        `${API_URL}/history/${params.conversationId}`
      );
  
      console.log({res})
    } catch (error) {
      console.log({error})
    }
  }


  console.log({ params });
  return { params };
};

export default chatHistoryLoader;
