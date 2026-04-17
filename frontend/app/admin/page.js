"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalReservations: 0,
    totalTables: 0,
    activeReservations: 0,
    cancelledReservations: 0,
    completedReservations: 0,
  });

  // =========================
  // Protect route
  // =========================
  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
    }
  }, []);

  // =========================
  // Mock fetch data
  // =========================
  useEffect(() => {
    // mock data (replace with API later)
    setStats({
      totalReservations: 128,
      totalTables: 20,
      activeReservations: 12,
      cancelledReservations: 8,
      completedReservations: 108,
    });
  }, []);

  const Card = ({ title, value, color }) => (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card
          title="Total Reservations"
          value={stats.totalReservations}
          color="text-blue-600"
        />

        <Card
          title="Total Tables"
          value={stats.totalTables}
          color="text-purple-600"
        />

        <Card
          title="Active Reservations"
          value={stats.activeReservations}
          color="text-green-600"
        />

        <Card
          title="Cancelled"
          value={stats.cancelledReservations}
          color="text-red-500"
        />

        <Card
          title="Completed"
          value={stats.completedReservations}
          color="text-gray-700"
        />

      </div>

      {/* MOCK CHART SECTION */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">📈 System Activity (Mock)</h2>

        <div className="space-y-3">
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          <div className="h-4 bg-green-200 rounded w-2/3"></div>
          <div className="h-4 bg-yellow-200 rounded w-1/2"></div>
          <div className="h-4 bg-red-200 rounded w-1/3"></div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          (Placeholder chart - can upgrade to Recharts later)
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <button
          onClick={() => router.push("/admin/tables")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          🪑 Manage Tables
        </button>

        <button
          onClick={() => router.push("/admin/reservations")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          📋 Manage Reservations
        </button>

        <button
          onClick={() => router.push("/admin/notifications")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          🔔 Notifications
        </button>

      </div>
    </div>
  );
}