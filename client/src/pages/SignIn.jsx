import React, { useRef } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const SignIn = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const {
    isAuth,
    setAccessToken,
    setRefreshToken,
    setUserId,
    setUsername,
    setIsAuth,
  } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    axios
      .post("http://localhost:3001/api/auth/signin", data)
      .then((response) => {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.data.refreshToken)
        );
        localStorage.setItem("userId", JSON.stringify(response.data.userId));
        localStorage.setItem(
          "username",
          JSON.stringify(response.data.username)
        );
        localStorage.setItem("isAuth", true);
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUserId(response.data.userId);
        setUsername(response.data.username);
        setIsAuth(true);
        navigate("/secure/chat");
      })
      .catch((error) => console.log(error));
  };

  return isAuth ? (
    <Navigate to="/secure/chat" state={{ from: location }} replace />
  ) : (
    <div className="signupSignin">
      <form>
        <input
          type="text"
          placeholder="username"
          id="username"
          ref={usernameRef}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          ref={passwordRef}
        />
        <input type="submit" onClick={handleSignIn} />
      </form>
    </div>
  );
};

export default SignIn;
