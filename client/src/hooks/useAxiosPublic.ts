import axios from "axios";

const axiosPublicSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
});

axiosPublicSecure.interceptors.request.use((error) => {
  return Promise.reject(error);
});

const usePublicAxiosSecure = () => {
  return axiosPublicSecure;
};

export default usePublicAxiosSecure;
