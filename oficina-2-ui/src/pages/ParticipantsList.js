import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaEdit, FaTimes, FaSave } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const ParticipantsList = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState({ id: "", name: "", ra: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/participantes`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch(() => alert("Erro ao carregar participantes"));
  }, []);

  const handleDelete = async (ra) => {
    try {
      await fetch(`${API_BASE_URL}/participantes/${ra}`, { method: "DELETE" });
      setParticipants(participants.filter((p) => p.ra !== ra));
    } catch {
      alert("Erro ao excluir participante");
    }
  };

  const handleEdit = (participant) => {
    setCurrentParticipant({ ...participant });
    setErrors({});
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!currentParticipant.name || !currentParticipant.ra) {
      setErrors({ name: "Campo obrigatório", ra: "Campo obrigatório" });
      return;
    }

    const existingRA = participants.find((p) => p.ra === currentParticipant.ra && p.id !== currentParticipant.id);
    if (existingRA) {
      setErrors({ ra: `O RA "${currentParticipant.ra}" já está cadastrado para outro participante.` });
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/participantes/${currentParticipant.ra}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentParticipant),
      });

      setParticipants(
        participants.map((p) =>
          p.id === currentParticipant.id ? currentParticipant : p
        )
      );
      setIsEditing(false);
    } catch {
      alert("Erro ao atualizar participante");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#000000]">Participantes Cadastrados</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
        </div>

        {participants.length === 0 ? (
          <p className="text-gray-600 text-center">Nenhum participante cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li
                key={participant.ra}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold">{participant.name}</p>
                  <p className="text-sm text-gray-600">RA: {participant.ra}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(participant)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(participant.ra)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Participante</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                value={currentParticipant.name}
                onChange={(e) =>
                  setCurrentParticipant({ ...currentParticipant, name: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
                placeholder="Digite o nome completo"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">RA (Registro Acadêmico)</label>
              <input
                type="text"
                value={currentParticipant.ra}
                onChange={(e) =>
                  setCurrentParticipant({ ...currentParticipant, ra: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.ra ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFBE00]`}
                placeholder="Digite o RA"
              />
              {errors.ra && <p className="text-sm text-red-600">{errors.ra}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#FFBE00] text-white rounded-md hover:bg-[#e5ab00]"
              >
                <FaSave className="inline mr-2" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
