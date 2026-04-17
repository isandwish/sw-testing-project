"use client";

import { useState } from "react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const res = await register(form);

      if (res.message) {
        alert(res.message);
      } else {
        alert(res.error || "Register failed");
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h1 className="text-xl font-bold text-center">Register</h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="Full Name"
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Phone Number"
          onChange={(e) =>
            setForm({ ...form, phoneNumber: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </div>
    </div>
  );
}