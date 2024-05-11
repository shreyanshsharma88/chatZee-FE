/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

export const useLogin =  () => {
    const [value, setValue] = useState<string>('')
    const navigate = useNavigate()

    const addUserApi = useMutation(
        ["addUser"],
        (data: { userName: string }) =>
          axios.post(`${BASE_URL}/login`, data),
        {
          onSuccess: (data: AxiosResponse) => {
            navigate(`/${data.data.id}?userName=${value}`)
          },
        }
      );
      const addUser = () => {
        addUserApi.mutate({ userName: value });
      }
    
  

    return {value, setValue , addUser}
}