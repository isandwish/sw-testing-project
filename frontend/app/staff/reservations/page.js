"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import {
  getAllReservations,
  updateReservation,
  cancelReservation,
} from "@/lib/api";

export default function StaffReservationsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Protect route (staff only)
  // =========================
  useEffect(() => {
    const user = getUser();

    if (!user || user.role !== "staff") {
      router.push("/");
    }
  }, []);

  // =========================
  // Fetch reservations
  // =========================
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await getAllReservations();
      setReservations(res.reservations || []);
    } catch (err) {
      console.error(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // =========================
  // Update status
  // =========================
  const handleStatusChange = async (id, status) => {
    try {
      await updateReservation(id, { status });
      await fetchReservations();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Staff Reservations</h1>

        <button
          onClick={fetchReservations}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">No reservations found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">

          {reservations.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  Table #{r.tableId}
                </h2>

                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {r.status}
                </span>
              </div>

              {/* INFO */}
              <p className="text-sm text-gray-500 mt-1">
                📅 {r.date} • ⏰ {r.time}
              </p>

              <p className="text-sm mt-2">
                👤 {r.customer?.fullName || "Unknown"}
              </p>

              <p className="text-xs text-gray-500">
                {r.customer?.email}
              </p>

              <p className="text-xs text-gray-500">
                👥 {r.guestCount} guests
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 mt-3">

                <button
                  onClick={() => handleStatusChange(r.id, "CONFIRMED")}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                >
                  Confirm
                </button>

                <button
                  onClick={() => handleStatusChange(r.id, "CANCELLED")}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleStatusChange(r.id, "COMPLETED")}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Complete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}