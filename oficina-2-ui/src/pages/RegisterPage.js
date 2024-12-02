import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const RegisterPage = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@utfpr\.edu\.br$/i;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateFields = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Campo obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Informe um e-mail válido pertencente à @utfpr.edu.br";
    }

    if (!formData.password) {
      newErrors.password = "Campo obrigatório";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Campo obrigatório";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (name === "name") {
        if (!value) {
          updatedErrors.name = "Campo obrigatório";
        } else {
          delete updatedErrors.name;
        }
      }

      if (name === "email") {
        if (!value) {
          updatedErrors.email = "Campo obrigatório";
        } else if (!validateEmail(value)) {
          updatedErrors.email = "Informe um e-mail válido pertencente à @utfpr.edu.br";
        } else {
          delete updatedErrors.email;
        }
      }

      if (name === "password") {
        if (!value) {
          updatedErrors.password = "Campo obrigatório";
        } else if (!validatePassword(value)) {
          updatedErrors.password =
            "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.";
        } else {
          delete updatedErrors.password;
        }
      }

      if (name === "confirmPassword") {
        if (!value) {
          updatedErrors.confirmPassword = "Campo obrigatório";
        } else if (value !== formData.password) {
          updatedErrors.confirmPassword = "As senhas não coincidem";
        } else {
          delete updatedErrors.confirmPassword;
        }
      }

      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/instrutor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar");
      }

      onSwitch();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#000000]">Registre-se</h2>
          <p className="text-gray-600 mt-2">Crie sua conta de instrutor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
              placeholder="Seu nome completo"
              aria-label="Nome"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
              placeholder="seu.email@utfpr.edu.br"
              aria-label="Email Address"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
                aria-label="Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirme a senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
              aria-label="Confirm Password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              Object.keys(errors).length > 0 ||
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword
            }
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#FFBE00] hover:bg-[#e5ab00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto h-5 w-5" /> : "Registrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitch}
            className="text-sm text-[#FFBE00] hover:text-[#e5ab00] focus:outline-none transition-colors duration-200"
          >
            Já possui uma conta? Entre aqui!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
