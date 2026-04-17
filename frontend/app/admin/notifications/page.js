"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getNotifications } from "@/lib/api";

export default function AdminNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
  // Fetch notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await getNotifications();
      setNotifications(res.notifications || []);

    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // UI color helper
  // =========================
  const getTypeColor = (type) => {
    switch (type) {
      case "CREATED":
        return "bg-green-100 text-green-700";
      case "UPDATED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔔 Notifications</h1>

        <button
          onClick={fetchNotifications}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">

          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded shadow flex justify-between items-start"
            >

              {/* LEFT */}
              <div>
                <p className="font-semibold">
                  Table #{n.tableId || "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {n.createdAt || "recent"}
                </p>
              </div>

              {/* TYPE */}
              <span
                className={`text-xs px-2 py-1 rounded ${getTypeColor(
                  n.type
                )}`}
              >
                {n.type}
              </span>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}