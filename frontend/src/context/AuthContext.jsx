// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [loading, setLoading] = useState(true); // Add a loading state
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check`, { withCredentials: true });
        //   console.log("Authentication check successful:", response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Authentication check failed:", error);
          setIsLoggedIn(false);
        } finally {
          setLoading(false); // Set loading to false after the check is complete
        }
      };
  
      checkAuth();
    }, [navigate]);
  
    if (loading) {
      return <Loader />; // Show a loading spinner while checking auth
    }
  

    const logout = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { 
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache'  // Add cache control
          }
        });
        setIsLoggedIn(false);
        // Clear any local storage/state before navigation
        localStorage.clear(); 
        sessionStorage.clear();
        navigate("/login", { replace: true }); // Use replace to prevent back navigation
      } catch (error) {
        console.error("Logout failed:", error);
        throw error; // Re-throw to handle in component
      }
    };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout,loading,setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};