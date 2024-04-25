/* eslint-disable react/prop-types */
import {
  Button,
  Chip,
  Collapse,
  Dialog,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useLandingPage } from "../hooks";
import {
  IAddGroupProps,
  ICurrentGroups,
  ICurrentUsers,
  IGroupProps,
} from "../utils";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export const LandingPage = () => {
  const { currentUsers, addGroup, currentGroups, addUserToGroup } =
    useLandingPage();
  const navigate = useNavigate();
  const [isJoiningGroups, setIsJoiningGroups] = useState<boolean>(false);
  const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
  const { userId } = useParams();
  const handleJoinGroupsClose = () => {
    setIsJoiningGroups(false);
  };
  const handleJoin = () => {
    setIsJoiningGroups(true);
  };
  const handleAddGroup = () => setIsAddingGroup(true);
  const handleCloseAddGroup = () => setIsAddingGroup(false);

  return (
    <Stack direction="column" gap={3} width={"100%"} alignItems="center">
      <Groups
        open={isJoiningGroups}
        handleClose={handleJoinGroupsClose}
        currentGroups={currentGroups ?? []}
        addUserToGroup={addUserToGroup}
      />
      <AddGroup
        open={isAddingGroup}
        handleClose={handleCloseAddGroup}
        addGroup={addGroup}
      />

      {/* <Stack direction="column" gap={2} width={"60%"}>
        <Button onClick={handleAddGroup} variant="contained">
          Create Group
        </Button>
        <Button onClick={handleJoin} variant="outlined">
          Join Group
        </Button>
      </Stack>
       */}
      <UserAndGroupsDrawer
        users={currentUsers ?? []}
        groups={currentGroups ?? []}
      />
    </Stack>
  );
};

const Groups = ({
  open,
  handleClose,
  currentGroups,
  addUserToGroup,
}: IGroupProps) => {
  return (
    <Drawer
      anchor="right"
      PaperProps={{
        sx: {
          padding: 2,
        },
      }}
      open={open}
      onClose={handleClose}
    >
      <Stack direction="column" gap={2}>
        <Typography variant="h3">JOIN A GROUP</Typography>
        {currentGroups?.map((group) => {
          return (
            <Chip
              label={group.groupName}
              key={group.id}
              color="info"
              onClick={() => addUserToGroup(group.id)}
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
    </Drawer>
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

const UserAndGroupsDrawer = ({ groups, users }: IUserAndGroupsDrawerProps) => {
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  return (
    <Stack direction="column" p={2} gap={2}>
      <Stack alignItems='center' direction="row" justifyContent="space-between">
        <Typography variant="h6">Active Groups</Typography>
        <IconButton sx={{p:0}} onClick={() => setGroupsOpen((p) => !p)}>
          {!groupsOpen ? <ArrowDropDown /> : <ArrowDropUp />}
        </IconButton>
      </Stack>
      <Collapse in={groupsOpen}>
        {groups.map((group) => {
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
      </Collapse>
    </Stack>
  );
};

interface IUserAndGroupsDrawerProps {
  groups: ICurrentGroups[];
  users: ICurrentUsers[];
}
