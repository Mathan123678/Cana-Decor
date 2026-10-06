import prisma from "../config/prisma.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";

import { google } from "googleapis";
import crypto from "crypto";

// =====================================================
// Google OAuth Client & Helpers
// =====================================================

export const getGoogleOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

export const generateOAuthState = () => {
  const secret = process.env.JWT_SECRET || "google-auth-secret";
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}:${random}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
};

export const verifyOAuthState = (state) => {
  if (!state) return false;
  const parts = state.split(":");
  if (parts.length !== 3) return false;
  const [timestamp, random, signature] = parts;

  // Max age: 15 minutes
  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age < 0 || age > 15 * 60 * 1000) {
    return false;
  }

  const secret = process.env.JWT_SECRET || "google-auth-secret";
  const payload = `${timestamp}:${random}`;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
};

// =====================================================
// Register User
// =====================================================

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;
let { email } = req.body;

email = email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer",
      },
    });

    const token = generateToken(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// Login User
// =====================================================

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Clean email
    email = email.trim().toLowerCase();

    console.log("Login attempt:");
    console.log("Email:", email);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log("USER NOT FOUND:", email);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("USER FOUND:");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);

    // Check password
    const isPasswordCorrect = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or Password",
      });
    }

    // Generate JWT
    const token = generateToken(
      user.id,
      user.role
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// =====================================================
// =====================================================
// Start Google Login
// GET /api/auth/google
// =====================================================

export const googleLogin = async (req, res) => {
  try {
    const client = getGoogleOAuth2Client();
    const state = generateOAuthState();

    const authUrl = client.generateAuthUrl({
      access_type: "online",
      scope: ["openid", "email", "profile"],
      include_granted_scopes: true,
      state,
      prompt: "select_account",
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Store state temporarily in a cookie
    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.redirect(authUrl);
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start Google Login",
    });
  }
};

// =====================================================
// Google OAuth Callback
// GET /api/auth/google/callback
// =====================================================

export const googleCallback = async (req, res) => {
  const clientUrl =
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  try {
    const { code, state, error: oauthError } = req.query;

    // Handle user cancellation or Google error
    if (oauthError || !code) {
      console.warn("Google OAuth cancellation/error:", oauthError);
      return res.redirect(
        `${clientUrl}/login?error=${encodeURIComponent(
          oauthError || "google_login_cancelled"
        )}`
      );
    }

    // Validate OAuth state using both cookie and HMAC signature verification
    const savedState = req.cookies?.google_oauth_state;
    const isStateValid =
      (savedState && state === savedState) || verifyOAuthState(state);

    if (!isStateValid) {
      console.warn("Invalid Google OAuth state received");
      return res.redirect(
        `${clientUrl}/login?error=invalid_google_state`
      );
    }

    // Clear state cookie
    res.clearCookie("google_oauth_state");

    // Exchange authorization code for tokens
    const client = getGoogleOAuth2Client();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get Google user info
    const oauth2 = google.oauth2({
      auth: client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const googleEmail = data.email?.trim().toLowerCase();
    const googleName =
      data.name || data.given_name || "Google User";

    // Verified email check
    if (!googleEmail || data.verified_email !== true) {
      return res.redirect(
        `${clientUrl}/login?error=google_email_not_verified`
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        email: googleEmail,
      },
    });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          name: googleName,
          email: googleEmail,
          password: hashedPassword,
          role: "customer",
        },
      });
    }

    const token = generateToken(user.id, user.role);

    return res.redirect(
      `${clientUrl}/login?token=${encodeURIComponent(token)}`
    );
  } catch (error) {
    console.error("Google Callback Error:", error);

    return res.redirect(
      `${clientUrl}/login?error=google_login_failed`
    );
  }
};

// =====================================================
// Direct Google Token Verification (ID Token from Google Sign-In)
// POST /api/auth/google/verify
// =====================================================

export const googleTokenLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const client = getGoogleOAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || payload.email_verified !== true) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const googleEmail = payload.email.trim().toLowerCase();
    const googleName = payload.name || payload.given_name || "Google User";

    let user = await prisma.user.findUnique({
      where: {
        email: googleEmail,
      },
    });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          name: googleName,
          email: googleEmail,
          password: hashedPassword,
          role: "customer",
        },
      });
    }

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Google Login Successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Google Token Login Error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};