import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authAxios } from "../http/axiosConfig";
import { ICurrentUsers } from "../utils";

export const useLandingPage = () => {
  const [userPage, setUserPage] = useState(1)
  const [groupPage, setGroupPage] = useState(1)
  const { userId } = useParams();
  const getGroups = useQuery({
    queryKey: ["groups", userId],
    queryFn: async () => authAxios.get(`/api/getGroups?limit=5&page=${groupPage}&all=true`),
  });

  const getAllUsers = useQuery({
    queryKey: ["users", "all", userPage],
    queryFn: async () => authAxios.get(`/api/user?all=true&limit=5&page=${userPage}`),
  })

  const getUserDetails = useQuery({
    queryKey: ["userDetails", userId],
    queryFn:  () =>  authAxios.get(`/api/user`)
  });

  const addGroupApi = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: (data: {
      groupName: string;
      type: "GROUP" | "INDIVIDUAL";
      users?: string[]
    }) => authAxios.post(`/api/group`, data),
    onSuccess: () => {
      getGroups.refetch();
    },
  });
  const addGroup = (
    groupName: string,
    isDm: boolean,
    users?: string[]
  ) => {
    addGroupApi.mutate({
      groupName: groupName,
      type: isDm ? "INDIVIDUAL" : "GROUP",
      users
    })
  };
  const addUserToGroupApi = useMutation({
    mutationKey: ["addUserToGroup"],
    mutationFn: (data: { groupId: string }) =>
      authAxios.put(`/api/group/${data.groupId}`),
  });

  const addUserToGroup = (groupId: string) => {
    addUserToGroupApi.mutate(
      { groupId },
      {
        onSuccess: () => {
          getGroups.refetch();
        },
      }
    );
  };

  return {
    currentUsers: getAllUsers.data?.data.users,
    addGroup,
    currentGroups: getGroups.data?.data.groups,
    addUserToGroup,
    userName: getUserDetails.data?.data.user.userName,
    userPage,
    setUserPage,
    groupPage,
    setGroupPage,
    totalUsers: getAllUsers.data?.data.total,
    totalGroups: getGroups.data?.data.total
  };
};
