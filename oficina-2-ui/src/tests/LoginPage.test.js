import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";

describe("LoginPage", () => {
  it("deve exibir erro para o campo de e-mail vazio ao tentar enviar o formulário", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/senha/i), {
        target: { value: "senha123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }));

    const emailError = await screen.findByText("Campo obrigatório");
    expect(emailError).toBeInTheDocument();
    });

  it("deve exibir erro para o campo de senha vazio ao tentar enviar o formulário", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "teste@utfpr.edu.br" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }));

    const passwordError = await screen.findByText("Campo obrigatório");
    expect(passwordError).toBeInTheDocument();
    });

  it("deve exibir um erro para e-mail inválido", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "emailinvalido" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText("Informe um e-mail válido pertencente à @utfpr.edu.br")).toBeInTheDocument();
  });

  it("deve permitir o envio do formulário quando todos os campos forem válidos", async () => {
    const mockSubmit = jest.fn();

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@utfpr.edu.br" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(mockSubmit).not.toThrow());
  });
});
