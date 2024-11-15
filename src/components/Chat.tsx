import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useChat, useLandingPage } from "../hooks";
import { useSocketProvider } from "../providers";
import { useParams } from "react-router-dom";
import { Send } from "@mui/icons-material";

export const Chat = () => {
  const { groupName, loading } = useChat();
  // todo:  refactor
  const { userName } = useLandingPage();
  const [currMessage, setCurrMessage] = useState<string>("");
  const { socket, messages } = useSocketProvider();
  const { groupId } = useParams();
  const userId = localStorage.getItem("userId");
  const handleClick = () => {
    if (!currMessage) return;
    if (socket) {
      const res = JSON.stringify({
        groupId,
        message: currMessage,
        userId: userId,
        time: Date.now(),
        username: userName,
      });
      socket.send(res);
      setCurrMessage("");
    }
  };
  return (
    <Stack p={4} height="100%" direction="column" gap={2}>
      <>
        {loading ? (
          <CircularProgress
            sx={{ alignSelf: "center", justifySelf: "center" }}
          />
        ) : (
          <>
            <Typography variant="h4">{groupName}</Typography>
            <Stack
              height="90%"
              width={"100%"}
              direction="column"
              sx={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages?.map((m, index) => {
                if (!m) return null;
                const isSameUser = m?.sentBy === userId;
                return (
                  <Stack
                    alignSelf={isSameUser ? "flex-end" : "flex-start"}
                    key={index}
                    direction="column"
                  >
                    <Chip
                      sx={{
                        borderRadius: 5,
                        mt: 1,
                        bgcolor: isSameUser ? "info.main" : "grey",
                        p: 1,
                        maxWidth: 300,
                        minWidth: 100,
                        fontFamily: "Poppins",
                        fontSize: 14,
                      }}
                      label={m.message}
                      color="secondary"
                    />

                    {!isSameUser && (
                      <Typography
                        fontStyle="italic"
                        color="grey"
                        alignSelf="start"
                        variant="caption"
                      >
                        By-{m.sentByUsername}
                      </Typography>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </>
        )}
      </>

      {!loading && (
        <Stack direction="row" gap={2} width="100%">
          <TextField
            onChange={(e) => setCurrMessage(e.target.value)}
            value={currMessage}
            sx={{ border: "2px solid", flex: 1 ,borderRadius: 8 }}
            InputProps={{
              sx:{
                color:'#fff',
                borderRadius : 8
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick();
              }
            }}
          />
          <IconButton disableRipple onClick={handleClick}>
            <Send color="info" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
};
