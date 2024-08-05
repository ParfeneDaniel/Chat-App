import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <button onClick={() => navigate("/signin")}>Sign In</button>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/forgotPassword")}>
        Forgot Your Password?
      </button>
    </div>
  );
};

export default Home;
