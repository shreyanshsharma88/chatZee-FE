import {
  Box,
  Chip,
  Drawer,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { authAxios } from "../../http/axiosConfig";
import { useNavigate } from "react-router-dom";
import { GroupCard } from "./Sidebar";

// TODO: FIX ALL
export const GroupDrawer = ({
  open,
  onClose,
  addUserToGroup,
}: IGroupDrawerProps) => {
  const [userPage, setUserPage] = useState(1);

  const getGroups = useQuery({
    queryKey: ["groups", { userPage, all: true }],
    queryFn: async () =>
      authAxios.get(`/api/group?all=true&limit=10&page=${userPage}`),
  });

  const navigate = useNavigate();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      sx={{
        ".MuiDrawer-paper": {
          width: "40%",
        },
      }}
    >
      <Stack p={4} alignSelf="center" width="100%" direction="column" gap={3}>
        <Typography variant="h4">Current Groups</Typography>

        <Stack direction="column" gap={1} pl={2} overflow="auto">
          {getGroups.data?.data.groups?.map((group) => {
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
        <Pagination
          sx={{
            ".MuiPaginationItem-root": {
              color: "#fff",
            },
          }}
          page={userPage}
          onChange={(_, page) => setUserPage(page)}
          color="primary"
          count={Math.ceil(getGroups.data?.data.total / 5)}
        />
      </Stack>
    </Drawer>
  );
};

interface IGroupDrawerProps {
  open: boolean;
  onClose: () => void;
  addUserToGroup: (groupId: string) => void;
}
