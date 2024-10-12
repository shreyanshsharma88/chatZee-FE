import { Chat, Logout } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { logout } from "../../http/axiosConfig";

export const Navbar = ({userName}:{userName: string}) => {
  return (
    <Stack
      direction="row"
      gap={2}
      justifyContent="space-between"
      alignItems="center"
      padding={2}
      borderBottom="2px solid white"
      position="sticky"
      top={0}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Chat fontSize="large" />
        <Typography variant="h4" fontWeight={700}>
          ChatZee
        </Typography>
      </Stack>
    <IconButton onClick={logout}>
      <Logout color="warning" fontSize="large"/>
    </IconButton>
    </Stack>
  );
};

