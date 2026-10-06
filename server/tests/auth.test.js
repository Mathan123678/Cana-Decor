import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Authentication Routes Validation", () => {
  it("POST /api/auth/register should fail when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("POST /api/auth/login should fail when email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("required");
  });

  it("POST /api/auth/login should fail for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent_user_99999@test.com",
        password: "wrongpassword123",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
