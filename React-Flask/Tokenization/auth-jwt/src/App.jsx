import React, { useState } from "react";
import Register from "./components/Auth/Register";
import userContext from "../src/contexts/userContext";
import { register, login } from "./services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Auth/Login";

export default function App() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === "register") {
      register(user)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.success);
          } else if (res.data.error) {
            toast.error(res.data.error);
          }
        })
        .catch((e) => {
          toast.error(e.message);
        });
    }
    else if (type === "login") {
      login(user)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.success);
          } else if (res.data.error) {
            toast.error(res.data.error);
          }
        })
        .catch((e) => {
          toast.error(e.message);
        });
    }
  };

  return (
    <>
      <userContext.Provider value={{ user, setUser, handleSubmit }}>
        <ToastContainer />
        <Register />
        <Login />
      </userContext.Provider>
    </>
  );
}
