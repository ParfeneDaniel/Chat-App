import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Validate from "../pages/Validate";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";
import Secure from "../pages/Secure";
import Dashboard from "../pages/Dashboard";
import ResetPassword from "../pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "validate/:emailToken",
    element: <Validate />,
  },
  {
    path: "forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "resetPassword/:securityToken",
    element: <ResetPassword />,
  },
  {
    path: "secure",
    element: <Secure />,
    children: [
      {
        path: "chat",
        element: <Dashboard />,
      },
      {
        path: "changePassword",
        element: <ChangePassword />,
      },
    ],
  },
]);
