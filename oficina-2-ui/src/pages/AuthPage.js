import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Homepage from "./Homepage";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState("login"); 

  return (
    <>
      {currentPage === "login" && (
        <LoginPage
          onSwitch={() => setCurrentPage("register")}
          onLoginSuccess={() => setCurrentPage("homepage")} 
        />
      )}
      {currentPage === "register" && (
        <RegisterPage onSwitch={() => setCurrentPage("login")} />
      )}
      {currentPage === "homepage" && <Homepage />}
    </>
  );
};

export default AuthPage;
