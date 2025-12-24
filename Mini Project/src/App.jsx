import React, { useEffect } from "react";
import Router from "./router/Router";
import { useDispatch } from "react-redux";
import { loginSuccess, logout, fetchUserRequest } from "./store/authSlice";
import "antd/dist/reset.css";

import NetworkHandler from "./Components/layout/NetworkHandler";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      const { expiry, user, token } = JSON.parse(storedAuth);

      if (Date.now() < expiry) {
        dispatch(loginSuccess({ user, token }));
        dispatch(fetchUserRequest());
      } else {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
      <NetworkHandler />
      <Router />
    </>
  );
}

export default App;
