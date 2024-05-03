import { FC, PropsWithChildren, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { useLandingPage, useViewPort } from "./hooks";
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Add, Chat } from "@mui/icons-material";
import { IAddGroupProps } from "./utils";

const Navbar = () => {
  const [searchParam] = useSearchParams();
  const name = searchParam.get("userName");
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
      <Typography variant="h4"> Hi {name}!</Typography>
    </Stack>
  );
};

const SideBar = () => {
  const { currentGroups, currentUsers, addUserToGroup, addGroup } = useLandingPage();
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
              sx={{
                p: 2.5,
                transition: "transform 0.3s ease",
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
            <Chip
              label={group.groupName}
              key={group.id}
              color="info"
              sx={{
                p: 2.5,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export const Layout: FC<PropsWithChildren> = () => {
  const { isMobile } = useViewPort();
  return (
    <Stack width="100%" height="100%">
      <Navbar />
      <SideBar />
      <Outlet />
    </Stack>
  );
};

const AddGroup = ({ open, handleClose, addGroup }: IAddGroupProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const handleAdd = () => {
    if (!groupName) return;
    addGroup(groupName, false, null);
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
