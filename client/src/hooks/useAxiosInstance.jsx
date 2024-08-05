import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const useAxiosInstance = () => {
  const { accessToken, setAccessToken, refreshToken } = useAuthContext();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api",
  });

  const refresh = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/refresh", {
        refreshToken,
      });
      setAccessToken(res.data.accessToken);
      localStorage.setItem("accessToken", JSON.stringify(res.data.accessToken));
      return res.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (accessToken) {
        const currentDate = new Date();
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 < currentDate.getTime()) {
          const newAccessToken = await refresh();
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        } else {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosInstance;
