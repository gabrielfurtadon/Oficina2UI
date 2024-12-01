import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginPage onSwitch={() => setIsLogin(false)} />
  ) : (
    <RegisterPage onSwitch={() => setIsLogin(true)} />
  );
};

export default AuthPage;
