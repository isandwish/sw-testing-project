"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getTables, updateTableStatus } from "@/lib/api";

export default function StaffDashboard() {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // =========================
  // Protect Route
  // =========================
  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "staff" && user.role !== "admin") {
      router.push("/");
    }
  }, []);

  // =========================
  // Fetch Tables
  // =========================
  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getTables();
      setTables(data.tables || []);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // =========================
  // Update Table Status
  // =========================
  const handleStatusChange = async (id, status) => {
    try {
      setUpdating(id);

      await updateTableStatus(id, status);

      await fetchTables();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(null);
    }
  };

  // =========================
  // UI helpers
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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🧑‍🍳 Staff Dashboard</h1>

        <button
          onClick={fetchTables}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading tables...</p>
      ) : tables.length === 0 ? (
        <p className="text-gray-500">No tables found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">
                Table #{table.id}
              </h2>

              <p className="text-sm text-gray-500">
                Capacity: {table.capacity}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(
                  table.status
                )}`}
              >
                {table.status}
              </span>

              {/* ACTIONS */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  disabled={updating === table.id}
                  onClick={() => handleStatusChange(table.id, "AVAILABLE")}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Available
                </button>

                <button
                  disabled={updating === table.id}
                  onClick={() => handleStatusChange(table.id, "OCCUPIED")}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Occupied
                </button>

                <button
                  disabled={updating === table.id}
                  onClick={() =>
                    handleStatusChange(table.id, "OUT_OF_SERVICE")
                  }
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  Out
                </button>
              </div>

              {updating === table.id && (
                <p className="text-xs text-gray-400 mt-2">
                  Updating...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}