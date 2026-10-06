import { useState } from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/api.js";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, token } = useAuth();

  const packageData = location.state?.packageData;

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    phone: "",
    eventType: "",
    eventDate: "",
    venue: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Package Not Selected
  // ==========================================

  if (!packageData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2>Package not selected</h2>

        <p>
          Please select a decoration package first.
        </p>

        <button
          onClick={() => navigate("/packages")}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go to Packages
        </button>
      </div>
    );
  }

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // Submit Booking
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Check authentication
      if (!token) {
        alert("Please login before booking.");
        navigate("/login");
        return;
      }

     const bookingData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        venue: formData.venue,
        packageId: packageData.id,
        };

      console.log("Booking Data:", bookingData);

      const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Booking Response:",
        response.data
      );

      alert("Booking created successfully!");

      navigate("/customer-dashboard");

    } catch (error) {
      console.error(
        "Booking Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/packages")}
          style={{
            padding: "8px 15px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ← Back to Packages
        </button>

        <h1>Book Decoration</h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Complete the details below to place
          your decoration booking.
        </p>

        {/* Selected Package */}

        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "25px",
          }}
        >
          <h2>{packageData.title}</h2>

          <p>{packageData.description}</p>

          <p>
            <strong>Category:</strong>{" "}
            {packageData.category}
          </p>

          <h2>
            ₹
            {Number(
              packageData.price
            ).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Error */}

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#ffe5e5",
              color: "#d00000",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Customer Name */}

          <label>
            Customer Name
          </label>

          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            style={inputStyle}
          />

          {/* Email */}

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={inputStyle}
          />

          {/* Phone */}

          <label>
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            pattern="[0-9]{10}"
            maxLength="10"
            required
            style={inputStyle}
          />

          {/* Event Type */}

          <label>
            Event Type
          </label>

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">
              Select Event
            </option>

            <option value="Wedding">
              Wedding
            </option>

            <option value="Birthday">
              Birthday
            </option>

            <option value="Engagement">
              Engagement
            </option>

            <option value="Reception">
              Reception
            </option>

            <option value="Corporate">
              Corporate Event
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* Event Date */}

          <label>
            Event Date
          </label>

          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            required
            style={inputStyle}
          />

          {/* Venue */}

          <label>
            Venue
          </label>

          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter event venue"
            required
            style={inputStyle}
          />

          {/* Total */}

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>
              Total Amount:
            </strong>

            <strong>
              ₹
              {Number(
                packageData.price
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "25px",
              backgroundColor: loading
                ? "#888"
                : "#000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>

        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "15px",
};

export default Booking;