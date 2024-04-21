/* eslint-disable react/prop-types */
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Group, Send } from "@mui/icons-material";
import { useState } from "react";
import { useSocketProvider } from "../providers";
import React from "react";
import { useGroup } from "../hooks";
import { IMemberProps } from "../utils";

const NavBar = ({ name }: { name: string }) => {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);
  return (
    <Stack
      p={2}
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <IconButton onClick={onBack} sx={{ alignSelf: "start" }}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4">{name}</Typography>
    </Stack>
  );
};
export const GroupContainer = () => {
  const { groupDetails } = useGroup();
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
      console.log(res);
      socket.send(res);
      setCurrMessage("");
    }
  };
  const handleShowMembers = () => setShowMembers(true);
  console.log({ messages });
  return (
    <Stack
      width="100%"
      height={"100dvh"}
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Members
        handleClose={() => setShowMembers(false)}
        open={showMembers}
        members={groupDetails?.users ?? []}
      />
      <Box
        position="absolute"
        top={0}
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <NavBar name={groupDetails?.groupName ?? 'Group'} />
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
          const isSameUser = m.userId === userId;
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
      <Stack
        gap={2}
        direction="row"
        position="fixed"
        bottom={50}
        left={50}
        right={50}
      >
        <IconButton onClick={handleShowMembers} disableRipple>
          <Group color="error" />
        </IconButton>

        <TextField
          onChange={(e) => setCurrMessage(e.target.value)}
          value={currMessage}
          sx={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // setCurrMessage(e.target.value);
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

const Members = ({ open, handleClose, members }: IMemberProps) => {
  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor="left"
      PaperProps={{
        sx: {
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        },
      }}
    >
      <Typography variant="h5"> Connected Users </Typography>
      <Stack direction="column" gap={2}>
        {members?.map((member) => {
          return (
            <Chip
              color="error"
              label={member.userName}
              sx={{
                p: 2.5,
                color: "white",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
              key={member.id}
            />
          );
        })}
      </Stack>
    </Drawer>
  );
};
