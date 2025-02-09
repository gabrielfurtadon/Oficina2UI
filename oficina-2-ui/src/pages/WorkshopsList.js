import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const WorkshopsList = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [expandedWorkshop, setExpandedWorkshop] = useState(null);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [currentWorkshopForParticipants, setCurrentWorkshopForParticipants] = useState(null);

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
      const response = await fetch(
        `${API_BASE_URL}/workshops/${editingWorkshop.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingWorkshop),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar workshop");

      setWorkshops(
        workshops.map((w) =>
          w.id === editingWorkshop.id ? editingWorkshop : w
        )
      );
      setIsEditing(false);
    } catch {
      alert("Erro ao atualizar workshop");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este workshop?")) return;

    try {
      await fetch(`${API_BASE_URL}/workshops/${id}`, { method: "DELETE" });
      setWorkshops(workshops.filter((w) => w.id !== id));
    } catch {
      alert("Erro ao excluir workshop");
    }
  };

  const openParticipantsModal = (workshop) => {
    setCurrentWorkshopForParticipants(workshop);
    const initialSelected = workshop.participantes.map((p) => p.ra);
    setSelectedParticipants(initialSelected);

    fetch(`${API_BASE_URL}/participantes`)
      .then((res) => res.json())
      .then((data) => setParticipantsList(data))
      .catch(() => alert("Erro ao carregar participantes"));

    setShowParticipantsModal(true);
  };

  const handleToggleParticipant = (ra) => {
    if (selectedParticipants.includes(ra)) {
      setSelectedParticipants(selectedParticipants.filter((item) => item !== ra));
    } else {
      setSelectedParticipants([...selectedParticipants, ra]);
    }
  };

  // Salva os participantes selecionados para o workshop, sobrescrevendo a formação anterior
  const handleSaveParticipants = async () => {
    if (!currentWorkshopForParticipants) return;

    const finalCount = selectedParticipants.length;

    try {
      const response = await fetch(
        `${API_BASE_URL}/workshops/participantes/${currentWorkshopForParticipants.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Envia todos os participantes escolhidos para o back, que deverá substituir os existentes
          body: JSON.stringify({ participantes: selectedParticipants }),
        }
      );

      if (response.status === 409) {
        alert(
          `A escolha ultrapassa o limite de participantes: ${finalCount} (escolhidos) / ${currentWorkshopForParticipants.numeroMaxParticipantes}`
        );
        return;
      }

      if (!response.ok) throw new Error("Erro ao atualizar participantes");

      // Atualiza localmente o workshop com a nova formação de participantes
      const updatedParticipants = participantsList.filter((p) =>
        selectedParticipants.includes(p.ra)
      );
      const updatedWorkshop = {
        ...currentWorkshopForParticipants,
        participantes: updatedParticipants,
      };

      setWorkshops(
        workshops.map((w) =>
          w.id === updatedWorkshop.id ? updatedWorkshop : w
        )
      );
      setShowParticipantsModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={() => navigate("/homepage")}
          className="flex items-center text-[#FFBE00] hover:text-[#e5ab00] mb-4"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <h2 className="text-2xl font-bold text-[#000000] text-center">
          Workshops Cadastrados
        </h2>

        {workshops.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            Ainda não há workshops cadastrados.
          </p>
        ) : (
          <ul className="space-y-4 mt-6">
            {workshops.map((workshop) => (
              <li key={workshop.id} className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-semibold">{workshop.titulo}</h3>
                <p>
                  <strong>Descrição:</strong>{" "}
                  {workshop.descricao || "Sem descrição"}
                </p>
                <p>
                  <strong>Data:</strong> {workshop.data}
                </p>
                <p>
                  <strong>Duração:</strong> {workshop.duracao} horas
                </p>
                <p>
                  <strong>Número máximo de participantes:</strong>{" "}
                  {workshop.numeroMaxParticipantes}
                </p>
                <p>
                  <strong>Tipo:</strong> {workshop.tipoEvento}
                </p>

                <button
                  onClick={() => handleExpand(workshop.id)}
                  className="mt-2 text-blue-600 flex items-center"
                >
                  {expandedWorkshop === workshop.id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}{" "}
                  Participantes
                </button>

                {expandedWorkshop === workshop.id && (
                  <div className="mt-2 text-sm">
                    {workshop.participantes.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {workshop.participantes.map((p) => (
                          <li key={p.ra}>
                            {p.name} (RA: {p.ra})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        Nenhum participante cadastrado
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleEditClick(workshop)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(workshop.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                  {/* Botão para gerenciar participantes */}
                  <button
                    onClick={() => openParticipantsModal(workshop)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaUsers />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de Edição de Workshop */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Workshop</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaTimes />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={editingWorkshop.titulo}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={editingWorkshop.descricao}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={editingWorkshop.data}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duração (horas)
                </label>
                <input
                  type="number"
                  name="duracao"
                  value={editingWorkshop.duracao}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número máximo de participantes
                </label>
                <input
                  type="number"
                  name="numeroMaxParticipantes"
                  value={editingWorkshop.numeroMaxParticipantes}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Evento
                </label>
                <select
                  name="tipoEvento"
                  value={editingWorkshop.tipoEvento}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded-md"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="w-full py-2 bg-[#FFBE00] text-white rounded-md"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Participantes */}
      {showParticipantsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gerenciar Participantes</h2>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaTimes />
              </button>
            </div>

            <ul className="space-y-2">
              {participantsList.map((participant) => (
                <li key={participant.ra} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant.ra)}
                    onChange={() => handleToggleParticipant(participant.ra)}
                    className="mr-2"
                  />
                  <span>
                    {participant.name} (RA: {participant.ra})
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleSaveParticipants}
              className="mt-4 w-full py-2 bg-[#FFBE00] text-white rounded-md"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopsList;
