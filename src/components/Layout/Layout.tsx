import { Person4 } from "@mui/icons-material";
import {
  Container,
  Fab,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, PropsWithChildren, useState } from "react";
import { Outlet } from "react-router-dom";
import { useViewPort } from "../../hooks";
import { Navbar } from "./Navbar";
import { SideBar } from "./Sidebar";
import { UserDrawer } from "./UserDrawer";

export const Layout: FC<PropsWithChildren> = () => {
  const { isMobile } = useViewPort();
  const theme = useTheme();
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  if (isMobile) {
    return <Typography variant="h2">Use web view</Typography>;
  }

  return (
    <Stack width="100%" height="100%">
      <Navbar />
      <Stack
        position="relative"
        overflow="hidden"
        direction="row"
        height="100%"
        width={"100%"}
      >
        <SideBar />
        <Container
          sx={{
            justifySelf: "center",
            width: "60%",
            height: "80%",
            alignSelf: "center",
            borderRadius: 10,
            backgroundColor: theme.palette.secondary.main,
            border: "1px solid",
          }}
        >
          <Outlet />
        </Container>
        <Tooltip title="Search Users">
          <Fab
            color="info"
            sx={{ p: "20px", position: "absolute", bottom: 50, right: 5 }}
            onClick={() => setShowUserDrawer(true)}
          >
            <Person4 />
          </Fab>
        </Tooltip>
      </Stack>
      <UserDrawer
        onClose={() => setShowUserDrawer(false)}
        open={showUserDrawer}
      />
    </Stack>
  );
};
