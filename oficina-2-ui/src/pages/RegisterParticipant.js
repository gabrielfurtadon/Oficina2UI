import React, { useState } from "react";
import { FaUserPlus, FaList, FaSpinner } from "react-icons/fa";

const RegisterParticipant = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    ra: "",
  });
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (name === "fullName") {
        updatedErrors.fullName = value ? "" : "Campo obrigatório";
      }

      if (name === "ra") {
        updatedErrors.ra = value ? "" : "Campo obrigatório";
      }

      return updatedErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.ra) {
      setErrors({
        fullName: !formData.fullName ? "Campo obrigatório" : "",
        ra: !formData.ra ? "Campo obrigatório" : "",
      });
      return;
    }

    if (participants.some((p) => p.ra === formData.ra)) {
      setErrors({ ra: "Este RA já está cadastrado!" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setParticipants([...participants, { ...formData }]);
      setFormData({ fullName: "", ra: "" });
      setLoading(false);
      setErrors({});
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#000000]">Cadastrar Participante</h2>
          <p className="text-gray-600 mt-2">Informe os dados abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
              placeholder="Digite o nome completo"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="ra" className="block text-sm font-medium text-gray-700">
              RA (Registro Acadêmico)
            </label>
            <input
              type="text"
              id="ra"
              name="ra"
              value={formData.ra}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.ra ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
              placeholder="Digite o RA"
            />
            {errors.ra && <p className="mt-1 text-sm text-red-600">{errors.ra}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#FFBE00] hover:bg-[#e5ab00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto h-5 w-5" /> : "Cadastrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            className="text-sm text-[#FFBE00] hover:text-[#e5ab00] flex items-center justify-center space-x-2"
            onClick={() => alert(JSON.stringify(participants, null, 2))}
          >
            <FaList /> <span>Ver Participantes Cadastrados</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterParticipant;
