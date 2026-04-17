"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, logout } from "@/lib/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🍽 RTS</h1>

        <div className="flex items-center gap-4">

          {/* NOT LOGIN */}
          {!user && (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
              <Link href="/register" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Register
              </Link>
            </>
          )}

          {/* LOGIN */}
          {user && (
            <>
              <div className="text-sm text-gray-700">
                Hi, <span className="font-semibold">{user.name || user.email}</span>
              </div>

              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {user.role}
              </span>

              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="text-red-500 text-sm"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-2">
          Restaurant Table Reservation System
        </h2>
        <p className="text-gray-500">
          Book tables easily and manage your reservations in one place
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6">

        {/* GUEST */}
        {!user && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg">Check availability</h3>
              <p className="text-gray-500 text-sm mt-1">
                See available tables before booking
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg">Make reservation</h3>
              <p className="text-gray-500 text-sm mt-1">
                Login required to book a table
              </p>
            </div>
          </div>
        )}

        {/* CUSTOMER */}
        {user?.role === "customer" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/customer" className="bg-green-100 p-6 rounded-xl hover:shadow">
              🍽 Make Reservation
            </Link>

            <div className="bg-white p-6 rounded-xl shadow">
              My Reservations
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              View Availability
            </div>
          </div>
        )}

        {/* STAFF */}
        {user?.role === "staff" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/staff" className="bg-blue-100 p-6 rounded-xl hover:shadow">
              👨‍🍳 Staff Dashboard
            </Link>

            <div className="bg-white p-6 rounded-xl shadow">
              Manage Reservations
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              Table Status
            </div>
          </div>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin" className="bg-red-100 p-6 rounded-xl hover:shadow">
              👑 Admin Panel
            </Link>

            <div className="bg-white p-6 rounded-xl shadow">
              Restaurant Settings
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              Reports
            </div>
          </div>
        )}

      </div>
    </div>
  );
}