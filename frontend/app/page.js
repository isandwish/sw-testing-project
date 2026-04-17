import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold">🍽 RTS System</h1>

      <Link className="text-blue-500" href="/login">Login</Link>
      <Link className="text-green-500" href="/register">Register</Link>
      <Link className="text-purple-500" href="/customer">Customer Dashboard</Link>
      <Link className="text-orange-500" href="/staff">Staff Dashboard</Link>
      <Link className="text-red-500" href="/admin">Admin Dashboard</Link>
    </div>
  );
}