import { Add, Chat } from "@mui/icons-material";
import {
  Box,
  Divider,
  Fab,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button, Dialog, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { authAxios } from "../../http/axiosConfig";
import { IAddGroupProps } from "../../utils";
import catAnimation from "../../../public/animations/cat-animation.json";
import Lottie from "lottie-react";

interface ISideBarProps {
  addGroup: ({
    groupName,
    isDm,
    users,
  }: {
    groupName: string;
    isDm: boolean;
    users?: string[];
  }) => void;
  addUserToGroup: (groupId: string) => void;
  userName: string;
}
export const SideBar = ({
  addGroup,
  addUserToGroup,
  userName,
}: ISideBarProps) => {
  const [groupPage, setGroupPage] = useState(1);

  const getUserGroups = useQuery({
    queryKey: ["groups", { all: false }],
    queryFn: () => authAxios.get(`/api/group?limit=5&page=${groupPage}`),
  });

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
      <Tooltip title="Add a group">
        <Fab onClick={handleOpenAddGroupDialog} color="primary">
          <Add />
        </Fab>
      </Tooltip>

      <Stack width="100%" alignItems="center">
        <Box height={200} display="flex" alignItems="center">
          <Lottie animationData={catAnimation} />
        </Box>
        <Typography variant="h3" fontWeight={700}>
          Hey there, {userName}!
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: "#fff" }} />

      <Typography variant="h4" fontWeight={700}>
        My Groups
      </Typography>
      {Number(getUserGroups.data?.data.total) > 4 && (
        <Pagination
          sx={{
            ".MuiPaginationItem-root": {
              color: "#fff",
            },
          }}
          page={groupPage}
          onChange={(_, page) => setGroupPage(page)}
          color="primary"
          count={Math.ceil(getUserGroups.data?.data.total / 5)}
        />
      )}
      {getUserGroups.data?.data.groups.length > 0 ? (
        <Stack direction="column" gap={1} pl={2} overflow="auto">
          {getUserGroups.data?.data.groups?.map((group) => {
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
      ) : (
        <Typography variant="h6">
          You are not added in any groups yet...
        </Typography>
      )}
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

export const GroupCard = ({
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
