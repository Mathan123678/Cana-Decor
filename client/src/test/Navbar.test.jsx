import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";

describe("Navbar Component", () => {
  it("renders brand name and primary navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Decor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Packages/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Gallery/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Contact/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Book Now/i)).toBeInTheDocument();
  });
});
