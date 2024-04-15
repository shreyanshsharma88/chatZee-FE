import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export const SocketContext = createContext({
  socket: null,
  messages: [],
  setMessages: () => {},
});

export const SocketProvider = () => {
  const [messages, setMessages] = useState(null);
  const [socket, setSocket] = useState(null);
  const { userId, groupId } = useParams();

  useEffect(() => {
    let ws = new WebSocket(`ws://localhost:8080/?userId=${userId}`);
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
      ws = new WebSocket(`ws://localhost:8080/?userId=${userId}`);
      setSocket(ws);
    };
    setSocket(ws);
    ws.addEventListener("open", onSocketOpen);
    ws.addEventListener("message", (m) => onNewMessage(m));
    ws.addEventListener("close", onClose);
    ws.on;
  }, [userId, groupId]);
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
