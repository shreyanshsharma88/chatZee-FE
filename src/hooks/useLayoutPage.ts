import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, ICurrentGroups, ICurrentUsers } from "../utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authAxios } from "../http/axiosConfig";

export const useLandingPage = () => {
  const [currentUsers, setCurrentUsers] = useState<ICurrentUsers[] | null>(
    null
  );


  const navigate = useNavigate();
  const { userId } = useParams();
  const getGroups = useQuery({
    queryKey: ["groups", userId],
    queryFn: async () => authAxios.get(`${BASE_URL}/getGroups`),
  });

  const getUserDetails = useQuery({
    queryKey: ["userDetails", userId],
    queryFn:  () =>  authAxios.get(`${BASE_URL}/user`)
  });

  const addGroupApi = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: (data: {
      groupName: string;
      type: "GROUP" | "INDIVIDUAL";
    }) => authAxios.post(`${BASE_URL}/group`, data),
    onSuccess: () => {
      getGroups.refetch();
    },
  });
  const addGroup = (
    groupName: string,
    isDm: boolean,
  ) => {
    addGroupApi.mutate({
      groupName: groupName,
      type: isDm ? "INDIVIDUAL" : "GROUP",
    })
  };
  const addUserToGroupApi = useMutation({
    mutationKey: ["addUserToGroup"],
    mutationFn: (data: { groupId: string }) =>
      authAxios.put(`${BASE_URL}/group/${data.groupId}`),
  });

  const addUserToGroup = (groupId: string) => {
    addUserToGroupApi.mutate(
      { groupId },
      {
        onSuccess: () => {
          getGroups.refetch();
          // navigate(`/${userId}/${groupId}`, { replace: false });
        },
      }
    );
  };

  return {
    currentUsers,
    addGroup,
    currentGroups: getGroups.data?.data.groups,
    addUserToGroup,
    userName: getUserDetails.data?.data.user.userName,
  };
};
