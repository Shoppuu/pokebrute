"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="mb-8 flex items-center gap-4 border-b pb-4">

      <Link
        href="/dashboard"
        className="font-bold"
      >
        PokéBrute
      </Link>

      <Link href="/combat">
        ⚔️ Combat
      </Link>

      <Link href="/stable">
        🏠 Écurie
      </Link>

      <Link href="/eggs">
        🥚 Œufs
      </Link>

      <Link href="/inventory">
        📦 Inventaire
      </Link>

    </nav>
  );
}