import { Chip, Drawer, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { authAxios } from "../../http/axiosConfig";
import { useNavigate } from "react-router-dom";

export const UserDrawer = ({ open, onClose }: IUserDrawerProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [userPage, setUserPage] = useState(1)

  const getUsers = useQuery({
    queryKey: ["users", "all", userPage],
    queryFn: async () => authAxios.get(`/api/user?all=true&limit=5&page=${userPage}`),
  })

  const navigate = useNavigate()


  const handleUserClick = ({
    isDmExisting,
    groupId,
    userId,
  }: {
    isDmExisting: boolean;
    groupId: string;
    userId: string;
  }) => {
    if (isDmExisting) {
      navigate(`/home/${groupId}`, { replace: false });
      return;
    }
    addGroup(`${userId}-dm`, true, [userId]);
  };

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
      <Stack p={4} alignSelf="center" width='100%' direction='column' gap={3}>
        <Typography variant="h4">Current Users</Typography>
        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          label="Search Users"
        />

<Pagination
        sx={{
          ".MuiPaginationItem-root": {
            color: "#fff",
          },
        }}
        page={userPage}
        onChange={(_, page) => setUserPage(page)}
        color="primary"
        count={Math.ceil(getUsers.data?.data.total / 5)}
      />
      <Stack direction="column" gap={1} pl={2}>
        {getUsers.data?.data.users?.map((user) => {
          if (!user) return null;
          return (
            <Chip
              label={user.userName}
              key={user.id}
              color="info"
              onClick={() =>
                // fix it all
                handleUserClick({
                  isDmExisting: user.alreadyAddedInDm,
                  groupId: user.dmId,
                  userId: user.id,
                })
              }
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
    </Drawer>
  );
};

interface IUserDrawerProps {
  open: boolean;
  onClose: () => void;
}
