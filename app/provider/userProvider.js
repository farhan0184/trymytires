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

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Check if path starts with /admin or /user (including sub-routes)
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/user");
  
  if (isProtectedRoute && typeof window !== "undefined" && !token) {
    window.location.href = '/sign-in';
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loader while user data is being fetched
  if (userLoading && isProtectedRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
