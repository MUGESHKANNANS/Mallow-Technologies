import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure, fetchUserRequest, updateUser } from "./authSlice";
import axiosInstance from "../utils/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function* loginSaga(action) {
  console.log(" loginSaga triggered", action.payload);

  try {
    console.log("Login payload:", action.payload);

    const response = yield call(fetch,
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(action.payload),
      }
    );

    console.log(" API response received", response);

    const data = yield response.json();
    console.log(" Login API response:", data);

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Email is not registered");
      }
      throw new Error(data.message || "Invalid email or password");
    }

    const token = data?.data?.token;
    const user = data?.data?.details;

    if (!token || !user) {
      throw new Error("JWT token not found in response");
    }

    const expiry = Date.now() + 24 * 60 * 60 * 1000;

    console.log("Saving to localStorage");

    localStorage.setItem(
      "auth",
      JSON.stringify({
        user,
        token,
        expiry,
      })
    );

    console.log("Saved auth:", JSON.parse(localStorage.getItem("auth")));

    yield put(loginSuccess({ user, token }));
  } catch (error) {
    console.error(" Login saga error:", error);
    yield put(loginFailure(error.message));
  }
}


function* fetchUserSaga() {
  try {
    const response = yield call(() => axiosInstance.get("/user"));
    const user = response?.data?.user ?? response?.data?.data?.user ?? response?.data?.data ?? response?.data;

    if (user) {
      yield put(updateUser(user));

      const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (storedAuth.token) {
        localStorage.setItem("auth", JSON.stringify({ ...storedAuth, user }));
      }
    }
  } catch (error) {
    console.error("Fetch user saga error:", error);
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
}
