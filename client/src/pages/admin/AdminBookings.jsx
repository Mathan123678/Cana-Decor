import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api.js";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/bookings/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBookings();

    } catch (error) {
      console.error("Update booking error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update booking"
      );
    }
  };

  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBookings();

    } catch (error) {
      console.error("Delete booking error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete booking"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading bookings...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Booking Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage customer decoration bookings
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Back to Dashboard
          </Link>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No bookings found
            </h2>

            <p className="text-gray-500 mt-2">
              Customer bookings will appear here.
            </p>
          </div>
        ) : (

          <div className="grid gap-6">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-6"
              >

                {/* Top */}
                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h2 className="text-xl font-bold text-purple-700">
                      {booking.package?.title ||
                        "Decoration Package"}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {booking.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold">
                      {booking.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold">
                      {booking.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Event Type
                    </p>

                    <p className="font-semibold">
                      {booking.eventType}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Event Date
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        booking.eventDate
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Venue
                    </p>

                    <p className="font-semibold">
                      {booking.venue}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="font-bold text-green-600">
                      ₹{Number(
                        booking.totalAmount
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t">

                  {booking.status !== "Confirmed" && (
                    <button
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "Confirmed"
                        )
                      }
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirm
                    </button>
                  )}

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "Cancelled"
                        )
                      }
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteBooking(booking.id)
                    }
                    className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminBookings;