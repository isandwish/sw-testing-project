"use client";

import { useState } from "react";
import { getAvailability } from "@/lib/api";

export default function AvailabilityPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    guestCount: 1,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);

    const res = await getAvailability(form);

    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-4">
        📅 Table Availability
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow max-w-md space-y-3">

        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="time"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          type="number"
          min={1}
          className="border p-2 w-full"
          placeholder="Guest count"
          onChange={(e) =>
            setForm({ ...form, guestCount: Number(e.target.value) })
          }
        />

        <button
          onClick={handleCheck}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>

      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Available Tables
          </h2>

          {result.availableTables?.length === 0 ? (
            <p className="text-gray-500">No tables available</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {result.availableTables.map((table) => (
                <div key={table.id} className="card">
                  <h3 className="font-semibold">
                    Table #{table.id}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Capacity: {table.capacity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`
        .card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>

    </div>
  );
}