"use client";
import React, { useCallback, useEffect, useState } from "react";
import UserContext from "../context/user";
import { fetchUser } from "../helper/backend";
import { usePathname, useRouter } from "next/navigation";


const authPaths = ["/sign-in", "/sign-up", "/reset-password", "/forgot-password"];

const UserProviders = ({ children }) => {
  const [active, setActive] = useState("dashboard");
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState({});
  const path = usePathname();
  const router = useRouter();

  const getUser = useCallback(async () => {
    try {
      setUserLoading(true);
      const { data, error } = await fetchUser();
      if (!error) {
        setUser(data);
      } else {
        setUser({});
      }
    } catch (err) {
      setUser({});
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (userLoading) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (user?.role) {
      if (user.role === "admin" && path.startsWith("/user")) {
        router.replace("/admin");
        return;
      }
      if (user.role === "user" && path.startsWith("/admin")) {
        router.replace("/user");
        return;
      }
    }

    if (token && authPaths.includes(path)) {
      const redirectPath = user?.role === "admin" ? "/admin" : "/user";
      router.replace(redirectPath);
    }
  }, [user, userLoading, path, router]);

  if (userLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, getUser, active, setActive, userLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProviders;
