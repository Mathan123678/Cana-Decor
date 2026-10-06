import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_URL } from "../../config/api.js";

const emptyForm = {
  title: "",
  description: "",
  category: "",
};

const AdminGallery = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Check Admin
  // ==========================================

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/customer-dashboard");
    }
  }, [user, navigate]);

  // ==========================================
  // Fetch Gallery
  // ==========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/gallery`
      );

      console.log("Gallery:", response.data);

      setGallery(response.data.gallery || []);
    } catch (error) {
      console.error(
        "Get Gallery Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load gallery"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchGallery();
    }
  }, [user]);

  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // Select Image
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Check image size
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);

    // Create preview
    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // ==========================================
  // Submit Gallery
  // ==========================================

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

      // ======================================
      // FormData
      // ======================================

      const data = new FormData();

      data.append("title", formData.title);
      data.append(
        "description",
        formData.description
      );
      data.append("category", formData.category);

      // Add image only when selected
      if (selectedImage) {
        data.append("image", selectedImage);
      }

      let response;

      // ======================================
      // Update
      // ======================================

      if (editingId) {
        response = await axios.put(
          `${API_URL}/gallery/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Gallery item updated successfully");
      }

      // ======================================
      // Create
      // ======================================

      else {
        if (!selectedImage) {
          alert("Please select an image.");
          setSaving(false);
          return;
        }

        response = await axios.post(
          `${API_URL}/gallery`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Gallery item added successfully");
      }

      console.log(
        "Gallery Response:",
        response.data
      );

      // Reset
      setFormData(emptyForm);
      setSelectedImage(null);
      setPreviewImage("");
      setEditingId(null);

      await fetchGallery();
    } catch (error) {
      console.error(
        "Save Gallery Error:",
        error.response?.data || error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert(
          error.response?.data?.message ||
            "You are not authorized."
        );

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to save gallery item."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Edit
  // ==========================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
    });

    setSelectedImage(null);

    setPreviewImage(item.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // Cancel Edit
  // ==========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(emptyForm);

    setSelectedImage(null);

    setPreviewImage("");

    setError("");
  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/gallery/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Gallery item deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }

      await fetchGallery();
    } catch (error) {
      console.error(
        "Delete Gallery Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete gallery item."
      );
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading Gallery...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ======================================
          Header
      ====================================== */}

      <header style={styles.header}>

        <div>
          <h1 style={styles.logo}>
            Event<span>Decor</span>
          </h1>

          <p style={styles.adminText}>
            Admin Gallery Management
          </p>
        </div>

        <div style={styles.headerActions}>

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            style={styles.backButton}
          >
            ← Dashboard
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      <main style={styles.container}>

        {/* ====================================
            Title
        ==================================== */}

        <div style={styles.pageTitle}>
          <h2>Manage Gallery</h2>

          <p>
            Add, edit and delete event decoration
            gallery images.
          </p>
        </div>

        {/* ====================================
            Error
        ==================================== */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* ====================================
            Form
        ==================================== */}

        <section style={styles.formCard}>

          <h2>
            {editingId
              ? "Edit Gallery Item"
              : "Add New Gallery Item"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* Title */}

              <div style={styles.formGroup}>
                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Wedding Stage Decoration"
                  required
                  style={styles.input}
                />
              </div>

              {/* Category */}

              <div style={styles.formGroup}>
                <label>Category</label>

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

            </div>

            {/* Description */}

            <div style={styles.formGroup}>
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this decoration..."
                rows="4"
                required
                style={styles.textarea}
              />
            </div>

            {/* Image */}

            <div style={styles.formGroup}>

              <label>
                Image{" "}
                {editingId
                  ? "(Optional when editing)"
                  : ""}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />

              <small style={styles.helpText}>
                JPG, JPEG, PNG or WEBP. Maximum 5MB.
              </small>

            </div>

            {/* Preview */}

            {previewImage && (
              <div style={styles.previewContainer}>

                <p style={styles.previewTitle}>
                  Image Preview
                </p>

                <img
                  src={previewImage}
                  alt="Preview"
                  style={styles.preview}
                />

              </div>
            )}

            {/* Buttons */}

            <div style={styles.formButtons}>

              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Gallery"
                  : "Add Gallery"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </section>

        {/* ====================================
            Gallery
        ==================================== */}

        <section style={styles.gallerySection}>

          <div style={styles.sectionHeader}>

            <div>
              <h2>All Gallery Items</h2>

              <p>
                {gallery.length} item
                {gallery.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <button
              onClick={fetchGallery}
              style={styles.refreshButton}
            >
              🔄 Refresh
            </button>

          </div>

          {gallery.length === 0 ? (
            <div style={styles.empty}>

              <h3>
                No Gallery Items
              </h3>

              <p>
                Add your first gallery image above.
              </p>

            </div>
          ) : (
            <div style={styles.grid}>

              {gallery.map((item) => (

                <div
                  key={item.id}
                  style={styles.card}
                >

                  <img
                    src={item.image}
                    alt={item.title}
                    style={styles.image}
                  />

                  <div style={styles.cardBody}>

                    <h3>
                      {item.title}
                    </h3>

                    <span style={styles.category}>
                      {item.category}
                    </span>

                    <p style={styles.description}>
                      {item.description}
                    </p>

                    <div
                      style={styles.cardButtons}
                    >

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        style={styles.editButton}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
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

// ==========================================
// Styles
// ==========================================

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

  adminText: {
    margin: "4px 0 0",
    color: "#aaa",
    fontSize: "14px",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
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

  input: {
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    width: "100%",
  },

  textarea: {
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
    width: "100%",
  },

  fileInput: {
    marginTop: "7px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  },

  helpText: {
    color: "#777",
    marginTop: "6px",
  },

  previewContainer: {
    marginBottom: "20px",
  },

  previewTitle: {
    fontWeight: "600",
    marginBottom: "10px",
  },

  preview: {
    width: "250px",
    height: "170px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  formButtons: {
    display: "flex",
    gap: "10px",
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

  cancelButton: {
    padding: "12px 22px",
    backgroundColor: "#ddd",
    color: "#111",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#ffe5e5",
    color: "#c00",
    borderRadius: "8px",
  },

  gallerySection: {
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

  image: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
  },

  cardBody: {
    padding: "18px",
  },

  category: {
    display: "inline-block",
    padding: "5px 10px",
    backgroundColor: "#f3f3f3",
    borderRadius: "15px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  description: {
    color: "#666",
    lineHeight: "1.5",
  },

  cardButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
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
};

export default AdminGallery;