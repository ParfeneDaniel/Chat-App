import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken")) || null
  );
  const [refreshToken, setRefreshToken] = useState(
    JSON.parse(localStorage.getItem("refreshToken")) || null
  );
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("userId")) || null
  );
  const [isAuth, setIsAuth] = useState(
    JSON.parse(localStorage.getItem("isAuth")) || false
  );
  const value = {
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    userId,
    setUserId,
    isAuth,
    setIsAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
