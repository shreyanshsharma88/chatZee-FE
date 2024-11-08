import {
  Chip,
  CircularProgress,
  Drawer,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { authAxios } from "../../http/axiosConfig";
import { useNavigate } from "react-router-dom";

export const UserDrawer = ({
  open,
  onClose,
  handleUserClick,
}: IUserDrawerProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [userPage, setUserPage] = useState(1);

  const getUsersQuery = useQuery({
    queryKey: ["users", "all", { userPage, search: debouncedSearchValue }],
    queryFn: async () =>
      authAxios.get(
        `/api/user?all=true&limit=5&page=${userPage}&search=${debouncedSearchValue}`
      ),
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 2000);

    return () => {
      clearInterval(timeOut);
    };
  }, [searchValue]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      sx={{
        ".MuiDrawer-paper": {
          width: "40%",
        },
      }}
    >
      {getUsersQuery.isLoading ? (
        <CircularProgress sx={{ alignSelf: "center" }} />
      ) : (
        <Stack p={4} alignSelf="center" width="100%" direction="column" gap={3}>
          <Typography variant="h4">Current Users</Typography>
          <TextField
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            label="Search Users"
          />

          <Stack direction="column" gap={1} pl={2}>
            {getUsersQuery.data?.data.users?.map((user) => {
              if (!user) return null;
              return (
                <Chip
                  label={user.userName}
                  key={user.id}
                  color="info"
                  onClick={() => {
                    handleUserClick({
                      isDmExisting: user.alreadyAddedInDm,
                      groupId: user.dmId,
                      userId: user.id,
                    });
                    onClose();
                  }}
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
          <Pagination
            sx={{
              ".MuiPaginationItem-root": {
                color: "#fff",
              },
            }}
            page={userPage}
            onChange={(_, page) => setUserPage(page)}
            color="primary"
            count={Math.ceil(getUsersQuery.data?.data.total / 5)}
          />
        </Stack>
      )}
    </Drawer>
  );
};

interface IUserDrawerProps {
  open: boolean;
  onClose: () => void;
  handleUserClick: ({
    isDmExisting,
    groupId,
    userId,
  }: {
    isDmExisting: boolean;
    groupId: string;
    userId: string;
  }) => void;
}
