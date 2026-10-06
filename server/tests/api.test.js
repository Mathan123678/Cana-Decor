import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API Health & Routing Endpoints", () => {
  it("GET / should return 200 and API health message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Event Decoration Management API");
  });

  it("GET /api/nonexistent-route should return 404 Route not found", async () => {
    const res = await request(app).get("/api/nonexistent-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Route not found");
  });
});
