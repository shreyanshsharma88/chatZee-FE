import axios from "axios";
import { BASE_URL } from "../utils";

export const authAxios = axios.create({
  baseURL: BASE_URL,
});

authAxios.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers['userId'] = userId;
  }
  return config;
});

authAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      // localStorage.removeItem("userId");
    }
    return Promise.reject(err);
  }
);
