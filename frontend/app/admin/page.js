"use client";

import { useState } from "react";

export default function Admin() {
  const [info, setInfo] = useState({
    name: "",
    hours: "",
    contact: "",
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="bg-white p-4 rounded w-96 space-y-2">
        <input className="border p-2 w-full" placeholder="Restaurant Name"
          onChange={(e) => setInfo({ ...info, name: e.target.value })} />

        <input className="border p-2 w-full" placeholder="Operating Hours"
          onChange={(e) => setInfo({ ...info, hours: e.target.value })} />

        <input className="border p-2 w-full" placeholder="Contact"
          onChange={(e) => setInfo({ ...info, contact: e.target.value })} />

        <button className="bg-purple-500 text-white w-full p-2">
          Update Info
        </button>
      </div>
    </div>
  );
}