import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../http/axiosConfig";

// TODO: RENAME
export const useLogin = () => {
  const [form, setForm] = useState<"login" | "signup">("signup");
  const [userName, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const addUserApi = useMutation({
    mutationKey: ["addUser"],
    mutationFn: (mutationData: { userName: string; password: string }) =>
      authAxios.post(`/signup`, mutationData),

    onSuccess: (res, payload) => {
      console.log("res", res.data);
      
      localStorage.setItem("userId", res.data.id);
      navigate(`/home`);
    },
  });
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { userName: string; password: string }) =>
      authAxios.post(`/login`, data),
    onSuccess: (data: AxiosResponse) => {
      localStorage.setItem("userId", data.data.id);
      navigate(`/home`);
    },
  });
  const handleClick = () => {
    if (form === "login") {
      login.mutate({ userName: userName, password });
      return;
    }
    addUserApi.mutate({ userName: userName, password });
  };

  return {
    value: userName,
    setValue: setUsername,
    handleClick,
    setPassword,
    password,
    setForm,
    form,
  };
};
