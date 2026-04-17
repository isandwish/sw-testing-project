"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function WalkInPage() {
  const router = useRouter();

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    time: "",
    guestCount: 1,
    tableId: "",
  });

  const [loading, setLoading] = useState(false);

  // protect
  useEffect(() => {
    const user = getUser();
    if (!user || !["staff", "admin"].includes(user.role)) {
      router.push("/");
    }
  }, []);

  // fetch tables
  useEffect(() => {
    const fetchTables = async () => {
      const user = getUser();

      const res = await fetch(`${API}/admin/tables`, {
        headers: {
          "Content-Type": "application/json",
          "x-role": user?.role,
          "x-user-id": user?.userId,
        },
      });

      const data = await res.json();
      setTables(data.tables || []);
    };

    fetchTables();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const user = getUser();

      const res = await fetch(`${API}/reservations/walk-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user?.role,
          "x-user-id": user?.userId,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      alert("Walk-in created!");
      router.push("/staff/reservations");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow space-y-4">

        <h1 className="text-2xl font-bold text-center">
          🚶 Walk-in Reservation
        </h1>

        {/* name */}
        <input
          className="border p-2 w-full"
          placeholder="Customer name"
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />

        {/* date */}
        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        {/* time */}
        <input
          type="time"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, time: e.target.value })
          }
        />

        {/* guest */}
        <input
          type="number"
          className="border p-2 w-full"
          min={1}
          onChange={(e) =>
            setForm({ ...form, guestCount: Number(e.target.value) })
          }
        />

        {/* table select */}
        <select
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, tableId: Number(e.target.value) })
          }
        >
          <option value="">Auto assign table</option>

          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              Table #{t.id} (cap {t.capacity}) - {t.status}
            </option>
          ))}
        </select>

        {/* submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          {loading ? "Creating..." : "Create Walk-in"}
        </button>

      </div>
    </div>
  );
}