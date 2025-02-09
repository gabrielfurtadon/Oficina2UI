import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaUsers, FaChevronDown, FaChevronUp, FaTimes, FaCheckSquare, FaExclamationTriangle } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const WorkshopsList = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [expandedWorkshop, setExpandedWorkshop] = useState(null);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isManagingParticipants, setIsManagingParticipants] = useState(false);
  const [error409, setError409] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/workshops`)
      .then((res) => res.json())
      .then((data) => setWorkshops(data))
      .catch(() => alert("Erro ao carregar workshops"));
  }, []);

  const handleExpand = (id) => {
    setExpandedWorkshop(expandedWorkshop === id ? null : id);
  };

  const handleEditClick = (workshop) => {
    setEditingWorkshop({ ...workshop });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingWorkshop({ ...editingWorkshop, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workshops/${editingWorkshop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWorkshop),
      });

      if (!response.ok) throw new Error("Erro ao atualizar workshop");

      setWorkshops(workshops.map(w => w.id === editingWorkshop.id ? editingWorkshop : w));
      setIsEditing(false);
    } catch {
      alert("Erro ao atualizar workshop");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este workshop?")) return;

    try {
      await fetch(`${API_BASE_URL}/workshops/${id}`, { method: "DELETE" });
      setWorkshops(workshops.filter(w => w.id !== id));
    } catch {
      alert("Erro ao excluir workshop");
    }
  };

  const handleManageParticipants = async (workshop) => {
    setIsManagingParticipants(true);
    setEditingWorkshop(workshop);

    try {
      const response = await fetch(`${API_BASE_URL}/participantes`);
      const data = await response.json();
      setParticipants(data);
      setSelectedParticipants(workshop.participantes.map(p => p.ra));
    } catch {
      alert("Erro ao carregar participantes");
    }
  };

  const handleToggleParticipant = (ra) => {
    setSelectedParticipants(prev =>
      prev.includes(ra) ? prev.filter(p => p !== ra) : [...prev, ra]
    );
  };

  const handleSaveParticipants = async () => {
    const novosParticipantes = selectedParticipants.filter(ra => 
      !editingWorkshop.participantes.some(p => p.ra === ra)
    );

    try {
      const response = await fetch(`${API_BASE_URL}/workshops/participantes/${editingWorkshop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantes: novosParticipantes }),
      });

      if (response.status === 409) {
        setError409(true);
        return;
      }

      setWorkshops(workshops.map(w =>
        w.id === editingWorkshop.id ? { ...w, participantes: participants.filter(p => selectedParticipants.includes(p.ra)) } : w
      ));

      setIsManagingParticipants(false);
    } catch {
      alert("Erro ao atualizar participantes");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <button onClick={() => navigate("/homepage")} className="flex items-center text-[#FFBE00] hover:text-[#e5ab00] mb-4">
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <h2 className="text-2xl font-bold text-[#000000] text-center">Workshops Cadastrados</h2>

        {workshops.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">Ainda não há workshops cadastrados.</p>
        ) : (
          <ul className="space-y-4 mt-6">
            {workshops.map((workshop) => (
              <li key={workshop.id} className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-semibold">{workshop.titulo}</h3>
                <p><strong>Descrição:</strong> {workshop.descricao || "Sem descrição"}</p>
                <p><strong>Data:</strong> {workshop.data}</p>
                <p><strong>Duração:</strong> {workshop.duracao} horas</p>
                <p><strong>Número máximo de participantes:</strong> {workshop.numeroMaxParticipantes}</p>
                <p><strong>Tipo:</strong> {workshop.tipoEvento}</p>

                <button onClick={() => handleExpand(workshop.id)} className="mt-2 text-blue-600 flex items-center">
                  {expandedWorkshop === workshop.id ? <FaChevronUp /> : <FaChevronDown />} Participantes
                </button>

                {expandedWorkshop === workshop.id && (
                  <div className="mt-2 text-sm">
                    {workshop.participantes.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {workshop.participantes.map((p) => (
                          <li key={p.ra}>{p.name} (RA: {p.ra})</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Nenhum participante cadastrado</p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <button onClick={() => handleEditClick(workshop)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(workshop.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                  <button onClick={() => handleManageParticipants(workshop)} className="text-green-600 hover:text-green-800">
                    <FaUsers />
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
            <h2 className="text-xl font-bold">Editar Workshop</h2>
            <input type="text" value={editingWorkshop.titulo} onChange={handleInputChange} name="titulo" className="block w-full p-2 border rounded-md mt-2" />
            <button onClick={handleSaveEdit} className="w-full py-2 bg-blue-500 text-white rounded-md mt-4">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopsList;
