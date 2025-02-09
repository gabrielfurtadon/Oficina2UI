import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaList, FaSpinner } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080"; 

const RegisterParticipant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", ra: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : "Campo obrigatório",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.ra) {
      setErrors({
        name: !formData.name ? "Campo obrigatório" : "",
        ra: !formData.ra ? "Campo obrigatório" : "",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/participantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar");
      }

      setFormData({ name: "", ra: "" });
      alert("Participante cadastrado com sucesso!");
    } catch (error) {
      setErrors({ ra: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#000000] text-center">Cadastrar Participante</h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#FFBE00]"
              placeholder="Digite o nome completo"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">RA (Registro Acadêmico)</label>
            <input
              type="text"
              name="ra"
              value={formData.ra}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#FFBE00]"
              placeholder="Digite o RA"
            />
            {errors.ra && <p className="text-sm text-red-600">{errors.ra}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#FFBE00] text-white rounded-md hover:bg-[#e5ab00] disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto h-5 w-5" /> : "Cadastrar"}
          </button>
        </form>

        <button
          onClick={() => navigate("/participantes")}
          className="mt-6 text-[#FFBE00] hover:text-[#e5ab00] flex items-center justify-center"
        >
          <FaList className="mr-2" /> Ver Participantes Cadastrados
        </button>
      </div>
    </div>
  );
};

export default RegisterParticipant;
