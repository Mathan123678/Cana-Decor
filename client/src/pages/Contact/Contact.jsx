import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config/api.js";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await axios.post(
        `${API_URL}/contacts`,
        formData
      );

      setSuccess(
        "Your message has been sent successfully! Our team will contact you soon."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-fuchsia-600 to-blue-600 px-6 py-24 text-white sm:px-10 lg:px-20">

        {/* Background effects */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur-md">
              <Sparkles
                size={17}
                className="text-yellow-300"
              />

              Let's Create Something Amazing
            </div>

            <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Let's Make Your
              <br />

              <span className="text-yellow-300">
                Event Unforgettable
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              Have an event in mind? Tell us what you are planning.
              Our team will help you create a beautiful and memorable
              celebration.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ====================================================== */}
      <section className="px-6 py-20 sm:px-10 lg:px-20">

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">

          {/* =================================================
              LEFT SIDE
          ================================================== */}
          <div>

            <span className="font-bold uppercase tracking-widest text-purple-600">
              Contact Us
            </span>

            <h2 className="mt-3 text-4xl font-black text-gray-900 sm:text-5xl">
              We'd Love To
              <span className="text-purple-600">
                {" "}Hear From You
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Whether you're planning a wedding, birthday, reception,
              corporate event, or any special celebration, we're here
              to help.
            </p>

            {/* Contact cards */}
            <div className="mt-10 space-y-5">

              {/* Phone */}
              <div className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                  <Phone size={25} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Call Us
                  </p>

                  <a
                    href="tel:+919876543210"
                    className="mt-1 block text-lg font-bold text-gray-900 hover:text-purple-600"
                  >
                    +91 98765 43210
                  </a>
                </div>

              </div>

              {/* Email */}
              <div className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
                  <Mail size={25} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Email Us
                  </p>

                  <a
                    href="mailto:eventdecor@gmail.com"
                    className="mt-1 block text-lg font-bold text-gray-900 hover:text-purple-600"
                  >
                    eventdecor@gmail.com
                  </a>
                </div>

              </div>

              {/* Location */}
              <div className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <MapPin size={25} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Visit Us
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    Erode, Tamil Nadu, India
                  </p>
                </div>

              </div>

              {/* Working hours */}
              <div className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition group-hover:bg-yellow-500 group-hover:text-white">
                  <Clock size={25} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Working Hours
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    Mon - Sun · 9:00 AM - 8:00 PM
                  </p>
                </div>

              </div>

            </div>

            {/* Quick booking */}
            <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-7 text-white shadow-xl">

              <div className="flex items-start gap-4">

                <MessageCircle
                  size={30}
                  className="mt-1 shrink-0"
                />

                <div>
                  <h3 className="text-xl font-bold">
                    Planning an event?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Skip the waiting and directly explore our event
                    packages.
                  </p>

                  <Link
                    to="/packages"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-purple-700 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    Explore Packages

                    <ArrowRight size={18} />
                  </Link>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE FORM
          ================================================== */}
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-2xl sm:p-10">

            <div className="mb-8">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Send size={25} />
              </div>

              <h2 className="mt-5 text-3xl font-black text-gray-900">
                Send Us A Message
              </h2>

              <p className="mt-2 text-gray-500">
                Fill out the form and our team will get back to you.
              </p>

            </div>

            {/* Success */}
            {success && (
              <div className="mb-6 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                <CheckCircle
                  size={22}
                  className="shrink-0"
                />

                <p className="text-sm font-medium">
                  {success}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Name + Email */}
              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

              </div>

              {/* Phone + Subject */}
              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Wedding decoration"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your event..."
                  rows={7}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-fuchsia-600
                  px-6
                  py-4
                  font-bold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message

                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </form>

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="px-6 pb-20 sm:px-10 lg:px-20">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 p-8 text-center text-white shadow-2xl sm:p-14">

          <Sparkles
            size={35}
            className="mx-auto mb-5 text-yellow-300"
          />

          <h2 className="text-3xl font-black sm:text-5xl">
            Ready To Create Your Dream Event?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/80">
            Let's turn your ideas into a beautiful celebration that
            you and your guests will remember forever.
          </p>

          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-purple-700 shadow-xl transition hover:-translate-y-1 hover:scale-105"
          >
            Book Your Event

            <ArrowRight size={20} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Contact;