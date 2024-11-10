import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, useParams } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../utils";
import axios from "axios";

export interface IMessage {
  sentBy: string;
  sentTo: string;
  message: string;
  id: string;
  time: string;
  sentByUsername: string;
}
interface ISocketContext {
  socket: WebSocket | null;
  messages: IMessage[] | null;
  setMessages: (m: any[]) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  messages: [],
  setMessages: () => {},
});

export const SocketProvider = () => {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { groupId } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let ws = new WebSocket(`${SOCKET_URL}?userId=${token}`);
    const onSocketOpen = () => console.log("WebSocket is connected now");
    const onNewMessage = (m) => {
      const data = JSON.parse(m.data);
     
      if (groupId === data.sentTo) {
        setMessages((p) => {
          if (!p) return [data];
          return [...p, data];
        });
      }
      
    };
    const onClose = () => {
      console.warn("WebSocket is closed now");
      setTimeout(() => {
        setSocket(new WebSocket(`${SOCKET_URL}?userId=${token}`));
      }, 3000);
    };
    setSocket(ws);
    ws.addEventListener("open", onSocketOpen);
    ws.addEventListener("message", (m) => onNewMessage(m));
    ws.addEventListener("close", onClose);
    // ws.on;
  }, [token, groupId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket?.send(JSON.stringify({ type: "ping" }));
      }
    }, 10000); // Every 10 seconds
    return () => clearInterval(intervalId);
  }, [socket]);
  const value = useMemo(
    () => ({
      messages,
      socket,
      setMessages,
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

export const useSocketProvider = () => useContext(SocketContext);
