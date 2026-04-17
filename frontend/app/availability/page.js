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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        📅 Table Availability
      </h1>

      {/* FORM CARD */}
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow space-y-4">

        <input
          type="date"
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="time"
          className="border p-2 w-full rounded"
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          type="number"
          min={1}
          className="border p-2 w-full rounded"
          placeholder="Guest count"
          onChange={(e) =>
            setForm({ ...form, guestCount: Number(e.target.value) })
          }
        />

        <button
          onClick={handleCheck}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>

      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 w-full max-w-4xl">

          <h2 className="text-lg font-semibold mb-4 text-center">
            Available Tables
          </h2>

          {result.availableTables?.length === 0 ? (
            <p className="text-center text-gray-500">
              No tables available
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">

              {result.availableTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center"
                >
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

    </div>
  );
}