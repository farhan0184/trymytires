import { createContext, useContext } from "react";

const UserContext = createContext({
  user: {},
  setUser: () => {},
  getUser: () => {},
  active: "dashboard",
  setActive: () => {},
  userLoading: true,
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;