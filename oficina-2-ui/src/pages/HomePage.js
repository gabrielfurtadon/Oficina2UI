import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaChalkboardTeacher, FaCertificate, FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const buttons = [
    {
      id: 1,
      title: "Cadastrar Workshops",
      icon: <FaChalkboardTeacher className="text-3xl" />,
      description: "Crie os workshops",
      action: () => navigate("/cadastrar-workshop"), 
    },
    {
      id: 2,
      title: "Cadastrar Participantes",
      icon: <FaUserPlus className="text-3xl" />,
      description: "Registre participantes na base",
      action: () => navigate("/cadastrar-participante"), 
    },
    {
      id: 3,
      title: "Geração de Certificados por Workshop",
      icon: <FaCertificate className="text-3xl" />,
      description: "Emita certificados para os participantes dos workshops",
      action: () => navigate("/acessar-certificados"), 
    },
    {
      id: 4,
      title: "Gerencie Workshops",
      icon: <FaTasks className="text-3xl" />,
      description: "Edite, exclua e adicione participantes aos workshops cadastrados",
      action: () => navigate("/workshops"), 
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1] px-4 py-8 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000000] mb-4">
            ELLP Ensino Lúdico de Lógica e Programação
          </h1>
          <div className="h-1 w-32 bg-[#FFBE00] mx-auto rounded-full"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buttons.map((button) => (
            <motion.button
              key={button.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-8 rounded-xl bg-white shadow-lg transform transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFBE00] focus:ring-opacity-50 ${activeButton === button.id ? "border-2 border-[#FFBE00]" : ""}`}
              onClick={button.action}
              aria-label={button.title}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-[#FFBE00] rounded-full text-white">
                  {button.icon}
                </div>
                <h2 className="text-xl font-semibold text-[#000000] text-center">
                  {button.title}
                </h2>
                <p className="text-gray-600 text-center text-sm">
                  {button.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-600">
          <p>© 2024 ELLP. Todos os direitos reservados.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Homepage;
