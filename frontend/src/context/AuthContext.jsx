import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (user_type, email, password) => {
    try {
      if (!email || !password || !user_type) {
        const msg = "Fadlan geli meelaha banaan.";
        toast.error(msg);
        return { status: "fail", message: msg };
      }

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5555/login",
        {
          user_type,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: () => true, // ✅ always handle manually
        }
      );

      const { status, message, values } = response.data;

      if (status === "success") {
        toast.success(`Login successful. User type: ${user_type}`);
        setIsLogin(true);

        const userId = values?.[0]?.[1];
        window.localStorage.setItem("isLogin", "true");
        window.localStorage.setItem("user_type", user_type);

        switch (user_type) {
          case "admin":
            window.localStorage.setItem("admin_id", userId);
            navigate("/admin-dashboard");
            break;
          case "teacher":
            window.localStorage.setItem("teacher_id", userId);
            navigate("/Teaceher-Dashboard");
            break;
          case "student":
            window.localStorage.setItem("student_id", userId);
            navigate("/Check-schedule");
            break;
          default:
            toast.error("Nooca isticmaalaha lama aqoonsan.");
            return { status: "fail", message: "Nooca isticmaalaha lama aqoonsan." };
        }

        return { status: "success" };
      } else {
        // Show fail message from backend
        toast.error(message || "Email ama password khalad ah");
        return { status: "fail", message };
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Unexpected server error.";
      console.error("Login error:", message, error);
      toast.error(message);
      return { status: "error", message };
    } finally {
      setLoading(false);
    }
  };

  const values = {
    isLogin,
    login,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
