"use client";

import { useEffect, useState } from "react";
import { getMyReservations, updateReservation, cancelReservation } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    guestCount: 1,
  });

  // =========================
  // Protect route
  // =========================
  useEffect(() => {
    const u = getUser();

    if (!u || u.role !== "customer") {
      router.push("/");
      return;
    }

    fetchHistory();
  }, []);

  // =========================
  // Fetch history
  // =========================
  const fetchHistory = async () => {
    setLoading(true);

    const res = await getMyReservations();
    setData(res.reservations || []);

    setLoading(false);
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Delete this reservation?")) return;

    await cancelReservation(id);
    fetchHistory();
  };

  // =========================
  // Start edit
  // =========================
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      date: item.date,
      time: item.time,
      guestCount: item.guestCount,
    });
  };

  // =========================
  // Save edit
  // =========================
  const handleUpdate = async (id) => {
    await updateReservation(id, editForm);

    setEditingId(null);
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-4">
        📋 My Reservation History
      </h1>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-gray-500">No reservations found</p>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">

            {/* EDIT MODE */}
            {editingId === item.id ? (
              <div className="space-y-2">

                <input
                  type="date"
                  className="border p-2 w-full"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                />

                <input
                  type="time"
                  className="border p-2 w-full"
                  value={editForm.time}
                  onChange={(e) =>
                    setEditForm({ ...editForm, time: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="border p-2 w-full"
                  value={editForm.guestCount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      guestCount: Number(e.target.value),
                    })
                  }
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* VIEW MODE */}
                <h2 className="font-semibold">
                  Table #{item.tableId}
                </h2>

                <p className="text-sm text-gray-600">
                  📅 {item.date} ⏰ {item.time}
                </p>

                <p className="text-sm text-gray-600">
                  👥 {item.guestCount} guests
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    item.status === "CONFIRMED"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200"
                  }`}
                >
                  {item.status}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => startEdit(item)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}