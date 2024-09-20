import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMessage, SocketContext } from "./SocketProvider";
import { authAxios } from "../http/axiosConfig";

export const SocketProvider = () => {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { userId, groupId } = useParams();

  const getUserDetails = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const data = await authAxios.get(`/api/user/${userId}`);
      setUserName(data.data.userName);
    },
    enabled: !!userId && !userName,
  });

  useEffect(() => {
    let ws = new WebSocket(`${SOCKET_URL}?userId=${userId}`);
    const onSocketOpen = () => console.log("WebSocket is connected now");
    const onNewMessage = (m) => {
      const data = JSON.parse(m.data);
      if (groupId === data.groupId) {
        setMessages((p) => {
          if (!p) return [data];
          return [...p, data];
        });
      }
    };
    const onClose = () => {
      console.log("WebSocket is closed now");
      ws = new WebSocket(`${SOCKET_URL}?userId=${userId}`);
      setSocket(ws);
    };
    setSocket(ws);
    ws.addEventListener("open", onSocketOpen);
    ws.addEventListener("message", (m) => onNewMessage(m));
    ws.addEventListener("close", onClose);
    // ws.on;
  }, [userId, groupId]);
  const value = useMemo(
    () => ({
      messages,
      socket,
      setMessages,
      userName,
    }),
    [messages, socket]
  );
  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  return (
    <SocketContext.Provider value={value}>
      <Outlet />
    </SocketContext.Provider>
  );
};
