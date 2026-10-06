import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { API_URL, SERVER_URL } from "../config/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // INITIALIZE AUTH FROM STORAGE
  // =====================================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error("Invalid stored user JSON:", error);
              localStorage.removeItem("user");
            }
          } else {
            // Token exists but user object doesn't - fetch profile
            try {
              const response = await axios.get(
                `${API_URL}/users/profile`,
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                  },
                }
              );

              if (response.data.success && response.data.user) {
                localStorage.setItem(
                  "user",
                  JSON.stringify(response.data.user)
                );
                setUser(response.data.user);
              }
            } catch (error) {
              console.error("Profile fetch error on init:", error);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // =====================================================
  // LOGIN WITH TOKEN (used for Google OAuth callback)
  // =====================================================

  const loginWithToken = async (receivedToken) => {
    try {
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);

      const response = await axios.get(
        `${API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${receivedToken}`,
          },
        }
      );

      const profileUser =
        response.data?.user || response.data?.data?.user;

      if (profileUser) {
        localStorage.setItem("user", JSON.stringify(profileUser));
        setUser(profileUser);
        return { success: true, user: profileUser };
      }

      throw new Error("Unable to retrieve user profile");
    } catch (error) {
      console.error("loginWithToken Error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to verify authentication token",
      };
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Register Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Login Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // =====================================================
  // START GOOGLE LOGIN REDIRECT
  // =====================================================

  const initiateGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithToken,
        register,
        logout,
        initiateGoogleLogin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};