import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authAxios } from "../http/axiosConfig";
import { ICurrentUsers } from "../utils";
import { AxiosError } from "axios";

export const useLandingPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

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
    onSuccess: async (data, { type }) => {
      if (type === "INDIVIDUAL") {
        navigate(`/home/${data.data.id}`);
        await queryClient.invalidateQueries({
          exact: false,
          refetchType: "active",
          queryKey: ["users", "all"],
        });

        return;
      }
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["groups"],
        refetchType: "active",
      });
    },
    onError: (err: AxiosError, {type}) => {
      if(type === "INDIVIDUAL"){
        navigate(`/home/${(err.response?.data as any).id}`);
      }
    }
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
