"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await login(form);

      console.log("LOGIN RESPONSE:", res); // 👈 ADD THIS

      if (!res || res.error) {
        setError(res?.error || "Unknown error");
        return;
      }

      setUser({
        email: form.email,
        role: res.role || "customer",
        token: res.token,
        name: res.name || form.email,
      });

      router.push("/");
    } catch (err) {
      console.log("LOGIN ERROR:", err); // 👈 ADD THIS
      setError("Network error or server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-3">

        <h1 className="text-xl font-bold text-center">Login</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}

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

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}