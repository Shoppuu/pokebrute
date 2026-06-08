"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { generatePokemon } from "@/services/pokemon-generator";
import { getPokemonStats } from "@/services/pokemon-stats";

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  function getStarterPokemon() {
    setPokemon(generatePokemon());
  }

  const stats = pokemon
  ? getPokemonStats(pokemon)
  : null;
  
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
        <div className="min-w-[250px] rounded border p-6 text-center">
          <h2 className="text-2xl font-bold">
            {pokemon.species}
          </h2>

          <p className="mt-2">
            Qualité : {pokemon.quality}
          </p>

          <p>Niveau : {pokemon.level}</p>

          <div className="mt-4">
            <p>Type : {pokemon.type}</p>
            <p>ATK : {stats?.attack}</p>
            <p>DEF : {stats?.defense}</p>
            <p>SPD : {stats?.speed}</p>
          </div>
        </div>
      )}
    </main>
  );
}