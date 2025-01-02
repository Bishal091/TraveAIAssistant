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
          const response = await axios.get("http://localhost:5000/api/auth/check", { withCredentials: true });
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
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout,loading,setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};