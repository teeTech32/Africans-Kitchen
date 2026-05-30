"use client"
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url?.includes("/api/auth/refreshtoken")

    if (
      isUnauthorized && 
      !originalRequest._retry &&      
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      if(isRefreshing){
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

      }catch(refreshError){
        refreshQueue = [];

        const callbackUrl = window.location.pathname + window.location.search;

        window.location.href = `/authusers/LogIn?callbackUrl=${encodeURIComponent(callbackUrl)}`;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
