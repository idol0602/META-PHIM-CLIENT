import { useState, useEffect } from "react";
import { LoginContext } from "./LoginContext";
import axiosInstance from "../global/axiosInstance";

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const updateCurUser = () => {
    axiosInstance
      .get("/getCurrentUser", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(
          "Không lấy được thông tin người dùng:",
          err.response?.data?.message || err.message
        );
        setUser(null); // Không có user
      });
  };
  useEffect(() => {
    updateCurUser();
  }, []);

  return (
    <LoginContext.Provider value={{ user, setUser, updateCurUser }}>
      {children}
    </LoginContext.Provider>
  );
};
