import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Google OAuth Authentication Routes", () => {
  it("GET /api/auth/google should redirect to Google OAuth login URL with state cookie", async () => {
    const res = await request(app).get("/api/auth/google");

    // Must be a 302 redirect
    expect(res.status).toBe(302);

    const redirectUrl = res.headers.location;
    expect(redirectUrl).toBeDefined();
    expect(redirectUrl).toContain("accounts.google.com/o/oauth2/v2/auth");
    expect(redirectUrl).toContain("client_id=");
    expect(redirectUrl).toContain("scope=");
    expect(redirectUrl).toContain("state=");

    // Must set google_oauth_state cookie
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const hasStateCookie = cookies.some((c) =>
      c.includes("google_oauth_state")
    );
    expect(hasStateCookie).toBe(true);
  });

  it("GET /api/auth/google/callback should redirect to login with error when code is missing", async () => {
    const res = await request(app).get("/api/auth/google/callback");

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("/login?error=");
  });

  it("GET /api/auth/google/callback should redirect with error when state is invalid", async () => {
    const res = await request(app)
      .get("/api/auth/google/callback?code=mock_code&state=tampered_state")
      .set("Cookie", ["google_oauth_state=original_state"]);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("invalid_google_state");
  });

  it("POST /api/auth/google/verify should reject missing credential", async () => {
    const res = await request(app)
      .post("/api/auth/google/verify")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Google credential is required");
  });
});
