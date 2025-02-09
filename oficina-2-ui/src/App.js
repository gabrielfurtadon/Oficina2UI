import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../src/pages/AuthPage";
import Homepage from "../src/pages/HomePage"; 
import RegisterParticipant from "../src/pages/RegisterParticipant";
import ParticipantsList from "../src/pages/ParticipantsList";
import CreateWorkshop from "./pages/CreateWorkshop";
import WorkshopsList from "./pages/WorkshopsList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/homepage" element={<Homepage />} />
        <Route path="/cadastrar-participante" element={<RegisterParticipant />} />
        <Route path="/participantes" element={<ParticipantsList />} />
        <Route path="/cadastrar-workshop" element={<CreateWorkshop />} />
        <Route path="/workshops" element={<WorkshopsList />} />
      </Routes>
    </Router>
  );
};

export default App;
