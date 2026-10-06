import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../src/utils/hashPassword.js";
import generateToken from "../src/utils/generateToken.js";
import { generateOAuthState, verifyOAuthState } from "../src/controllers/authController.js";
import jwt from "jsonwebtoken";

describe("Utility Functions", () => {
  it("should securely hash a password and verify it correctly", async () => {
    const rawPassword = "SecurePassword123!";
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(typeof hashed).toBe("string");
    expect(hashed.length).toBeGreaterThan(20);

    const isMatch = await comparePassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword("WrongPassword", hashed);
    expect(isWrongMatch).toBe(false);
  });

  it("should generate a valid JWT token with user id and role", () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-123";
    const token = generateToken("user_12345", "customer");

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe("user_12345");
    expect(decoded.role).toBe("customer");
  });

  it("should generate and verify signed OAuth state", () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-123";
    const state = generateOAuthState();

    expect(typeof state).toBe("string");
    expect(state.split(":").length).toBe(3);

    const isValid = verifyOAuthState(state);
    expect(isValid).toBe(true);

    const tampered = state.slice(0, -3) + "xyz";
    const isTamperedValid = verifyOAuthState(tampered);
    expect(isTamperedValid).toBe(false);

    expect(verifyOAuthState(null)).toBe(false);
    expect(verifyOAuthState("invalid:format")).toBe(false);
  });
});
