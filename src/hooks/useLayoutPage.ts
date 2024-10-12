import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authAxios } from "../http/axiosConfig";
import { ICurrentUsers } from "../utils";

export const useLandingPage = () => {
  const { userId } = useParams();

  const queryClient = useQueryClient();

  const getUserDetails = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => authAxios.get(`/api/user`),
  });

  const addGroupApi = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: (data: {
      groupName: string;
      type: "GROUP" | "INDIVIDUAL";
      users?: string[];
    }) => authAxios.post(`/api/group`, data),
    onSuccess: () => {
      // getAllGroups.refetch();
    },
  });
  const addGroup = ({
    groupName,
    isDm,
    users,
  }: {
    groupName: string;
    isDm: boolean;
    users?: string[];
  }) => {
    addGroupApi.mutate({
      groupName: groupName,
      type: isDm ? "INDIVIDUAL" : "GROUP",
      users,
    });
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
        onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: ["groups", { all: false }],
            exact: true,
            refetchType: "active",
          });
        },
      }
    );
  };

  return {
    addGroup,
    addUserToGroup,
    userName: getUserDetails.data?.data.user.userName,
  };
};
