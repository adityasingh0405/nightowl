import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("streamverse_users", []);
  const [currentUser, setCurrentUser] = useLocalStorage("streamverse_current_user", null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  const signup = (name, email, password) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error("Email already in use");
    }
    
    const newUser = { id: Date.now().toString(), name, email, password };
    setUsers([...users, newUser]);
    
    // Auto-login after signup
    const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
    setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
    setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (updates) => {
    if (!currentUser) return;
    
    // Update the master users list
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updates };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Update current session user (exclude password)
    const updatedCurrentUser = { ...currentUser, ...updates };
    delete updatedCurrentUser.password; // Don't store password in session state
    setCurrentUser(updatedCurrentUser);
    
    return updatedCurrentUser;
  };

  const getPassword = () => {
    if (!currentUser) return "";
    const userRecord = users.find(u => u.id === currentUser.id);
    return userRecord ? userRecord.password : "";
  };

  const value = {
    user: currentUser,
    isAuthenticated,
    signup,
    login,
    logout,
    updateUser,
    getPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
