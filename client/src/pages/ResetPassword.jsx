import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const ref = useRef();
  const navigate = useNavigate();
  const params = useParams();

  const handleResetPassword = () => {
    axios
      .put("http://localhost:3001/api/auth/reset", {
        newPassword: ref.current.value,
        securityToken: params.securityToken,
      })
      .then(() => navigate("/signin"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="changeForgotResetPassword">
      <input type="password" placeholder="New Password" ref={ref} />
      <button onClick={handleResetPassword}>Submit</button>
    </div>
  );
};

export default ResetPassword;
