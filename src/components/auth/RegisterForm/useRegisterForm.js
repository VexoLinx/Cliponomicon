import { useState } from 'react';
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const REGISTER_URL = `${API_URL}/auth/register`;

export const useRegisterForm = () => {
  const { token } = useAuth(); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = 'Error al registrar usuario';
        if (data.detail) {
          errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
        }
        throw new Error(errorMsg);
      }

      setStatus({ type: 'success', message: '¡Usuario registrado con éxito!' });
      setFormData({ username: '', password: '', role: 'user' }); 

    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    status,
    isLoading,
    handleChange,
    handleSubmit
  };
};