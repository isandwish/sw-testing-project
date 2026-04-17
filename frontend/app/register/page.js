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
    phoneNumber: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    const res = await register(form);

    if (res.userId) {
      router.push("/login");
    } else {
      setError(res.error || "Register failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h1 className="text-xl font-bold">Register</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone (optional)"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </div>

    </div>
  );
}