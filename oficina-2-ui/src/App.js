import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../src/pages/AuthPage";
import Homepage from "../src/pages/HomePage"; 
import RegisterParticipant from "../src/pages/RegisterParticipant";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/homepage" element={<Homepage />} />
        <Route path="/cadastrar-participante" element={<RegisterParticipant />} />
      </Routes>
    </Router>
  );
};

export default App;
