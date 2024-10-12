import { Add, Chat } from "@mui/icons-material";
import {
    Box,
    IconButton,
    Pagination,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLandingPage } from "../../hooks";

import { Button, Dialog, TextField } from "@mui/material";
import React, { useState } from "react";
import { IAddGroupProps } from "../../utils";

export const SideBar = () => {
  const {
    currentGroups,
    addUserToGroup,
    addGroup,
    groupPage,
    setGroupPage,
    totalGroups,
  } = useLandingPage();
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
        Current Groups
      </Typography>
      <Pagination
        sx={{
          ".MuiPaginationItem-root": {
            color: "#fff",
          },
        }}
        page={groupPage}
        onChange={(_, page) => setGroupPage(page)}
        color="primary"
        count={Math.ceil(totalGroups / 5)}
      />
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
                    navigate(`/home/${group.id}`, { replace: false });
                    return;
                  }
                  addUserToGroup(group.id);
                }}
              />
            </Box>
          );
        })}
      </Stack>

      <Typography variant="h5" fontWeight={700}>
        Active Users
      </Typography>
     
    </Stack>
  );
};

const AddGroup = ({ open, handleClose, addGroup }: IAddGroupProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const handleAdd = () => {
    if (!groupName) return;
    addGroup({
        groupName,
        isDm: false,
    });
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
