"use client";

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await register(form);

      console.log("REGISTER RESPONSE:", res); // 👈 ADD THIS

      if (!res || res.error) {
        setError(res?.error || "Unknown error");
        return;
      }

      alert("Register success");
      router.push("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", err); // 👈 ADD THIS
      setError("Network error or server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-3">

        <h1 className="text-xl font-bold text-center">Register</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}

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
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

      </div>
    </div>
  );
}