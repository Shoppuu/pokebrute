"use client";

import { useState } from "react";

import { Pokemon } from "@/types/pokemon";

import { generatePokemon } from "@/services/pokemon-generator";
import { getPokemonStats } from "@/services/pokemon-stats";
import { simulateBattle } from "@/services/battle-engine";

import BattleArena from "@/components/battlearena";

export default function Home() {
  const [pokemon, setPokemon] =
    useState<Pokemon | null>(null);

  const [opponent, setOpponent] =
    useState<Pokemon | null>(null);

  const [playerHp, setPlayerHp] =
    useState(0);

  const [enemyHp, setEnemyHp] =
    useState(0);

  const [currentEvent, setCurrentEvent] =
    useState("");

  function getStarterPokemon() {
    const starter =
      generatePokemon();

    const enemy =
      generatePokemon();

    const starterStats =
      getPokemonStats(
        starter
      );

    const enemyStats =
      getPokemonStats(
        enemy
      );

    setPokemon(starter);

    setOpponent(enemy);

    setPlayerHp(
      starterStats.defense * 7
    );

    setEnemyHp(
      enemyStats.defense * 7
    );

    setCurrentEvent(
      "⚔️ Prêt au combat"
    );
  }

  async function startBattle() {
    if (
      !pokemon ||
      !opponent
    ) {
      return;
    }

    const result =
      simulateBattle(
        pokemon,
        opponent
      );

    const playerStats =
      getPokemonStats(
        pokemon
      );

    const enemyStats =
      getPokemonStats(
        opponent
      );

    setPlayerHp(
      playerStats.defense * 7
    );

    setEnemyHp(
      enemyStats.defense * 7
    );

    for (const event of result.events) {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000
          )
      );

      if (
        event.type ===
        "damage"
      ) {
        setCurrentEvent(
          `${event.attacker} attaque ${event.defender}`
        );

        if (
          event.defender ===
          pokemon.species
        ) {
          setPlayerHp(
            event.remainingHp
          );
        } else {
          setEnemyHp(
            event.remainingHp
          );
        }
      }

      if (
        event.type ===
        "dodge"
      ) {
        setCurrentEvent(
          `💨 ${event.pokemon} esquive`
        );
      }

      if (
        event.type ===
        "win"
      ) {
        setCurrentEvent(
          `🏆 ${event.pokemon} gagne`
        );
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <h1 className="text-5xl font-bold">
        Pokebrute
      </h1>

      <button
        onClick={
          getStarterPokemon
        }
        className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600"
      >
        Recevoir mon premier Pokémon
      </button>

      {pokemon &&
        opponent && (
          <>
            <BattleArena
              player={pokemon}
              opponent={
                opponent
              }
              playerHp={
                playerHp
              }
              enemyHp={
                enemyHp
              }
              currentEvent={
                currentEvent
              }
            />

            <button
              onClick={
                startBattle
              }
              className="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
            >
              ⚔️ Combattre
            </button>
          </>
        )}
    </main>
  );
}