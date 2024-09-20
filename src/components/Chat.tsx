import {
  Box,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useChat } from "../hooks";
import { useSocketProvider } from "../providers";
import { useParams } from "react-router-dom";
import { Send } from "@mui/icons-material";

export const Chat = () => {
  const { groupDetails } = useChat();
  const [currMessage, setCurrMessage] = useState<string>("");
  const { socket, messages } = useSocketProvider();
  const { userId, groupId } = useParams();
  const [showMembers, setShowMembers] = useState(false);
  const handleClick = () => {
    if (!currMessage) return;
    if (socket) {
      const res = JSON.stringify({
        groupId,
        message: currMessage,
        userId: userId,
      });
      socket.send(res);
      setCurrMessage("");
    }
  };
  return (
    <Stack p={4} height="100%" direction="column" gap={2}>
      <Stack height="90%" width={"100%"} direction="column" sx={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}>
        {groupDetails?.chat?.concat(messages ?? [])?.map((m, index) => {
          if (!m) return null;
          const isSameUser = m?.userId === userId;
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
                }}
                label={m.message}
              />

              {!isSameUser && (
                <Typography
                  fontStyle="italic"
                  color="grey"
                  alignSelf="start"
                  variant="caption"
                >
                  By-{m.userName}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
      <Stack direction="row" gap={2} width="100%">
        <TextField
          onChange={(e) => setCurrMessage(e.target.value)}
          value={currMessage}
          sx={{ border: "2px solid", flex: 1 }}
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
    </Stack>
  );
};
3;