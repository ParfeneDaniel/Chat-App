import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { ChatContextProvider } from "./contexts/ChatContext.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <RouterProvider router={router} />
    </ChatContextProvider>
  </AuthContextProvider>
);
