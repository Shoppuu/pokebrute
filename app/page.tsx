"use client";

import { useState } from "react";
import { STARTER_POKEMON } from "@/data/pokemon";

export default function Home() {
  const [pokemon, setPokemon] = useState<string | null>(null);

  function getStarterPokemon() {
    const randomIndex = Math.floor(
      Math.random() * STARTER_POKEMON.length
    );

    setPokemon(STARTER_POKEMON[randomIndex]);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Pokebrute</h1>

      <p className="text-lg text-gray-500">
        Jeu de combats automatiques inspiré de La Brute
      </p>

      <button
        onClick={getStarterPokemon}
        className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600"
      >
        Recevoir mon premier Pokémon
      </button>

      {pokemon && (
        <div className="rounded border p-6 text-center">
          <h2 className="text-2xl font-bold">{pokemon}</h2>
          <p>Niveau 1</p>
        </div>
      )}
    </main>
  );
}