import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login/Login.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

describe("Login Component", () => {
  it("renders email and password inputs along with the sign in button", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders Continue with Google button", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const googleBtn = screen.getByRole("button", {
      name: /continue with google/i,
    });
    expect(googleBtn).toBeInTheDocument();
  });

  it("displays validation error when submitting empty fields", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/please enter your email and password/i)
    ).toBeInTheDocument();
  });
});
