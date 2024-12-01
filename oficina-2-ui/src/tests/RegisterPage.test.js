import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../pages/RegisterPage";

describe("RegisterPage", () => {
  it("deve exibir erro para o campo de nome vazio ao tentar enviar o formulário", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "Senha123@" },
    });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), {
      target: { value: "Senha123@" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const nameError = await screen.findByText("Campo obrigatório");
    expect(nameError).toBeInTheDocument();
  });

  it("deve exibir erro para o campo de e-mail vazio ao tentar enviar o formulário", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "Senha123@" },
    });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), {
      target: { value: "Senha123@" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const emailError = await screen.findByText("Campo obrigatório");
    expect(emailError).toBeInTheDocument();
  });

  it("deve exibir erro para o campo de senha vazio ao tentar enviar o formulário", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), {
      target: { value: "Senha123@" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const passwordError = await screen.findByText("Campo obrigatório");
    expect(passwordError).toBeInTheDocument();
  });

  it("deve exibir erro para o campo de confirmação de senha vazio ao tentar enviar o formulário", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "Senha123@" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const confirmPasswordError = await screen.findByText("Campo obrigatório");
    expect(confirmPasswordError).toBeInTheDocument();
  });

  it("deve exibir erro quando a confirmação da senha não coincidir com a senha", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "Senha123@" },
    });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), {
      target: { value: "SenhaErrada123@" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const confirmPasswordError = await screen.findByText("As senhas não coincidem");
    expect(confirmPasswordError).toBeInTheDocument();
  });

  it("deve exibir erro quando a senha não segue os padrões", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Usuário Teste" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "senha" },
    });
    fireEvent.change(screen.getByLabelText("Confirme a senha"), {
      target: { value: "senha" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /registrar/i }));

    const passwordError = await screen.findByText(
      "A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
    );
    expect(passwordError).toBeInTheDocument();
  });
});
