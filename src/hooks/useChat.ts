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

 const getGroupDetails = useQuery({
  queryKey: ['getGroup' , groupId],
  queryFn: () => authAxios.get(`/api/group/${groupId}`),
  enabled: !!groupId
 })

 const getGroupChat = useQuery({
  queryKey: [],
  queryFn: async () => {
    const {data} = await authAxios. get(`/api/chat/${groupId}`)
    setMessages(data.chats)
  },
  enabled: !!groupId
 })
  return { groupDetails, groupName: getGroupDetails?.data?.data.group.groupName };
};
