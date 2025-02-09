import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaEdit, FaTimes, FaSave } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const ParticipantsList = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
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

    if (
      participants.some(
        (p) => p.ra === currentParticipant.ra && p.id !== currentParticipant.id
      )
    ) {
      setErrors({ ra: "Este RA já está cadastrado!" });
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
          p.ra === currentParticipant.ra ? currentParticipant : p
        )
      );
      setIsEditing(false);
    } catch {
      alert("Erro ao atualizar participante");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#000000] mb-6">Participantes Cadastrados</h2>

        {participants.length === 0 ? (
          <p className="text-gray-600 text-center">Nenhum participante cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li key={participant.ra} className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
                <div>
                  <p className="text-lg font-semibold">{participant.name}</p>
                  <p className="text-sm text-gray-600">RA: {participant.ra}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(participant)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(participant.ra)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
