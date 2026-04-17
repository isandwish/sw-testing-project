"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { setUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

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
      setUser(res); // store token + role

      router.push("/");

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
      </div>

    </div>
  );
}