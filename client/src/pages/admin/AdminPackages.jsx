import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL, SERVER_URL } from "../../config/api.js";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  price: "",
  image: null,
};

const AdminPackages = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Convert image path to complete URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // If image is already a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove backslashes if Windows path is returned
    const cleanImage = image.replace(/\\/g, "/");

    // If backend returns /uploads/filename.jpg
    if (cleanImage.startsWith("/")) {
      return `${SERVER_URL}${cleanImage}`;
    }

    // If backend returns uploads/filename.jpg
    return `${SERVER_URL}/${cleanImage}`;
  };

  // =====================================================
  // Check Admin
  // =====================================================

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/customer-dashboard");
    }
  }, [user, navigate]);

  // =====================================================
  // Fetch Packages
  // =====================================================

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/packages`
      );

      setPackages(response.data.packages || []);
    } catch (error) {
      console.error(
        "Get Packages Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load packages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPackages();
    }
  }, [user]);

  // =====================================================
  // Input Change
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // Image Change
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate image size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    // Create preview
    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
  };

  // =====================================================
  // Add / Update Package
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // =================================================
      // Validation
      // =================================================

      if (!formData.title.trim()) {
        setError("Package title is required.");
        return;
      }

      if (!formData.description.trim()) {
        setError("Package description is required.");
        return;
      }

      if (!formData.category) {
        setError("Please select a category.");
        return;
      }

      const price = Number(formData.price);

      if (!Number.isFinite(price) || price <= 0) {
        setError("Please enter a valid price.");
        return;
      }

      // For new package image is required
      if (!editingId && !formData.image) {
        setError("Please select an image.");
        return;
      }

      // =================================================
      // FormData
      // =================================================

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "price",
        price
      );

      // Only append image if user selected a new image
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        response = await axios.put(
          `${API_URL}/packages/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Package updated successfully.");
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        response = await axios.post(
          `${API_URL}/packages`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Package added successfully.");
      }

      console.log(
        "Package Response:",
        response.data
      );

      // Reset form
      setFormData(emptyForm);
      setEditingId(null);
      setExistingImage("");
      setPreview("");

      // Clear file input
      const fileInput =
        document.getElementById("package-image");

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchPackages();
    } catch (error) {
      console.error(
        "Save Package Error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          error.response?.data?.message ||
            "Admin access required."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to save package."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // Edit Package
  // =====================================================

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);

    setFormData({
      title: pkg.title || "",
      description: pkg.description || "",
      category: pkg.category || "",
      price: pkg.price ?? "",
      image: null,
    });

    setExistingImage(pkg.image || "");

    setPreview(
      pkg.image
        ? getImageUrl(pkg.image)
        : ""
    );

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // Cancel Edit
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(emptyForm);

    setExistingImage("");

    setPreview("");

    setError("");

    const fileInput =
      document.getElementById("package-image");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // Delete Package
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(
        `${API_URL}/packages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Package deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }

      await fetchPackages();
    } catch (error) {
      console.error(
        "Delete Package Error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete package."
      );
    }
  };

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading Packages...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <header style={styles.header}>

        <div>
          <h1 style={styles.logo}>
            Event
            <span style={styles.logoSpan}>
              Decor
            </span>
          </h1>

          <p style={styles.adminText}>
            Admin Package Management
          </p>
        </div>

        <div style={styles.headerActions}>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            style={styles.backButton}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      <main style={styles.container}>

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div style={styles.pageTitle}>

          <h2>
            Manage Decoration Packages
          </h2>

          <p>
            Add, edit and delete decoration
            packages.
          </p>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div style={styles.error}>

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              style={styles.closeError}
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <section style={styles.formCard}>

          <div style={styles.formHeader}>

            <div>

              <h2>
                {editingId
                  ? "Edit Package"
                  : "Add New Package"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected decoration package."
                  : "Create a new decoration package."}
              </p>

            </div>

            {editingId && (
              <span style={styles.editBadge}>
                Editing
              </span>
            )}

          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* =================================================
                  TITLE
              ================================================= */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Package Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Wedding Decoration"
                  required
                  style={styles.input}
                />

              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >

                  <option value="">
                    Select Category
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
                    Corporate
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  min="1"
                  step="0.01"
                  required
                  style={styles.input}
                />

              </div>

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Package Image
                </label>

                <input
                  id="package-image"
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />

                <small style={styles.helpText}>
                  JPG, PNG or WEBP. Maximum 5MB.
                </small>

              </div>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div style={styles.formGroup}>

              <label style={styles.label}>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this decoration package"
                rows="4"
                required
                style={styles.textarea}
              />

            </div>

            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            {preview && (
              <div style={styles.previewContainer}>

                <p style={styles.previewTitle}>
                  Image Preview
                </p>

                <div style={styles.previewBox}>

                  <img
                    src={preview}
                    alt="Package preview"
                    style={styles.previewImage}
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>

                {formData.image instanceof File && (
                  <p style={styles.selectedFile}>
                    Selected:{" "}
                    {formData.image.name}
                  </p>
                )}

              </div>
            )}

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div style={styles.formButtons}>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.saveButton,
                  ...(saving
                    ? styles.disabledButton
                    : {}),
                }}
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Package"
                  : "Add Package"}

              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  style={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </section>

        {/* =================================================
            PACKAGE LIST
        ================================================= */}

        <section style={styles.packageSection}>

          <div style={styles.sectionHeader}>

            <div>

              <h2>
                All Packages
              </h2>

              <p>
                {packages.length} package
                {packages.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            <button
              type="button"
              onClick={fetchPackages}
              style={styles.refreshButton}
            >
              🔄 Refresh
            </button>

          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {packages.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                📦
              </div>

              <h3>
                No packages found
              </h3>

              <p>
                Add your first decoration
                package above.
              </p>

            </div>

          ) : (

            <div style={styles.grid}>

              {packages.map((pkg) => (

                <div
                  key={pkg.id}
                  style={styles.card}
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div style={styles.imageWrapper}>

                    {pkg.image ? (

                      <img
                        src={getImageUrl(pkg.image)}
                        alt={pkg.title}
                        style={styles.image}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.parentElement.innerHTML =
                            `
                              <div style="
                                height:190px;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                color:#777;
                                font-size:15px;
                              ">
                                Image not available
                              </div>
                            `;
                        }}
                      />

                    ) : (

                      <div style={styles.noImage}>
                        No Image
                      </div>

                    )}

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div style={styles.cardBody}>

                    <div style={styles.categoryBadge}>
                      {pkg.category}
                    </div>

                    <h3 style={styles.cardTitle}>
                      {pkg.title}
                    </h3>

                    <p style={styles.description}>
                      {pkg.description}
                    </p>

                    <div style={styles.priceRow}>

                      <span>
                        Price
                      </span>

                      <strong>
                        ₹
                        {Number(
                          pkg.price
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div style={styles.cardButtons}>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(pkg)
                        }
                        style={styles.editButton}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(pkg.id)
                        }
                        style={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  header: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
  },

  logoSpan: {
    color: "#f59e0b",
  },

  adminText: {
    margin: "4px 0 0",
    color: "#aaa",
    fontSize: "14px",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  backButton: {
    padding: "10px 16px",
    backgroundColor: "#fff",
    color: "#111",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  logoutButton: {
    padding: "10px 16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  pageTitle: {
    marginBottom: "25px",
  },

  formCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: "30px",
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  editBadge: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },

  label: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#333",
    marginBottom: "7px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    width: "100%",
    outline: "none",
  },

  fileInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },

  helpText: {
    marginTop: "6px",
    color: "#777",
    fontSize: "12px",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
    width: "100%",
    outline: "none",
  },

  formButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  saveButton: {
    padding: "12px 22px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  disabledButton: {
    backgroundColor: "#777",
    cursor: "not-allowed",
  },

  cancelButton: {
    padding: "12px 22px",
    backgroundColor: "#ddd",
    color: "#111",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#ffe5e5",
    color: "#c00",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  closeError: {
    border: "none",
    background: "transparent",
    color: "#c00",
    fontSize: "22px",
    cursor: "pointer",
  },

  previewContainer: {
    marginBottom: "20px",
  },

  previewTitle: {
    fontWeight: "600",
    marginBottom: "8px",
  },

  previewBox: {
    width: "300px",
    height: "190px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #ddd",
    backgroundColor: "#f1f1f1",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  selectedFile: {
    fontSize: "13px",
    color: "#555",
    marginTop: "7px",
  },

  packageSection: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
  },

  refreshButton: {
    padding: "10px 16px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },

  card: {
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
  },

  imageWrapper: {
    width: "100%",
    height: "190px",
    backgroundColor: "#eee",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    display: "block",
  },

  noImage: {
    width: "100%",
    height: "190px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
    fontSize: "15px",
  },

  cardBody: {
    padding: "18px",
  },

  categoryBadge: {
    display: "inline-block",
    padding: "5px 10px",
    backgroundColor: "#f3f3f3",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "10px",
  },

  cardTitle: {
    margin: "5px 0 10px",
  },

  description: {
    color: "#666",
    lineHeight: "1.5",
    minHeight: "45px",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "18px 0",
    paddingTop: "15px",
    borderTop: "1px solid #eee",
  },

  cardButtons: {
    display: "flex",
    gap: "10px",
  },

  editButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed #ccc",
    borderRadius: "10px",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },
};

export default AdminPackages;