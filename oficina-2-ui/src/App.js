import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../src/pages/AuthPage";
import Homepage from "../src/pages/HomePage"; 
import RegisterParticipant from "../src/pages/RegisterParticipant";
import ParticipantsList from "../src/pages/ParticipantsList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/homepage" element={<Homepage />} />
        <Route path="/cadastrar-participante" element={<RegisterParticipant />} />
        <Route path="/participantes" element={<ParticipantsList />} />
      </Routes>
    </Router>
  );
};

export default App;
