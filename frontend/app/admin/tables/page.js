"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
} from "@/lib/api";

export default function AdminTables() {
  const router = useRouter();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    capacity: "",
  });

  // =========================
  // Protect route
  // =========================
  useEffect(() => {
    const user = getUser();

    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, []);

  // =========================
  // Fetch tables
  // =========================
  const fetchTables = async () => {
    setLoading(true);

    try {
      const res = await getTables();
      setTables(res.tables || []);
    } catch (err) {
      console.error(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // =========================
  // Reset form
  // =========================
  const resetForm = () => {
    setForm({ capacity: "" });
    setIsEdit(false);
    setEditId(null);
  };

  // =========================
  // CREATE table
  // =========================
  const handleCreate = async () => {
    if (!form.capacity) return;

    await createTable({
      capacity: Number(form.capacity),
    });

    resetForm();
    fetchTables();
  };

  // =========================
  // EDIT table (fill form)
  // =========================
  const handleEdit = (table) => {
    setIsEdit(true);
    setEditId(table.id);
    setForm({
      capacity: table.capacity,
    });
  };

  // =========================
  // UPDATE table
  // =========================
  const handleUpdate = async () => {
    await updateTable(editId, {
      capacity: Number(form.capacity),
    });

    resetForm();
    fetchTables();
  };

  // =========================
  // DELETE table
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Delete this table?")) return;

    await deleteTable(id);
    fetchTables();
  };

  // =========================
  // UPDATE STATUS (IMPORTANT FIX)
  // =========================
  const handleStatusChange = async (id, status) => {
    await updateTableStatus(id, status);

    // 🔥 update UI instantly (no refresh needed)
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  // =========================
  // UI helper
  // =========================
  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "OCCUPIED":
        return "bg-red-100 text-red-700";
      case "OUT_OF_SERVICE":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        🪑 Tables Management (Admin)
      </h1>

      {/* =========================
          CREATE / EDIT FORM
      ========================= */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-md space-y-3">

        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Table capacity"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: e.target.value })
          }
        />

        {!isEdit ? (
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white w-full py-2 rounded"
          >
            ➕ Create Table
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white w-1/2 py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-300 w-1/2 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* =========================
          TABLE LIST
      ========================= */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tables.length === 0 ? (
        <p className="text-gray-500">No tables found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {tables.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded shadow"
            >

              <h2 className="font-bold text-lg">
                Table #{t.id}
              </h2>

              <p className="text-gray-500 text-sm">
                Capacity: {t.capacity}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(
                  t.status
                )}`}
              >
                {t.status}
              </span>

              {/* STATUS ACTIONS */}
              <div className="flex flex-wrap gap-1 mt-3">

                <button
                  onClick={() =>
                    handleStatusChange(t.id, "AVAILABLE")
                  }
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                >
                  Available
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(t.id, "OCCUPIED")
                  }
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Occupied
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(t.id, "OUT_OF_SERVICE")
                  }
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Out
                </button>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => handleEdit(t)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}