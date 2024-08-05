import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const ref = useRef();
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    axios
      .post("http://localhost:3001/api/auth/forgotPassword", {
        username: ref.current.value,
      })
      .then(() => navigate("/"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="changeForgotResetPassword">
      <input type="text" placeholder="Username" ref={ref} />
      <button onClick={handleForgotPassword}>Submit</button>
    </div>
  );
};

export default ForgotPassword;
