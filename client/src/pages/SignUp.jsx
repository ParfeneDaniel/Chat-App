import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    axios
      .post("http://localhost:3001/api/auth/signup", data)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="signupSignin">
      <form>
        <input
          type="text"
          placeholder="username"
          id="username"
          ref={usernameRef}
        />
        <input type="email" placeholder="email" id="email" ref={emailRef} />
        <input
          type="password"
          placeholder="password"
          id="password"
          ref={passwordRef}
        />
        <input type="submit" onClick={handleSignUp} />
      </form>
    </div>
  );
};

export default SignUp;
