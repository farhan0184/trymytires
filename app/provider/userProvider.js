'use client';
import React, { useCallback, useEffect, useState } from "react";
import UserContext from "../context/user";
import { fetchUser } from "../helper/backend";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const authPaths = ["/sign-in", "/sign-up", "/reset-password", "/forgot-password"];

const UserProviders = ({ children }) => {
  const [active, setActive] = useState("dashboard");
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState({});
  const path = usePathname();

  const getUser = useCallback(async () => {
    setUserLoading(true);
    const { data, error } = await fetchUser();
    if (!error) {
      setUser(data);
    } else {
      setUser({});
    }
    setUserLoading(false);
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // useEffect(() => {
  //   if (!userLoading && user?.role) {
  //     if (user.role === "admin" && path.startsWith("/user")) {
  //       window.location.href = "/admin";
  //     } else if (user.role === "user" && path.startsWith("/admin")) {
  //       window.location.href = "/user";
  //     }

  //     if (token && authPaths.includes(path)) {
  //       const redirectPath = user?.role === "admin" ? "/admin" : "/user";
  //       window.location.href = redirectPath;
  //     }
  //   }
  // }, [user, userLoading, path, token]);

  // const isRedirecting =
  //   userLoading ||
  //   (user?.role === "admin" && path.startsWith("/user")) ||
  //   (user?.role === "user" && path.startsWith("/admin")) ||
  //   (token && authPaths.includes(path));

  // if (isRedirecting) return null;

  return (
    <UserContext.Provider
      value={{ user, setUser, getUser, active, setActive, userLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProviders;
