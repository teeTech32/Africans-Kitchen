"use client"
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&      
      !originalRequest.url.includes("/api/auth/refreshtoken")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
         await api.post("/api/auth/refreshtoken");
        // Backend should set new accessToken cookie

        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];

        return api(originalRequest);

      } catch (err) {
        window.location.href = "/authusers/LogIn";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
