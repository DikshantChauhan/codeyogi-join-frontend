import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CURRENT_BATCH = "/batches/1";
export const REDIRECT_URL = "redirect_url";

axios.interceptors.request.use((config) => {
  return {
    ...config,
    withCredentials: true,
  };
});

axios.interceptors.response.use(undefined, (error) => {
  console.error("error is, ", error);

  if (error.response?.data?.code === 9101 || error.response?.status === 401) {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/login/" &&
      window.location.pathname !== "/register" &&
      window.location.pathname !== "/register/"
    ) {
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
});