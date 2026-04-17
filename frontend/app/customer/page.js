"use client";

import { useState } from "react";
import { getAvailability, createReservation } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function CustomerPage() {
  const user = getUser();

  const [form, setForm] = useState({
    date: "",
    time: "",
    guestCount: 1,
    specialRequest: "",
  });

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // CHECK availability
  const handleCheck = async () => {
    setLoading(true);
    setMessage("");

    const res = await getAvailability(form);

    setTables(res.availableTables || []);
    setLoading(false);
  };

  // CREATE reservation
  const handleBook = async () => {
    if (!selectedTable) {
      setMessage("Please select a table");
      return;
    }

    setLoading(true);

    const res = await createReservation({
      ...form,
      tableId: selectedTable.id,
    });

    if (res.id) {
      setMessage("Reservation successful 🎉");
      setTables([]);
      setSelectedTable(null);
    } else {
      setMessage(res.error || "Failed to book");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

      <h1 className="text-2xl font-bold mb-6">
        🍽 Make Reservation
      </h1>

      {/* FORM */}
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow space-y-3">

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

        <input
          className="border p-2 w-full rounded"
          placeholder="Special request (optional)"
          onChange={(e) =>
            setForm({ ...form, specialRequest: e.target.value })
          }
        />

        <button
          onClick={handleCheck}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>

      </div>

      {/* TABLES */}
      {tables.length > 0 && (
        <div className="mt-6 w-full max-w-4xl">

          <h2 className="text-lg font-semibold mb-3 text-center">
            Select a Table
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {tables.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTable(t)}
                className={`p-4 rounded-xl shadow cursor-pointer text-center transition
                  ${selectedTable?.id === t.id
                    ? "bg-green-100 border border-green-500"
                    : "bg-white"
                  }`}
              >
                <h3 className="font-semibold">Table #{t.id}</h3>
                <p className="text-gray-500 text-sm">
                  Capacity: {t.capacity}
                </p>
              </div>
            ))}

          </div>

          {/* BOOK BUTTON */}
          <div className="text-center mt-6">
            <button
              onClick={handleBook}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Confirm Reservation
            </button>
          </div>

        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {message}
        </p>
      )}

    </div>
  );
}