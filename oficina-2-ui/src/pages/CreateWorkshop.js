import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const CreateWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data: "",
    duracao: "1",
    numeroMaxParticipantes: "",
    tipoEvento: "PRESENCIAL",
    participantes: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };

    if (name === "duracao" && parseInt(value, 10) < 1) {
      newErrors.duracao = "A duração deve ser de pelo menos 1 hora.";
    } else {
      delete newErrors.duracao;
    }

    if (name === "numeroMaxParticipantes" && parseInt(value, 10) < 1) {
      newErrors.numeroMaxParticipantes = "Deve ter pelo menos 1 participante.";
    } else {
      delete newErrors.numeroMaxParticipantes;
    }

    setErrors(newErrors);
  };

  const validateFields = () => {
    let newErrors = {};

    if (!formData.titulo) newErrors.titulo = "Campo obrigatório";
    if (!formData.data) newErrors.data = "Campo obrigatório";
    if (!formData.duracao || parseInt(formData.duracao, 10) < 1)
      newErrors.duracao = "A duração deve ser de pelo menos 1 hora.";
    if (!formData.numeroMaxParticipantes || parseInt(formData.numeroMaxParticipantes, 10) < 1)
      newErrors.numeroMaxParticipantes = "Deve ter pelo menos 1 participante.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar workshop");
      }

      alert("Workshop cadastrado com sucesso!");
      navigate("/workshops");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <button onClick={() => navigate("/homepage")} className="flex items-center text-[#FFBE00] hover:text-[#e5ab00] mb-4">
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <h2 className="text-2xl font-bold text-[#000000] text-center">Cadastrar Workshop</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Digite o título do workshop"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`block w-full p-2 border ${errors.titulo ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.titulo && <p className="text-red-500 text-sm flex items-center"><FaExclamationCircle className="mr-1" /> {errors.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea
              name="descricao"
              placeholder="Digite uma breve descrição"
              value={formData.descricao}
              onChange={handleInputChange}
              className="block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className={`block w-full p-2 border ${errors.data ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.data && <p className="text-red-500 text-sm flex items-center"><FaExclamationCircle className="mr-1" /> {errors.data}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duração (horas)</label>
            <input
              type="number"
              name="duracao"
              min="1"
              placeholder="Informe a duração do workshop"
              value={formData.duracao}
              onChange={handleInputChange}
              className={`block w-full p-2 border ${errors.duracao ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.duracao && <p className="text-red-500 text-sm flex items-center"><FaExclamationCircle className="mr-1" /> {errors.duracao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número máximo de participantes</label>
            <input
              type="number"
              name="numeroMaxParticipantes"
              min="1"
              placeholder="Informe o limite de participantes"
              value={formData.numeroMaxParticipantes}
              onChange={handleInputChange}
              className={`block w-full p-2 border ${errors.numeroMaxParticipantes ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.numeroMaxParticipantes && <p className="text-red-500 text-sm flex items-center"><FaExclamationCircle className="mr-1" /> {errors.numeroMaxParticipantes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
            <select name="tipoEvento" value={formData.tipoEvento} onChange={handleInputChange} className="block w-full p-2 border rounded-md">
              <option value="PRESENCIAL">Presencial</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-[#FFBE00] text-white rounded-md disabled:opacity-50">
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshop;
