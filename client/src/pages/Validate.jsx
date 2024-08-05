import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Validate = () => {
  const { emailToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`http://localhost:3001/api/auth/validEmail/${emailToken}`)
      .then((response) => {
        console.log(response);
        navigate("/signin");
      })
      .catch((error) => console.log(error));
  });
  return <div>Validate your email</div>;
};

export default Validate;
