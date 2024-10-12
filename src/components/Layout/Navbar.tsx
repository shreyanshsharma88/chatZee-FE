import { Chat } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React from "react";
import { useLandingPage } from "../../hooks";

export const Navbar = () => {
  const { userName } = useLandingPage();
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
      <Typography variant="h4"> Hi {userName}!</Typography>
    </Stack>
  );
};
