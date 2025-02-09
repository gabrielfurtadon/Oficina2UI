import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const GenerateCertificates = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/workshops`)
      .then((res) => res.json())
      .then((data) => setWorkshops(data))
      .catch(() => alert("Erro ao carregar workshops"));
  }, []);

  const handleDownloadCertificates = async (workshop) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/certificados/workshops/${workshop.id}/zip`
      );

      if (!response.ok) {
        throw new Error("Erro ao baixar certificados.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      a.download = `certificados_${workshop.titulo}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center px-4 py-6">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate("/homepage")}
        className="flex items-center text-[#FFBE00] hover:text-[#e5ab00] mb-4"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      <h2 className="text-2xl font-bold text-[#000000] text-center mb-6">
        Geração de Certificados por Workshop
      </h2>

      {workshops.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          Nenhum workshop cadastrado.
        </p>
      ) : (
        <ul className="w-full max-w-3xl space-y-4">
          {workshops.map((workshop) => (
            <li
              key={workshop.id}
              className="p-4 bg-white rounded-md shadow flex justify-between items-center"
            >
              <span className="text-lg font-semibold">
                {workshop.titulo}
              </span>
              <button
                className="py-2 px-4 bg-[#FFBE00] text-white rounded-md"
                onClick={() => handleDownloadCertificates(workshop)}
              >
                Baixar certificados
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenerateCertificates;
