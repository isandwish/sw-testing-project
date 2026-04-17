"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/");
  };

  const displayName = user?.name || user?.email || "User";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🍽 RTS</h1>

        <div className="flex items-center gap-3">

          {/* NOT LOGIN */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-1 text-sm text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* USER INFO */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">{displayName}</span>

                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                  {user.role}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

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
            <div className="card">
              <h3 className="font-semibold">Check Availability</h3>
              <p className="text-gray-500 text-sm">
                View available tables before booking
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold">Create Account</h3>
              <p className="text-gray-500 text-sm">
                Register to start booking tables
              </p>
            </div>
          </div>
        )}

        {/* CUSTOMER */}
        {user?.role === "customer" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/customer" className="card hover:bg-green-50">
              🍽 Make Reservation
            </Link>

            <Link href="/customer/history" className="card">
              📋 My Reservations
            </Link>

            <Link href="/availability" className="card">
              📅 Check Availability
            </Link>
          </div>
        )}

        {/* STAFF */}
        {user?.role === "staff" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/staff" className="card hover:bg-blue-50">
              👨‍🍳 Staff Dashboard
            </Link>

            <Link href="/staff/reservations" className="card">
              📋 Manage Reservations
            </Link>

            <Link href="/staff/tables" className="card">
              🪑 Table Status
            </Link>
          </div>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin" className="card hover:bg-red-50">
              👑 Admin Panel
            </Link>

            <Link href="/admin/restaurant" className="card">
              ⚙️ Restaurant Settings
            </Link>

            <Link href="/admin/reports" className="card">
              📊 Reports
            </Link>
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