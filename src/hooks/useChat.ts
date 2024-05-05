import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketProvider } from "../providers/SocketProvider";
import { BASE_URL, IGroupDetails } from "../utils";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";

export const useChat = () => {
    const { setMessages } = useSocketProvider();
    const [groupDetails, setGroupDetails] = useState<IGroupDetails | null>(null);
    const { groupId } = useParams();
  
    const getGroupMembers = useQuery(
      [groupId],
      (): Promise<AxiosResponse> =>
        axios.get(`${BASE_URL}/getGroupDetails/${groupId}`),
        {
          onSuccess: (res) => {
            setGroupDetails(res.data);
            setMessages(res.data.messages);
          }
        }
    );
    return { groupDetails };
}