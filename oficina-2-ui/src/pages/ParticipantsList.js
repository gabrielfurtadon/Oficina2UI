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
    if (!currentParticipant.fullName || !currentParticipant.ra) {
      setErrors({ fullName: "Campo obrigatório", ra: "Campo obrigatório" });
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
    <div>
      {/* Lista de participantes */}
      <button onClick={() => navigate(-1)}>Voltar</button>
      {participants.map((participant) => (
        <div key={participant.ra}>
          <p>{participant.fullName} - RA: {participant.ra}</p>
          <button onClick={() => handleEdit(participant)}>Editar</button>
          <button onClick={() => handleDelete(participant.ra)}>Excluir</button>
        </div>
      ))}

      {/* Modal de edição */}
      {isEditing && (
        <div>
          <input
            value={currentParticipant.fullName}
            onChange={(e) => setCurrentParticipant({ ...currentParticipant, fullName: e.target.value })}
          />
          <input
            value={currentParticipant.ra}
            onChange={(e) => setCurrentParticipant({ ...currentParticipant, ra: e.target.value })}
          />
          <button onClick={handleSaveEdit}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
