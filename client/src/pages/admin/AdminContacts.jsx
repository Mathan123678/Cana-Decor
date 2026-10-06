import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api.js";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts(response.data.contacts || []);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load contact messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/contacts/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchContacts();

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const deleteContact = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/contacts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
      );

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete message"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">
          Loading contact messages...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Contact Messages
        </h1>

        <p className="mt-2 text-gray-500">
          View and manage enquiries submitted by customers.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-100 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-gray-500">
            Total Messages
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {contacts.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold mt-2 text-orange-500">
            {
              contacts.filter(
                (item) => item.status === "Pending"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-gray-500">
            Resolved
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {
              contacts.filter(
                (item) => item.status === "Resolved"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Messages */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
          <div className="text-5xl mb-4">
            📩
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No contact messages yet
          </h2>

          <p className="text-gray-500 mt-2">
            Customer enquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                {/* Customer information */}
                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3 mb-3">

                    <h2 className="text-xl font-bold text-gray-900">
                      {contact.name}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        contact.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : contact.status === "Contacted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {contact.status}
                    </span>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">

                    <p>
                      <strong>Email:</strong>{" "}
                      {contact.email}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {contact.phone}
                    </p>

                    <p>
                      <strong>Subject:</strong>{" "}
                      {contact.subject}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        contact.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  {/* Message */}
                  <div className="mt-5 bg-gray-50 rounded-xl p-5">

                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Message
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                      {contact.message}
                    </p>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col gap-2">

                  <button
                    onClick={() =>
                      updateStatus(
                        contact.id,
                        "Pending"
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        contact.id,
                        "Contacted"
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    Contacted
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        contact.id,
                        "Resolved"
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                  >
                    Resolved
                  </button>

                  <button
                    onClick={() =>
                      deleteContact(contact.id)
                    }
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminContacts;