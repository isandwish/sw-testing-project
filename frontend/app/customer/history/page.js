"use client";

import { useEffect, useState } from "react";
import { getMyReservations } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);

    // 🚨 protect route
    if (!u || u.role !== "customer") {
      router.push("/");
      return;
    }

    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);

    const res = await getMyReservations();

    setData(res.reservations || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-4">
        📋 My Reservation History
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-gray-500">No reservations found</p>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow"
          >
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
          </div>
        ))}
      </div>
    </div>
  );
}