import { Add, Chat } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, PropsWithChildren, useId, useState } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useLandingPage, useViewPort } from "../hooks";
import { IAddGroupProps } from "../utils";
import { useSocketProvider } from "../providers/SocketProvider";

const Navbar = () => {
  const [searchParam] = useSearchParams();
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
      <Chat fontSize="large" />
      <Typography variant="h4"> Hi {userName}!</Typography>
    </Stack>
  );
};

const SideBar = () => {
  const { currentGroups, currentUsers, addUserToGroup, addGroup } =
    useLandingPage();
  const [searchParam, setSearchParams] = useSearchParams();
  const handleOpenAddGroupDialog = () => {
    const params = new URLSearchParams(searchParam);
    params.append("addGroup", "true");
    setSearchParams(params);
  };
  const handleCloseAddGroupDialog = () => {
    const params = new URLSearchParams(searchParam);
    params.delete("addGroup");
    setSearchParams(params);
  };
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleUserClick = ({
    isDmExisting,
    groupId,
    uniqueId2,
  }: {
    isDmExisting: boolean;
    groupId: string;
    uniqueId2: string;
  }) => {
    if (isDmExisting) {
      navigate(`/${userId}/${groupId}`, { replace: false });
      return;
    }
    // addGroup(`${userId}**${uniqueId2}`, true, uniqueId2, userId || "");
  };
  const { groupId } = useParams();
  return (
    <Stack
      p={2}
      direction="column"
      gap={2}
      height="100%"
      width="30%"
      borderRight="2px solid white"
      sx={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <AddGroup
        open={!!searchParam.get("addGroup")}
        handleClose={handleCloseAddGroupDialog}
        addGroup={addGroup}
      />
      <IconButton
        onClick={handleOpenAddGroupDialog}
        sx={{ bgcolor: "secondary.light", width: 40 }}
      >
        <Add />
      </IconButton>
      <Typography variant="h5" fontWeight={700}>
        Active Users
      </Typography>
      <Stack direction="column" gap={1} pl={2}>
        {currentUsers?.map((user) => {
          if (!user) return null;
          return (
            <Chip
              label={user.name}
              key={user.id}
              color="info"
              onClick={() =>
                handleUserClick({
                  isDmExisting: user.isDmExisting,
                  groupId: user.dmID,
                  uniqueId2: user.id,
                })
              }
              sx={{
                p: 2.5,
                transition: "transform 0.3s ease",
                scale: user.dmID === groupId ? 1.1 : 1,
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          );
        })}
      </Stack>
      <Typography variant="h5" fontWeight={700}>
        Current Groups
      </Typography>
      <Stack direction="column" gap={1} pl={2}>
        {currentGroups?.map((group) => {
          if (!group) return null;
          return (
            <Box key={group.id}>
              <GroupCard
                name={group.groupname}
                alreadyExist={group.isAlreadyAdded}
                action={() => {
                  if (group.isAlreadyAdded) {
                    // navigate(`/${userId}/${group.id}`, { replace: false });
                    return
                  }
                  addUserToGroup(group.id);
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

const GroupCard = ({
  name,
  alreadyExist,
  action,
}: {
  name: string;
  alreadyExist: boolean;
  action: () => void;
}) => {
  const theme = useTheme();
  return (
    <Stack
      p={2}
      borderRadius={3}
      width={"100%"}
      direction={"row"}
      justifyContent={"space-between"}
      bgcolor={"secondary.dark"}
      textAlign={"center"}
    >
      <Typography fontWeight={700} variant="body1">
        {name}
      </Typography>
      <IconButton
        sx={{ backgroundColor: theme.palette.error.main, color: "white" }}
        onClick={action}
      >
        {alreadyExist ? <Chat /> : <Add />}
      </IconButton>
    </Stack>
  );
};

export const Layout: FC<PropsWithChildren> = () => {
  const { isMobile } = useViewPort();
  const theme = useTheme();
  if (isMobile) {
    return <Typography variant="h2">Use web view</Typography>;
  }
  return (
    <Stack width="100%" height="100%">
      <Navbar />
      <Stack overflow="hidden" direction="row" height="100%" width={"100%"}>
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
      </Stack>
    </Stack>
  );
};

const AddGroup = ({ open, handleClose, addGroup }: IAddGroupProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const { userId } = useParams();
  const uniqueId = userId ?? "";
  const handleAdd = () => {
    if (!groupName) return;
    addGroup(groupName, false);
    handleClose();
  };
  return (
    <Dialog
      PaperProps={{
        sx: {
          padding: 2,
        },
      }}
      open={open}
      onClose={handleClose}
    >
      <Stack direction="column" gap={2}>
        <Typography variant="h6"> Add a Group</Typography>
        <TextField
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          label="Group Name"
        />
        <Button onClick={handleAdd}> Add </Button>
      </Stack>
    </Dialog>
  );
};
