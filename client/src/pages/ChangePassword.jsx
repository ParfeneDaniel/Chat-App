import React, { useRef } from "react";
import useAxiosInstance from "../hooks/useAxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const axiosInstance = useAxiosInstance();
  const ref = useRef();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    axiosInstance
      .put(
        "/auth/changePassword",
        { newPassword: ref.current.value },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => navigate("/secure/chat"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="changeForgotResetPassword">
      <input type="password" placeholder="New Password" ref={ref} />
      <button onClick={handleChangePassword}>Submit</button>
    </div>
  );
};

export default ChangePassword;
