import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API_URL } from "../config/api.js";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Get My Bookings
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
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

      console.log("Customer Bookings:", response.data);

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(
        "Get Bookings Error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==========================================
  // Statistics
  // ==========================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>

          <h2>Loading your dashboard...</h2>

          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =====================================
            Header
        ===================================== */}

        <div style={styles.header}>

          <div>
            <p style={styles.welcomeSmall}>
              Welcome back 👋
            </p>

            <h1 style={styles.title}>
              {user?.name || "Customer"}
            </h1>

            <p style={styles.subtitle}>
              Manage your decoration bookings
              from here.
            </p>
          </div>

          <div style={styles.headerButtons}>

            <button
              type="button"
              onClick={() => navigate("/packages")}
              style={styles.primaryButton}
            >
              + New Booking
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>

          </div>

        </div>

        {/* =====================================
            Error
        ===================================== */}

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}

            <button
              onClick={fetchBookings}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================
            Statistics
        ===================================== */}

        <div style={styles.statsGrid}>

          {/* Total */}

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              📋
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Bookings
              </p>

              <h2 style={styles.statNumber}>
                {totalBookings}
              </h2>
            </div>
          </div>

          {/* Pending */}

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ⏳
            </div>

            <div>
              <p style={styles.statLabel}>
                Pending
              </p>

              <h2 style={styles.statNumber}>
                {pendingBookings}
              </h2>
            </div>
          </div>

          {/* Confirmed */}

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ✅
            </div>

            <div>
              <p style={styles.statLabel}>
                Confirmed
              </p>

              <h2 style={styles.statNumber}>
                {confirmedBookings}
              </h2>
            </div>
          </div>

          {/* Cancelled */}

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ❌
            </div>

            <div>
              <p style={styles.statLabel}>
                Cancelled
              </p>

              <h2 style={styles.statNumber}>
                {cancelledBookings}
              </h2>
            </div>
          </div>

        </div>

        {/* =====================================
            My Bookings
        ===================================== */}

        <div style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                My Bookings
              </h2>

              <p style={styles.sectionSubtitle}>
                View and track your decoration
                bookings.
              </p>
            </div>

            <span style={styles.count}>
              {totalBookings}{" "}
              {totalBookings === 1
                ? "Booking"
                : "Bookings"}
            </span>

          </div>

          {/* ===================================
              No Bookings
          =================================== */}

          {bookings.length === 0 && !error && (
            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                📅
              </div>

              <h3 style={styles.emptyTitle}>
                No bookings yet
              </h3>

              <p style={styles.emptyText}>
                You haven't created any decoration
                bookings yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/packages")
                }
                style={styles.primaryButton}
              >
                Browse Packages
              </button>

            </div>
          )}

          {/* ===================================
              Booking Cards
          =================================== */}

          {bookings.length > 0 && (
            <div style={styles.bookingGrid}>

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  style={styles.bookingCard}
                >

                  {/* Package Image */}

                  {booking.package?.image && (
                    <img
                      src={booking.package.image}
                      alt={
                        booking.package.title ||
                        "Decoration Package"
                      }
                      style={styles.packageImage}
                    />
                  )}

                  <div style={styles.cardContent}>

                    {/* Card Header */}

                    <div style={styles.cardHeader}>

                      <div>
                        <h3
                          style={
                            styles.packageTitle
                          }
                        >
                          {booking.package?.title ||
                            "Decoration Package"}
                        </h3>

                        <p
                          style={
                            styles.category
                          }
                        >
                          {booking.package?.category ||
                            booking.eventType}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.status,
                          ...(booking.status ===
                          "Confirmed"
                            ? styles.confirmed
                            : booking.status ===
                              "Cancelled"
                            ? styles.cancelled
                            : styles.pending),
                        }}
                      >
                        {booking.status}
                      </span>

                    </div>

                    <hr style={styles.line} />

                    {/* Event Details */}

                    <div style={styles.details}>

                      <div style={styles.detail}>
                        <span
                          style={styles.label}
                        >
                          Event
                        </span>

                        <span
                          style={styles.value}
                        >
                          {booking.eventType}
                        </span>
                      </div>

                      <div style={styles.detail}>
                        <span
                          style={styles.label}
                        >
                          Event Date
                        </span>

                        <span
                          style={styles.value}
                        >
                          {new Date(
                            booking.eventDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div style={styles.detail}>
                        <span
                          style={styles.label}
                        >
                          Venue
                        </span>

                        <span
                          style={styles.value}
                        >
                          {booking.venue}
                        </span>
                      </div>

                      <div style={styles.detail}>
                        <span
                          style={styles.label}
                        >
                          Phone
                        </span>

                        <span
                          style={styles.value}
                        >
                          {booking.phone}
                        </span>
                      </div>

                    </div>

                    {/* Amount */}

                    <div style={styles.amountBox}>

                      <span>
                        Total Amount
                      </span>

                      <strong>
                        ₹
                        {Number(
                          booking.totalAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    {/* Booking Date */}

                    <p style={styles.createdDate}>
                      Booking created on{" "}
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// ==========================================
// Styles
// ==========================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f7ff 0%, #f5f5f5 100%)",
    padding: "30px 20px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#333",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #111",
    borderRadius: "50%",
    marginBottom: "20px",
  },

  header: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.06)",
  },

  welcomeSmall: {
    margin: 0,
    color: "#777",
    fontSize: "14px",
  },

  title: {
    margin: "5px 0",
    fontSize: "32px",
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    margin: 0,
    color: "#666",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "12px 20px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  logoutButton: {
    padding: "12px 20px",
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },

  error: {
    padding: "15px 20px",
    backgroundColor: "#ffe5e5",
    color: "#c00",
    borderRadius: "10px",
    marginBottom: "25px",
  },

  retryButton: {
    marginLeft: "15px",
    padding: "7px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.05)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    backgroundColor: "#f3f3f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  statLabel: {
    margin: 0,
    color: "#777",
    fontSize: "14px",
  },

  statNumber: {
    margin: "4px 0 0",
    fontSize: "28px",
  },

  section: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "25px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#777",
  },

  count: {
    color: "#666",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "70px 20px",
    border: "1px dashed #ccc",
    borderRadius: "12px",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  emptyTitle: {
    fontSize: "22px",
    margin: "10px 0",
  },

  emptyText: {
    color: "#777",
    marginBottom: "25px",
  },

  bookingGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "25px",
  },

  bookingCard: {
    border: "1px solid #e5e5e5",
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  packageImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    display: "block",
  },

  cardContent: {
    padding: "22px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  packageTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#222",
  },

  category: {
    color: "#777",
    margin: "6px 0 0",
    fontSize: "14px",
  },

  status: {
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },

  confirmed: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },

  cancelled: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },

  line: {
    border: 0,
    borderTop: "1px solid #eee",
    margin: "20px 0",
  },

  details: {
    display: "grid",
    gap: "14px",
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  label: {
    color: "#777",
    fontSize: "14px",
  },

  value: {
    fontWeight: "600",
    textAlign: "right",
    color: "#333",
  },

  amountBox: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
  },

  createdDate: {
    marginTop: "15px",
    marginBottom: 0,
    color: "#999",
    fontSize: "12px",
  },
};

export default CustomerDashboard;