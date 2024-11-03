import { Groups2, Person4 } from "@mui/icons-material";
import {
  Container,
  Fab,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, PropsWithChildren, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLandingPage, useViewPort } from "../../hooks";
import { Navbar } from "./Navbar";
import { SideBar } from "./Sidebar";
import { UserDrawer } from "./UserDrawer";
import { GroupDrawer } from "./GroupDrawer";

export const Layout: FC<PropsWithChildren> = () => {
  const { isMobile } = useViewPort();
  const theme = useTheme();

  // TODO: HANDLE FROM QUERY
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = ({
    isDmExisting,
    groupId,
    userId,
  }: {
    isDmExisting: boolean;
    groupId: string;
    userId: string;
  }) => {

    if (!!isDmExisting) {
      navigate(`/home/${groupId}`, { replace: false });
      return;
    }
    addGroup({
      groupName: `${userId}-dm`,
      isDm: true,
      users: [userId],
    });
  };
  if (isMobile) {
    return <Typography variant="h2">Use web view</Typography>;
  }

  const { addUserToGroup, addGroup, userName } = useLandingPage();

  return (
    <Stack width="100%" height="100%">
      <Navbar userName={userName} />
      <Stack
        position="relative"
        overflow="hidden"
        direction="row"
        height="100%"
        width={"100%"}
      >
        <SideBar
          addGroup={addGroup}
          addUserToGroup={addUserToGroup}
          userName={userName}
        />
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
        <Tooltip title="Search Groups">
          <Fab
            color="info"
            sx={{ p: "20px", position: "absolute", bottom: 50, left: 5 }}
            onClick={() => setShowGroupDrawer(true)}
          >
            <Groups2 />
          </Fab>
        </Tooltip>
      </Stack>
      <UserDrawer
        onClose={() => setShowUserDrawer(false)}
        open={showUserDrawer}
        handleUserClick={handleUserClick}
      />
      <GroupDrawer
        open={showGroupDrawer}
        onClose={() => setShowGroupDrawer(false)}
        addUserToGroup={addUserToGroup}
      />
    </Stack>
  );
};
