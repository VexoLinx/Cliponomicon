import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { registerUser } from "../../../services/api/auth.api";

export const useRegisterForm = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await registerUser(formData, {
        token,
      });

      setStatus({ type: "success", message: "Usuario registrado con exito." });
      setFormData({ username: "", password: "", role: "user" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    status,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
