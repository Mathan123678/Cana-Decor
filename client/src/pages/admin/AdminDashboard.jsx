import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/api.js";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // TOKEN
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bookings:", response.data);

      setBookings(response.data?.bookings || []);
    } catch (err) {
      console.error("Dashboard booking error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have admin permission.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTHENTICATION + LOAD
  // =====================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    fetchBookings();
  }, [user]);

  // =====================================================
  // SORT BOOKINGS BY EVENT DATE
  // =====================================================

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.eventDate);
    const dateB = new Date(b.eventDate);

    const now = new Date();

    const aUpcoming = dateA >= now;
    const bUpcoming = dateB >= now;

    // Upcoming events first
    if (aUpcoming && !bUpcoming) {
      return -1;
    }

    if (!aUpcoming && bUpcoming) {
      return 1;
    }

    // Within the same group:
    // earliest event first
    return dateA - dateB;
  });

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // UPDATE BOOKING STATUS
  // =====================================================

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/bookings/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBookings();
    } catch (err) {
      console.error("Update booking error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update booking status."
      );
    }
  };

  // =====================================================
  // DELETE BOOKING
  // =====================================================

  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((previous) =>
        previous.filter(
          (booking) => booking.id !== id
        )
      );
    } catch (err) {
      console.error("Delete booking error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete booking."
      );
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "completed"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-white text-lg">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md w-full">
          <div className="text-6xl mb-5">
            🔒
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Access Denied
          </h1>

          <p className="text-gray-500 mt-3">
            You don't have administrator permission.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="hidden lg:flex w-72 bg-slate-950 text-white flex-col fixed left-0 top-0 bottom-0 z-40">

        {/* Logo */}

        <div className="px-7 py-7 border-b border-white/10">

          <Link
            to="/"
            className="text-3xl font-black tracking-tight"
          >
            Event
            <span className="text-amber-400">
              Decor
            </span>
          </Link>

          <p className="text-xs text-gray-400 mt-2 uppercase tracking-[0.25em]">
            Admin Panel
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex-1 p-5 space-y-2">

          {/* Dashboard */}

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-purple-700 text-white font-semibold"
          >
            <span className="text-xl">
              📊
            </span>

            Dashboard
          </Link>

          {/* Bookings */}

          <Link
            to="/admin/bookings"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <span className="text-xl">
              📅
            </span>

            Bookings
          </Link>

          {/* Packages */}

          <Link
            to="/admin/packages"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <span className="text-xl">
              📦
            </span>

            Packages
          </Link>

          {/* Gallery */}

          <Link
            to="/admin/gallery"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <span className="text-xl">
              🖼️
            </span>

            Gallery
          </Link>

          {/* Contacts */}

          <Link
            to="/admin/contacts"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <span className="text-xl">
              📩
            </span>

            Contact Messages
          </Link>

        </nav>

        {/* Sidebar Bottom */}

        <div className="p-5 border-t border-white/10">

          <div className="px-4 py-3 mb-3">

            <p className="text-sm text-gray-400">
              Logged in as
            </p>

            <p className="font-semibold truncate">
              {user.name ||
                user.email ||
                "Administrator"}
            </p>

          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition"
          >
            🏠
            View Website
          </Link>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            🚪
            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="flex-1 lg:ml-72">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-white border-b sticky top-0 z-30">

          <div className="px-5 md:px-8 py-5 flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Welcome back 👋
              </p>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                Admin Dashboard
              </h1>

            </div>

            <div className="flex items-center gap-3">

              <Link
                to="/"
                className="hidden sm:block px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                View Site
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                Logout
              </button>

            </div>

          </div>

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          <div className="lg:hidden px-5 pb-4 overflow-x-auto">

            <div className="flex gap-2 min-w-max">

              <Link
                to="/admin/dashboard"
                className="px-4 py-2 rounded-xl bg-purple-700 text-white text-sm font-medium"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/bookings"
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm"
              >
                Bookings
              </Link>

              <Link
                to="/admin/packages"
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm"
              >
                Packages
              </Link>

              <Link
                to="/admin/gallery"
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm"
              >
                Gallery
              </Link>

              <Link
                to="/admin/contacts"
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm"
              >
                Messages
              </Link>

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="p-5 md:p-8">

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5">

              <div className="flex items-start gap-4">

                <span className="text-2xl">
                  ⚠️
                </span>

                <div>

                  <h3 className="font-bold text-red-800">
                    Unable to load dashboard
                  </h3>

                  <p className="text-red-600 mt-1">
                    {error}
                  </p>

                  <button
                    onClick={fetchBookings}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {/* TOTAL */}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Bookings
                  </p>

                  <h2 className="text-4xl font-black text-gray-900 mt-2">
                    {loading
                      ? "..."
                      : totalBookings}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                  📊
                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Pending
                  </p>

                  <h2 className="text-4xl font-black text-orange-500 mt-2">
                    {loading
                      ? "..."
                      : pendingBookings}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
                  ⏳
                </div>

              </div>

            </div>

            {/* CONFIRMED */}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Confirmed
                  </p>

                  <h2 className="text-4xl font-black text-blue-600 mt-2">
                    {loading
                      ? "..."
                      : confirmedBookings}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  ✅
                </div>

              </div>

            </div>

            {/* COMPLETED */}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Completed
                  </p>

                  <h2 className="text-4xl font-black text-green-600 mt-2">
                    {loading
                      ? "..."
                      : completedBookings}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                  🎉
                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mb-8">

            <div className="mb-5">

              <h2 className="text-2xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-gray-500 mt-1">
                Manage your event decoration website.
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* BOOKINGS */}

              <Link
                to="/admin/bookings"
                className="group bg-white p-6 rounded-3xl border hover:border-purple-300 hover:shadow-lg transition"
              >

                <div className="text-3xl mb-4">
                  📅
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Bookings
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View customer bookings
                </p>

                <span className="inline-block mt-4 text-purple-700 font-semibold group-hover:translate-x-1 transition">
                  Open →
                </span>

              </Link>

              {/* PACKAGES */}

              <Link
                to="/admin/packages"
                className="group bg-white p-6 rounded-3xl border hover:border-purple-300 hover:shadow-lg transition"
              >

                <div className="text-3xl mb-4">
                  📦
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Packages
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add and edit packages
                </p>

                <span className="inline-block mt-4 text-purple-700 font-semibold group-hover:translate-x-1 transition">
                  Open →
                </span>

              </Link>

              {/* GALLERY */}

              <Link
                to="/admin/gallery"
                className="group bg-white p-6 rounded-3xl border hover:border-purple-300 hover:shadow-lg transition"
              >

                <div className="text-3xl mb-4">
                  🖼️
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Gallery
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Manage event images
                </p>

                <span className="inline-block mt-4 text-purple-700 font-semibold group-hover:translate-x-1 transition">
                  Open →
                </span>

              </Link>

              {/* CONTACT */}

              <Link
                to="/admin/contacts"
                className="group bg-white p-6 rounded-3xl border hover:border-purple-300 hover:shadow-lg transition"
              >

                <div className="text-3xl mb-4">
                  📩
                </div>

                <h3 className="font-bold text-gray-900">
                  Contact Messages
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  View customer enquiries
                </p>

                <span className="inline-block mt-4 text-purple-700 font-semibold group-hover:translate-x-1 transition">
                  Open →
                </span>

              </Link>

            </div>

          </section>

          {/* =================================================
              BOOKINGS
          ================================================= */}

          <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">

            {/* Header */}

            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Events
                </h2>

                <p className="text-gray-500 mt-1">
                  Bookings are arranged by event date.
                </p>

              </div>

              <Link
                to="/admin/bookings"
                className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition text-center"
              >
                View All Bookings
              </Link>

            </div>

            {/* Loading */}

            {loading ? (

              <div className="p-12 text-center">

                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto"></div>

                <p className="text-gray-500 mt-4">
                  Loading bookings...
                </p>

              </div>

            ) : bookings.length === 0 ? (

              /* EMPTY */

              <div className="p-12 text-center">

                <div className="text-6xl mb-4">
                  📅
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  No bookings yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Customer bookings will appear here.
                </p>

                <Link
                  to="/booking"
                  className="inline-block mt-5 px-5 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition"
                >
                  View Booking Page
                </Link>

              </div>

            ) : (

              /* =================================================
                 BOOKING TABLE
              ================================================= */

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Event
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Event Date
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Venue
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Amount
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {sortedBookings
                      .slice(0, 8)
                      .map((booking) => {

                        const eventDate = new Date(
                          booking.eventDate
                        );

                        const isPast =
                          eventDate < new Date();

                        return (
                          <tr
                            key={booking.id}
                            className={`hover:bg-gray-50 transition ${
                              isPast
                                ? "bg-gray-50/70"
                                : ""
                            }`}
                          >

                            {/* CUSTOMER */}

                            <td className="px-6 py-5">

                              <div>

                                <p className="font-semibold text-gray-900">
                                  {booking.customerName ||
                                    "Unknown Customer"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {booking.email || "-"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  {booking.phone || "-"}
                                </p>

                              </div>

                            </td>

                            {/* EVENT */}

                            <td className="px-6 py-5">

                              <p className="font-semibold text-gray-800">
                                {booking.eventType || "-"}
                              </p>

                              {booking.package && (
                                <p className="text-sm text-purple-600 mt-1">
                                  {booking.package.title}
                                </p>
                              )}

                            </td>

                            {/* EVENT DATE */}

                            <td className="px-6 py-5">

                              <div>

                                <p
                                  className={`font-bold ${
                                    isPast
                                      ? "text-gray-500"
                                      : "text-purple-700"
                                  }`}
                                >
                                  {booking.eventDate
                                    ? eventDate.toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )
                                    : "-"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">

                                  {booking.eventDate
                                    ? eventDate.toLocaleDateString(
                                        "en-IN",
                                        {
                                          weekday:
                                            "long",
                                        }
                                      )
                                    : ""}

                                </p>

                                {isPast && (
                                  <span className="inline-block mt-1 text-xs text-gray-400">
                                    Past event
                                  </span>
                                )}

                              </div>

                            </td>

                            {/* VENUE */}

                            <td className="px-6 py-5">

                              <p className="text-gray-700">
                                {booking.venue || "-"}
                              </p>

                            </td>

                            {/* AMOUNT */}

                            <td className="px-6 py-5">

                              <p className="font-bold text-gray-900">
                                ₹
                                {Number(
                                  booking.totalAmount || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <select
                                value={
                                  booking.status ||
                                  "Pending"
                                }
                                onChange={(event) =>
                                  updateBookingStatus(
                                    booking.id,
                                    event.target.value
                                  )
                                }
                                className={`px-3 py-2 rounded-lg text-sm font-semibold border outline-none cursor-pointer ${
                                  booking.status?.toLowerCase() ===
                                  "confirmed"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : booking.status?.toLowerCase() ===
                                      "completed"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : booking.status?.toLowerCase() ===
                                      "cancelled"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                                }`}
                              >

                                <option value="Pending">
                                  Pending
                                </option>

                                <option value="Confirmed">
                                  Confirmed
                                </option>

                                <option value="Completed">
                                  Completed
                                </option>

                                <option value="Cancelled">
                                  Cancelled
                                </option>

                              </select>

                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-5 text-right">

                              <button
                                onClick={() =>
                                  deleteBooking(
                                    booking.id
                                  )
                                }
                                className="px-3 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition"
                              >
                                Delete
                              </button>

                            </td>

                          </tr>
                        );
                      })}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;