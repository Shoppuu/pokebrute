"use client";

import Navbar from "@/components/navbar";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Pokemon } from "@/types/pokemon";

import { loadPokemon } from "@/services/player-storage";
import { getPokemonStats } from "@/services/pokemon-stats";
import { getXpToNextLevel } from "@/services/pokemon-leveling";

import HealthBar from "@/components/healthbar";
import XpBar from "@/components/xpbar";

export default function Dashboard() {
  const [pokemon, setPokemon] =
    useState<Pokemon | null>(null);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    const savedPokemon =
      loadPokemon();

    setPokemon(
      savedPokemon
    );

    setIsLoaded(
      true
    );
  }, []);

  if (!isLoaded) {
    return null;
  }

  const stats = pokemon
    ? getPokemonStats(
        pokemon
      )
    : null;

  return (
    <main className="min-h-screen p-10">
      <Navbar />

      <h1 className="mb-10 text-5xl font-bold">
        Tableau de bord
      </h1>

      {pokemon ? (
        <div className="mb-10 max-w-md rounded-lg border p-6">

          <h2 className="text-3xl font-bold">
            {pokemon.species}
          </h2>

          <p>
            Type : {pokemon.type}
          </p>

          <p>
            Niveau : {pokemon.level}
          </p>

          <div className="mt-4">
            <p className="mb-2 font-bold">
              PV
            </p>

            <HealthBar
              current={
                stats!.defense * 7
              }
              max={
                stats!.defense * 7
              }
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 font-bold">
              XP
            </p>

            <XpBar
              current={
                pokemon.xp
              }
              max={
                getXpToNextLevel(
                  pokemon.level
                )
              }
            />

            <p className="mt-2 text-sm text-gray-500">
              {pokemon.xp}
              {" / "}
              {getXpToNextLevel(
                pokemon.level
              )}{" "}
              XP
            </p>
          </div>

          <div className="mt-6">
            <p>
              ⚔️ ATK : {stats?.attack}
            </p>

            <p>
              🛡️ DEF : {stats?.defense}
            </p>

            <p>
              ⚡ SPD : {stats?.speed}
            </p>
          </div>

        </div>
      ) : (
        <div className="mb-10 rounded-lg border p-6">

          <h2 className="text-2xl font-bold">
            Aucun Pokémon actif
          </h2>

          <p className="mt-2 text-gray-500">
            Retournez à l'accueil pour obtenir votre premier Pokémon.
          </p>

        </div>
      )}

      <div className="grid grid-cols-2 gap-6">

        <Link
          href="/combat"
          className="rounded bg-red-500 p-10 text-center text-2xl text-white hover:bg-red-600"
        >
          ⚔️ Combat
        </Link>

      </div>

    </main>
  );
}