import "./globals.css";
import Link from "next/link";

import NavRight from "@/components/NavRight";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">

        {/* NAVBAR */}
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

          {/* LEFT */}
          <Link href="/" className="font-bold text-xl">
            🍽 RTS
          </Link>

          {/* RIGHT (client needed for auth) */}
          <NavRight />

        </nav>

        <main>{children}</main>

      </body>
    </html>
  );
}