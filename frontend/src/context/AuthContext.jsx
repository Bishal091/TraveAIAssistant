import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/check`, 
        { 
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (response.status === 200) {
        // Clear any local storage items
        localStorage.clear();
        sessionStorage.clear();
        
        // Update state
        setIsLoggedIn(false);
        
        // Navigate to login
        navigate("/login", { replace: true });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, loading, setIsLoggedIn }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
