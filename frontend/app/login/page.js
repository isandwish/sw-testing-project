"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await login(form);

    if (res.token) {
      setUser({
        token: res.token,
        role: res.role,
        email: form.email
      });

      window.location.href = "/";
    } else {
      setError(res.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">

        <h1 className="text-xl font-bold">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

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

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}