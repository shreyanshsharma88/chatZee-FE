import axios from "axios";
import { BASE_URL } from "../utils";

export const authAxios = axios.create({
  baseURL: BASE_URL,
});

authAxios.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!!userId) {
    config.headers['userId'] = userId;
  }
  if (!!token) {
    config.headers['token'] = token;
  }
  return config;
});

authAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      // TODO: WRITE A LOGOUT FUNCTION
      // localStorage.removeItem("userId");
      // localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);
