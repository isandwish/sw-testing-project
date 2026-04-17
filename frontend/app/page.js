"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="text-center py-16 px-4">
        <h2 className="text-3xl font-bold">
          Restaurant Table Reservation System
        </h2>
        <p className="text-gray-500 mt-2">
          Book tables and manage reservations easily
        </p>
      </div>

      {/* ROLE DASHBOARD */}
      <div className="max-w-5xl mx-auto px-6">

        {/* GUEST */}
        {!user && (
          <div className="grid md:grid-cols-2 gap-6">

            <div
              className="card cursor-pointer"
              onClick={() => router.push("/availability")}
            >
              <h3 className="font-semibold">📅 Check Availability</h3>
              <p className="text-gray-500 text-sm">
                View available tables before booking
              </p>
            </div>

            <div
              className="card cursor-pointer"
              onClick={() => router.push("/register")}
            >
              <h3 className="font-semibold">🆕 Create Account</h3>
              <p className="text-gray-500 text-sm">
                Register to start booking tables
              </p>
            </div>

          </div>
        )}

        {/* CUSTOMER */}
        {user?.role === "customer" && (
          <div className="grid md:grid-cols-3 gap-6">

            <div className="card cursor-pointer" onClick={() => router.push("/customer")}>
              <h3 className="font-semibold">🍽 Make Reservation</h3>
              <p className="text-gray-500 text-sm">
                Book a table at your favorite restaurant
              </p>
            </div>

            <div className="card cursor-pointer" onClick={() => router.push("/customer/history")}>
              <h3 className="font-semibold">📋 My Reservations</h3>
              <p className="text-gray-500 text-sm">
                View and manage your bookings
              </p>
            </div>

            <div className="card cursor-pointer" onClick={() => router.push("/availability")}>
              <h3 className="font-semibold">📅 Check Availability</h3>
              <p className="text-gray-500 text-sm">
                See available tables before booking
              </p>
            </div>

          </div>
        )}

        {/* STAFF */}
        {user?.role === "staff" && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="card cursor-pointer" onClick={() => router.push("/staff")}>
              <h3 className="font-semibold">👨‍🍳 Staff Dashboard</h3>
              <p className="text-gray-500 text-sm">
                Manage restaurant operations
              </p>
            </div>

            <div className="card cursor-pointer" onClick={() => router.push("/staff/reservations")}>
              <h3 className="font-semibold">📋 Manage Reservations</h3>
              <p className="text-gray-500 text-sm">
                View and update reservations
              </p>
            </div>

          </div>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* DASHBOARD */}
            <div
              className="card cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              <h3 className="font-semibold">📊 Admin Dashboard</h3>
              <p className="text-gray-500 text-sm">
                Overview: reservations, tables status, system summary
              </p>
            </div>

            {/* RESTAURANT SETTINGS */}
            <div
              className="card cursor-pointer"
              onClick={() => router.push("/admin/restaurant")}
            >
              <h3 className="font-semibold">⚙️ Restaurant Settings</h3>
              <p className="text-gray-500 text-sm">
                Manage restaurant info, opening hours, contact
              </p>
            </div>

            {/* TABLES */}
            <div
              className="card cursor-pointer"
              onClick={() => router.push("/admin/tables")}
            >
              <h3 className="font-semibold">🪑 Tables Management</h3>
              <p className="text-gray-500 text-sm">
                Create, edit, delete tables (CRUD)
              </p>
            </div>

            {/* RESERVATIONS */}
            <div
              className="card cursor-pointer"
              onClick={() => router.push("/admin/reservations")}
            >
              <h3 className="font-semibold">📋 Reservations</h3>
              <p className="text-gray-500 text-sm">
                Full control: confirm, cancel, delete bookings
              </p>
            </div>

            {/* NOTIFICATIONS */}
            <div
              className="card cursor-pointer"
              onClick={() => router.push("/admin/notifications")}
            >
              <h3 className="font-semibold">🔔 Notifications</h3>
              <p className="text-gray-500 text-sm">
                Reservation created / updated / cancelled
              </p>
            </div>

          </div>
        )}

      </div>

      {/* STYLE */}
      <style jsx>{`
        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }
      `}</style>

    </div>
  );
}