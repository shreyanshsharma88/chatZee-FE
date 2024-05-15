import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, ICurrentGroups, ICurrentUsers } from "../utils";
import { useMutation, useQuery } from "react-query";
import axios from "axios";

export const useLandingPage = () => {
  const [currentUsers, setCurrentUsers] = useState<ICurrentUsers[] | null>(
    null
  );
  const [currentGroups, setCurrentGroups] = useState<ICurrentGroups[] | null>(
    null
  );
  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();
  const { userId } = useParams();
  const getUsers = useQuery(
    ["users", userId],
    () => axios.get(`${BASE_URL}/users/${userId}`),
    {
      onSuccess: (data) => {
        setCurrentUsers(data.data);
      },
    }
  );
  const getGroups = useQuery(
    ["groups", userId],
    () => axios.get(`${BASE_URL}/getGroups/${userId}`),
    {
      onSuccess: (data) => {
        setCurrentGroups(data.data);
      },
    }
  );

  const getUserDetails = useQuery(
    ["userDetails", userId],
    () => axios.get(`${BASE_URL}/user/${userId}`),
    {
      enabled: !userName,
      onSuccess: (data) => {
        setUserName(data.data.userName);
      },
    }
  );

  const addGroupApi = useMutation(
    ["addGroup"],
    (data: {
      groupName: string;
      isDm: boolean;
      uniqueId2: string | null;
      uniqueId: string;
    }) => axios.post(`${BASE_URL}/addGroup`, data),
    {
      onSuccess: (res, payload) => {
        getGroups.refetch();
      },
    }
  );
  const addGroup = (
    groupName: string,
    isDm: boolean,
    uniqueId2: string | null,
    uniqueId: string
  ) => {
    addGroupApi.mutate(
      { groupName, isDm, uniqueId2, uniqueId },
      {
        onError: () => {
          if (isDm) {
            getUsers.refetch();
            const id = currentUsers?.find(
              (user) =>
                user.dmID === `${userId}**${uniqueId2}` ||
                user.dmID === `${uniqueId2}**${userId}`
            )?.dmID;
            navigate(`/${userId}/${id}`, { replace: false });
          }
        },
      }
    );
  };
  const addUserToGroupApi = useMutation(
    ["addUserToGroup"],
    (data: { groupId: string; userId: string }) =>
      axios.post(`${BASE_URL}/addUserToGroup`, data)
  );

  const addUserToGroup = (groupId: string) => {
    addUserToGroupApi.mutate(
      { groupId, userId: userId ?? "" },
      {
        onSuccess: () => {
          getGroups.refetch();
          navigate(`/${userId}/${groupId}`, { replace: false });
        },
      }
    );
  };

  return { currentUsers, addGroup, currentGroups, addUserToGroup, userName };
};
