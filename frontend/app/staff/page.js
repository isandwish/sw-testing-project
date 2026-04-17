"use client";

import { useState } from "react";

export default function Staff() {
  const [tableStatus, setTableStatus] = useState("Available");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>

      <div className="bg-white p-4 rounded w-80 mt-4 space-y-3">
        <select
          className="border p-2 w-full"
          onChange={(e) => setTableStatus(e.target.value)}
        >
          <option>Available</option>
          <option>Occupied</option>
          <option>Out of Service</option>
        </select>

        <button className="bg-blue-500 text-white w-full p-2">
          Update Table Status
        </button>

        <button className="bg-green-500 text-white w-full p-2">
          Create Walk-in Reservation
        </button>
      </div>
    </div>
  );
}