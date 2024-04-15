/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowBack, Send } from "@mui/icons-material";
import { useSocketProvider } from "./providers/SocketProvider";

const NavBar = () => {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);
  return (
    <Stack p={2} width="100%" direction="row">
      <IconButton onClick={onBack} alignSelf="start">
        <ArrowBack />
      </IconButton>
    </Stack>
  );
};

export const Chat = () => {
  const [currMessage, setCurrMessage] = useState();
  const [searchParams, _] = useSearchParams();
  const {userId} = useParams();
  const userName = searchParams.get("userName");
  const { socket, messages } = useSocketProvider();

  const handleClick = () => {
    if (!currMessage) return;
    if (socket) {
      const res = JSON.stringify({
        message: currMessage,
        userId: userId,
        send: true,
      });
      console.log(res)
      socket.send(res);
      setCurrMessage("");
    }
  };
  return (
    <Stack
      width="100%"
      height={"100dvh"}
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Box position="absolute" top={0} width="100%">
        <NavBar />
      </Box>
      <Stack
        direction="column"
        maxHeight="70dvh"
        overflow="scroll"
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        width="100%"
      >
        {messages?.map((m, index) => {
          if (!m) return null;
          const isSameUser = m.userData.userName === userName;
          return (
            <Box
              borderRadius={5}
              mt={1}
              bgcolor={isSameUser ? "info.main" : m.userData.colour}
              key={index}
              p={1}
              maxWidth={300}
              minWidth={100}
              alignSelf={isSameUser ? "flex-end" : "flex-start"}
            >
              <Typography variant="h6">{m.message}</Typography>
            </Box>
          );
        })}
      </Stack>
      <Stack
        gap={2}
        direction="row"
        position="fixed"
        bottom={50}
        left={50}
        right={50}
      >
        <TextField
          onChange={(e) => setCurrMessage(e.target.value)}
          value={currMessage}
          sx={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCurrMessage(e.target.value);
              handleClick();
            }
          }}
        />
        <IconButton disableRipple onClick={handleClick} variant="contained">
          <Send color="info" />
        </IconButton>
      </Stack>
    </Stack>
  );
};
