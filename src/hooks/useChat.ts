import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketProvider } from "../providers/SocketProvider";
import { BASE_URL, IGroupDetails } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "../http/axiosConfig";
import { useLandingPage } from "./useLayoutPage";

export const useChat = () => {
  const { setMessages } = useSocketProvider();
  const { groupId } = useParams();

  const getGroupDetailsQuery = useQuery({
    queryKey: ["getGroup", groupId],
    queryFn: () => authAxios.get(`/api/group/${groupId}`),
    enabled: !!groupId,
  });

  const getGroupChatQuery = useQuery({
    queryKey: ["chat", groupId],
    queryFn: async () => {
      const { data } = await authAxios.get(`/api/chat/${groupId}`);
      setMessages(data.chats);
      return data;
    },
    enabled: !!groupId,
  });

  const groupName = useMemo(() => {
    if (getGroupDetailsQuery?.data?.data.group.type === "INDIVIDUAL") {
      return getGroupDetailsQuery?.data?.data.group.users?.find(
        (user: any) => user._id !== localStorage.getItem("userId")
      )?.username;
    }
    return getGroupDetailsQuery?.data?.data.group.groupName;
  }, [getGroupDetailsQuery?.data?.data.group]);
  return {
    groupName,
    loading: getGroupChatQuery.isLoading || getGroupDetailsQuery.isLoading,
  };
};
