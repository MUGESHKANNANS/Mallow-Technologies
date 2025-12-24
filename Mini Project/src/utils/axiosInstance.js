import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      const { token } = JSON.parse(auth);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine || error.message === "Network Error") {
      error.message = "You are offline. Please check your internet connection";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
