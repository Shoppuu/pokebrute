"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center gap-6 border-b pb-4">
      <Link
        href="/dashboard"
        className="font-bold text-xl"
      >
        PokéBrute
      </Link>

      <Link href="/dashboard">
        🏠 Dashboard
      </Link>

      <Link href="/combat">
        ⚔️ Combat
      </Link>

      <Link href="/inventory">
        📦 Inventaire
      </Link>
      
    </nav>
  );
}