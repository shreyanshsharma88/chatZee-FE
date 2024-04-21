import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketProvider } from "../providers/SocketProvider";
import { BASE_URL, IGroupDetails } from "../utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGroup = () => {
  const { setMessages } = useSocketProvider();
  const [groupDetails, setGroupDetails] = useState<IGroupDetails | null>(null);
  const { groupId } = useParams();

  const getGroupMembers = useQuery( [groupId] , () => {

    return axios.get(`${BASE_URL}/getGroupDetails/${groupId}`),
      {
        onSuccess: (res) => {
          setGroupDetails(res.data);
          setMessages(res.data.chat);
        }
      };
  });
  return { groupDetails };
};
