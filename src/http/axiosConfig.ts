import axios from "axios";
import { BASE_URL } from "../utils";
import { toast } from "react-toastify";

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
      logout()
    }
    
    toast(err.response.data.message)
    return Promise.reject(err);
  }
);

export const logout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.href = '/'
}