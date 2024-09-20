import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketProvider } from "../providers/SocketProvider";
import { BASE_URL, IGroupDetails } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "../http/axiosConfig";

export const useChat = () => {
  const { setMessages } = useSocketProvider();
  const [groupDetails, setGroupDetails] = useState<IGroupDetails | null>(null);
  const { groupId } = useParams();

  const getGroupMembers = useQuery({
    queryKey: [groupId],
    queryFn: async () => {
      const data = await authAxios.get(`/api/getGroupDetails/${groupId}`);
      setGroupDetails(data.data);
      // setMessages(data.data.messages);
    },
  });
  return { groupDetails };
};
