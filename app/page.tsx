"use client";

import { useRouter } from "next/navigation";

import { generatePokemon } from "@/services/pokemon-generator";
import { savePokemon } from "@/services/player-storage";

export default function Home() {
  const router =
    useRouter();

  function startGame() {
    const starter =
      generatePokemon();

    savePokemon(
      starter
    );

    router.push(
      "/dashboard"
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10">

      <h1 className="text-7xl font-black">
        PokéBrute
      </h1>

      <p className="text-xl text-gray-500">
        Univers brutal. Aucun Pokémon n’est en sécurité.
      </p>

      <button
        onClick={
          startGame
        }
        className="rounded bg-red-600 px-8 py-4 text-xl text-white hover:bg-red-700"
      >
        Recevoir mon premier Pokémon
      </button>

    </main>
  );
}