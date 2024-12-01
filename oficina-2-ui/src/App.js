import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../src/pages/AuthPage";
import Homepage from "../src/pages/HomePage"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default App;
