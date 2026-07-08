// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axios from "../api/axios.js";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loginTime, setLoginTime] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const bootstrap = useCallback(async () => {
//     const token = localStorage.getItem("si_token");
//     if (!token) { setLoading(false); return; }
//     try {
//       const { data } = await axios.get("/auth/me");
//       setUser(data.admin);
//       setLoginTime(localStorage.getItem("si_login_time"));
//     } catch {
//       localStorage.removeItem("si_token");
//       localStorage.removeItem("si_login_time");
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { bootstrap(); }, [bootstrap]);

//   // const login = async (email, password) => {
//   //   const { data } = await axios.post("/auth/login", { email, password });
//   //   localStorage.setItem("si_token", data.token);
//   //   const now = new Date().toISOString();
//   //   localStorage.setItem("si_login_time", now);
//   //   setUser(data.admin);
//   //   setLoginTime(now);
//   //   return data;
//   // };


//   const login = async (email, password) => {
//   const { data } = await axios.post("/auth/login", { email, password });

//   localStorage.setItem("si_token", data.token);

//   const now = new Date().toISOString();
//   localStorage.setItem("si_login_time", now);

//   setUser(data.admin);
//   setLoginTime(now);

//   // Connect socket
//   const socket = getAdminSocket(data.token);

//   socket.emit("recruiter_connect", {
//     recruiterId: data.admin.id,
//   });

//   return data;
// };


//   const logout = () => {
//     localStorage.removeItem("si_token");
//     localStorage.removeItem("si_login_time");
//     setUser(null);
//     setLoginTime(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loginTime, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "../api/axios.js";
import {
  getAdminSocket,
  disconnectAdminSocket,
} from "../services/socket.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user after refresh
  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem("si_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/auth/me");

      setUser(data.admin);
      setLoginTime(localStorage.getItem("si_login_time"));

      // Connect socket again after refresh
      const socket = getAdminSocket(token);

      socket.emit("recruiter_connect", {
        recruiterId: data.admin.id || data.admin._id,
      });

      console.log("✅ Socket reconnected");
    } catch (err) {
      console.error(err);

      localStorage.removeItem("si_token");
      localStorage.removeItem("si_login_time");
      disconnectAdminSocket();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Login
  const login = async (email, password) => {
    const { data } = await axios.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("si_token", data.token);

    const now = new Date().toISOString();
    localStorage.setItem("si_login_time", now);

    setUser(data.admin);
    setLoginTime(now);

    // Connect socket
    const socket = getAdminSocket(data.token);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      socket.emit("recruiter_connect", {
        recruiterId: data.admin._id || data.admin.id,
      });
    });

    console.log("Logged in Admin:", data.admin);

    return data;
  };

  // Logout
  const logout = () => {
    disconnectAdminSocket();

    localStorage.removeItem("si_token");
    localStorage.removeItem("si_login_time");

    setUser(null);
    setLoginTime(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginTime,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};