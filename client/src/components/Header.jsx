import React from "react";
import useAxiosInstance from "../hooks/useAxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useChatContext } from "../contexts/ChatContext";

const Header = () => {
  const axiosInstance = useAxiosInstance();
  const {
    refreshToken,
    accessToken,
    setRefreshToken,
    setAccessToken,
    setUserId,
    setUsername,
    setIsAuth,
  } = useAuthContext();
  const { setConversationId } = useChatContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    axiosInstance
      .post(
        "http://localhost:3001/api/auth/signout",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        localStorage.clear();
        setRefreshToken(null);
        setAccessToken(null);
        setUserId(null);
        setUsername(null);
        setIsAuth(false);
        setConversationId(null);
        navigate("/signin");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="header">
      <button onClick={handleSignOut}>Sign out</button>
      <button onClick={() => navigate("/secure/changePassword")}>
        Change your password
      </button>
    </div>
  );
};

export default Header;
