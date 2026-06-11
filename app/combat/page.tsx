"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import BattleArena from "@/components/battlearena";

import { Pokemon } from "@/types/pokemon";

import { loadPokemon } from "@/services/player-storage";
import { generatePokemon } from "@/services/pokemon-generator";
import { getPokemonStats } from "@/services/pokemon-stats";
import { simulateBattle } from "@/services/battle-engine";

export default function Combat() {
  const [player, setPlayer] =
    useState<Pokemon | null>(null);

  const [opponent, setOpponent] =
    useState<Pokemon | null>(null);

  const [playerHp, setPlayerHp] =
    useState(0);

  const [enemyHp, setEnemyHp] =
    useState(0);

  const [currentEvent, setCurrentEvent] =
    useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  function generateOpponent(
    playerPokemon: Pokemon
  ) {
    const enemy =
      generatePokemon();

    enemy.level =
      playerPokemon.level;

    const enemyStats =
      getPokemonStats(
        enemy
      );

    setOpponent(
      enemy
    );

    setEnemyHp(
      enemyStats.defense * 7
    );
  }

  useEffect(() => {
    const savedPokemon =
      loadPokemon();

    if (savedPokemon) {
      setPlayer(
        savedPokemon
      );

      const playerStats =
        getPokemonStats(
          savedPokemon
        );

      setPlayerHp(
        playerStats.defense * 7
      );

      generateOpponent(
        savedPokemon
      );
    }

    setIsLoaded(
      true
    );
  }, []);

  async function startBattle() {
    if (
      !player ||
      !opponent
    ) {
      return;
    }

    const playerStats =
      getPokemonStats(
        player
      );

    const enemyStats =
      getPokemonStats(
        opponent
      );

    const playerMaxHp =
      playerStats.defense * 7;

    const enemyMaxHp =
      enemyStats.defense * 7;

    setPlayerHp(
      playerMaxHp
    );

    setEnemyHp(
      enemyMaxHp
    );

    const result =
      simulateBattle(
        player,
        opponent
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
        if (
          event.critical
        ) {
          setCurrentEvent(
            `💥 Critique ! ${event.attacker}`
          );
        } else {
          setCurrentEvent(
            `${event.attacker} attaque ${event.defender}`
          );
        }

        if (
          event.defenderId ===
          player.id
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
        "block"
      ) {
        setCurrentEvent(
          `🛡 ${event.pokemon} bloque`
        );
      }

      if (
        event.type ===
        "doubleAttack"
      ) {
        setCurrentEvent(
          `⚡ ${event.pokemon} enchaîne !`
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

    generateOpponent(
      player
    );
  }

  if (!isLoaded) {
    return null;
  }

  if (!player) {
    return (
      <main className="min-h-screen p-8">
        <Navbar />

        <h1 className="mb-6 text-5xl font-bold">
          Combat
        </h1>

        <p>
          Aucun Pokémon actif.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">

      <Navbar />

      <h1 className="mb-8 text-5xl font-bold">
        Combat
      </h1>

      {opponent && (
        <>
          <BattleArena
            player={player}
            opponent={opponent}
            playerHp={playerHp}
            enemyHp={enemyHp}
            currentEvent={currentEvent}
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={startBattle}
              className="rounded bg-red-500 px-8 py-4 text-xl text-white hover:bg-red-600"
            >
              ⚔️ Combattre
            </button>
          </div>
        </>
      )}
    </main>
  );
}