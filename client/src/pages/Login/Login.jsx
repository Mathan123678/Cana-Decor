import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithToken, initiateGoogleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE GOOGLE CALLBACK
  // =====================================================

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const googleError = params.get("error");

    // Google authentication failed
    if (googleError) {
      const errorMsg =
        googleError === "invalid_google_state"
          ? "Login session expired or invalid. Please try again."
          : googleError === "google_email_not_verified"
          ? "Your Google account email is not verified."
          : "Google login failed. Please try again.";

      setError(errorMsg);
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
      return;
    }

    // Google authentication successful
    if (token) {
      setGoogleLoading(true);

      // Clean token from browser URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      loginWithToken(token).then((result) => {
        setGoogleLoading(false);
        if (result.success) {
          if (result.user?.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/customer-dashboard", { replace: true });
          }
        } else {
          setError(
            result.message ||
              "Google login succeeded, but user profile could not be loaded."
          );
        }
      });
    }
  }, [navigate, loginWithToken]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(
          result.message ||
            "Login failed. Please check your email and password."
        );
        return;
      }

      if (result.user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/customer-dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = () => {
    setError("");
    setGoogleLoading(true);
    initiateGoogleLogin();
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4 sm:px-6 py-10">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      <div className="absolute inset-0 bg-slate-950/85" />

      {/* Animated glow */}

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-3xl animate-pulse" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-3xl animate-pulse" />

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="hidden lg:flex relative min-h-[720px] overflow-hidden">

          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=90"
            alt="Event decoration"
            className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[2s]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/60 to-purple-900/10" />

          <div className="relative z-10 flex flex-col justify-end p-12">

            {/* Icon */}

            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-xl">
              <Sparkles
                className="text-yellow-300"
                size={32}
              />
            </div>

            <h2 className="text-5xl font-black text-white leading-tight">

              Turn Moments
              <br />

              Into{" "}

              <span className="text-yellow-300">
                Memories.
              </span>

            </h2>

            <p className="text-gray-200 mt-6 text-lg leading-relaxed max-w-md">
              Manage your events, explore beautiful
              decoration packages and create
              unforgettable celebrations with
              EventDecor.
            </p>

            {/* Stats */}

            <div className="flex gap-10 mt-10">

              <div>
                <p className="text-3xl font-black text-white">
                  100+
                </p>

                <p className="text-gray-300 text-sm">
                  Events
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">
                  50+
                </p>

                <p className="text-gray-300 text-sm">
                  Designs
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">
                  5★
                </p>

                <p className="text-gray-300 text-sm">
                  Experience
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="bg-white p-7 sm:p-10 lg:p-14 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="inline-block text-3xl font-black"
            >
              <span className="text-purple-700">
                Event
              </span>

              <span className="text-pink-500">
                Decor
              </span>
            </Link>

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mt-8">

              <div className="flex items-center gap-2">

                <p className="text-purple-600 font-bold uppercase tracking-[0.2em] text-sm">
                  Welcome Back
                </p>

                <Sparkles
                  size={16}
                  className="text-yellow-500"
                />

              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 leading-tight">

                Sign in to
                <br />

                your account

              </h1>

              <p className="text-gray-500 mt-4">
                Continue planning your perfect event.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl border border-gray-200 bg-white text-gray-800 font-bold shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {googleLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />

                  Connecting to Google...
                </>
              ) : (
                <>
                  {/* Google G */}

                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 font-black text-lg">
                    G
                  </span>

                  Continue with Google
                </>
              )}

            </button>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="relative my-7">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">

                <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                  OR CONTINUE WITH EMAIL
                </span>

              </div>

            </div>

            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">

                <button
                  type="button"
                  className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition"
                >
                  Forgot password?
                </button>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Signing in...

                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">

                    Sign In

                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition"
                    />

                  </span>
                )}

              </button>

            </form>

            {/* =================================================
                REGISTER
            ================================================= */}

            <div className="relative my-8">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">

                <span className="bg-white px-4 text-sm text-gray-400">
                  New to EventDecor?
                </span>

              </div>

            </div>

            <Link
              to="/register"
              className="block w-full text-center py-4 rounded-xl border-2 border-purple-600 text-purple-700 font-bold hover:bg-purple-600 hover:text-white hover:-translate-y-0.5 transition-all"
            >
              Create an Account
            </Link>

            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">

              <ShieldCheck size={15} />

              Secure authentication

            </div>

            {/* BACK */}

            <Link
              to="/"
              className="block text-center text-sm text-gray-400 hover:text-purple-600 mt-4"
            >
              ← Back to website
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;