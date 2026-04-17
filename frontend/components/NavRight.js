"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function NavRight() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
  logout();
  setUser(null);

  window.location.href = "/";
};

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-700 hover:text-blue-500">
          Home
        </Link>

        <Link href="/login" className="text-sm text-blue-500">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">

      <Link href="/" className="text-gray-700 hover:text-blue-500">
        Home
      </Link>

      <span className="bg-gray-200 px-2 py-1 rounded text-xs">
        {user.email || user.name}
      </span>

      <span className="text-xs text-gray-500">
        {user.role}
      </span>

      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600"
      >
        Logout
      </button>

    </div>
  );
}