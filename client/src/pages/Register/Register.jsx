import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, initiateGoogleLogin } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await register(
        name,
        email,
        password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Image */}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-black/70" />

      {/* Glow Effects */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-[35px] overflow-hidden border border-white/20 shadow-2xl grid lg:grid-cols-2">

        {/* Left Side */}

        <div className="hidden lg:flex relative">

          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-900/70 to-transparent" />

          <div className="relative z-10 p-12 flex flex-col justify-end text-white">

            <Sparkles
              size={50}
              className="text-yellow-400 mb-6"
            />

            <h2 className="text-5xl font-black leading-tight">

              Create
              <br />
              Beautiful
              <br />
              Celebrations

            </h2>

            <p className="mt-6 text-gray-200 text-lg">
              Join EventDecor and explore premium
              event decoration services, elegant
              themes and unforgettable memories.
            </p>

            <div className="flex gap-8 mt-10">

              <div>
                <h3 className="text-3xl font-black">
                  100+
                </h3>
                <p>Events</p>
              </div>

              <div>
                <h3 className="text-3xl font-black">
                  50+
                </h3>
                <p>Themes</p>
              </div>

              <div>
                <h3 className="text-3xl font-black">
                  5★
                </h3>
                <p>Reviews</p>
              </div>

            </div>

          </div>
        </div>

        {/* Right Side */}

        <div className="bg-white p-8 md:p-14">

          <Link
            to="/"
            className="text-3xl font-black"
          >
            <span className="text-purple-700">
              Event
            </span>

            <span className="text-pink-500">
              Decor
            </span>
          </Link>

          <div className="mt-8">

            <p className="uppercase tracking-widest text-purple-600 font-bold text-sm">
              Create Account
            </p>

            <h1 className="text-5xl font-black text-gray-900 mt-3">
              Join Us Today
            </h1>

            <p className="text-gray-500 mt-3">
              Create your account and start
              planning your dream event.
            </p>

          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* GOOGLE SIGN UP */}
          <button
            type="button"
            onClick={initiateGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl border border-gray-200 bg-white text-gray-800 font-bold shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 font-black text-lg">
              G
            </span>
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                OR REGISTER WITH EMAIL
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="font-semibold text-gray-700 block mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="font-semibold text-gray-700 block mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="font-semibold text-gray-700 block mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
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
                  placeholder="Create password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="font-semibold text-gray-700 block mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight size={20} />
                </span>
              )}
            </button>

          </form>

          {/* Login Link */}

          <div className="mt-8 text-center">

            <p className="text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="text-purple-600 font-bold hover:text-purple-800"
            >
              Login Here
            </Link>

          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">

            <ShieldCheck size={16} />

            Secure Registration

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;