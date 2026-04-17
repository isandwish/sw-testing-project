"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await login(form);

      if (res.token) {
        localStorage.setItem("token", res.token);
        alert("Login success");
      } else {
        alert(res.error || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}