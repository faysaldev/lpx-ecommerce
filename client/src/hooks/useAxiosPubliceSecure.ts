import axios from "axios";
import { useRouter } from "next/router";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
});

const useAxiosSecure = () => {
  const router = useRouter();

  // Request interceptor to add headers before the request is sent
  axiosSecure.interceptors.request.use(
    function (config) {
      const storedData = localStorage.getItem("lpx");
      let token = null;

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          token = parsedData.isAuthenticated;
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Add Authorization token if available
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }

      return config;
    },
    function (error) {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling unauthorized errors
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        console.warn(
          "Unauthorized or forbidden request. Redirecting to login..."
        );
        router.replace("/login");
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
