import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../Pages/Auth";
import Dashboard from "../Pages/Dashboard";
import Posts from "../Pages/Posts";
import PostPreview from "../Pages/PostPreview";
import ProtectedRoute from "./ProtectedRoute";
import { restoreSession, logout } from "../store/authSlice";

const Router = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    console.log("Router: Checking for existing session...");

    if (auth) {
      const { user, token, expiry } = JSON.parse(auth);
      const now = Date.now();
      console.log(`Router: Token expiry: ${new Date(expiry).toLocaleString()} | Current Time: ${new Date(now).toLocaleString()}`);

      if (token && now <= expiry) {
        console.log("Router: Session valid. Restoring user...");
        dispatch(
          restoreSession({
            user,
            token,
          })
        );
      } else {
        console.log("Router: Session expired or invalid. Logging out...");
        dispatch(logout());
      }
    } else {
      console.log("Router: No session found in localStorage.");
    }
    setIsAuthChecked(true);
  }, [dispatch]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route
          path="/signin"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostPreview />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
};

export default Router;
