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
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      cookies.remove("token");
      
      // Update state
      setIsLoggedIn(false);
      
      // Force a re-check of authentication
      await checkAuth();
      
      // Navigate to login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, loading, setIsLoggedIn }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};