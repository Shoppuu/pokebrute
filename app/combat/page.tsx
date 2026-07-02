"use client";

import {
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import BattleArena from "@/components/battlearena";

import { Pokemon } from "@/types/pokemon";
import {
  BattleEvent,
  BattleSession,
  BattleSummary,
} from "@/types/battle";

import {
  loadPokemon,
  savePokemon,
  subscribePokemon,
} from "@/services/player-storage";
import {
  clearBattleSession,
  loadBattleSession,
  saveBattleSession,
  subscribeBattleSession,
} from "@/services/battle-session-storage";

import { generatePokemon } from "@/services/pokemon-generator";
import { getPokemonMaxHp } from "@/services/pokemon-stats";
import { simulateBattle } from "@/services/battle-engine";
import { gainXp } from "@/services/pokemon-leveling";
import {
  applyLevelReward,
  createLevelRewards,
} from "@/services/progression-rewards";
import { LevelReward } from "@/types/progression";

const BATTLE_EVENT_DELAY =
  1300;

const MAX_BATTLE_HISTORY =
  20;

function wait(
  duration: number
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        duration
      )
  );
}

function createOpponent(
  playerPokemon: Pokemon,
  seed: number
) {
  void seed;

  const enemy =
    generatePokemon();

  enemy.level =
    playerPokemon.level;

  return enemy;
}

function describeEvent(
  event: BattleEvent,
  player: Pokemon,
  opponent: Pokemon
) {
  function getName(
    pokemonId: string,
    species: string
  ) {
    if (
      pokemonId ===
      player.id
    ) {
      return `Ton ${species}`;
    }

    if (
      pokemonId ===
      opponent.id
    ) {
      return `${species} adverse`;
    }

    return species;
  }

  if (
    event.type ===
    "damage"
  ) {
    const attacker =
      getName(
        event.attackerId,
        event.attacker
      );

    const defender =
      getName(
        event.defenderId,
        event.defender
      );

    if (event.critical) {
      return `Critique ! ${attacker} frappe ${defender}.`;
    }

    return `${attacker} attaque ${defender}.`;
  }

  if (
    event.type ===
    "dodge"
  ) {
    return `${getName(event.pokemonId, event.pokemon)} esquive.`;
  }

  if (
    event.type ===
    "block"
  ) {
    return `${getName(event.pokemonId, event.pokemon)} bloque.`;
  }

  if (
    event.type ===
    "doubleAttack"
  ) {
    return `${getName(event.pokemonId, event.pokemon)} enchaîne.`;
  }

  return `${getName(event.pokemonId, event.pokemon)} gagne.`;
}

function resolveBattle(
  player: Pokemon,
  opponent: Pokemon
) {
  const result =
    simulateBattle(
      player,
      opponent
    );

  const victory =
    result.winner.id ===
    player.id;

  const xpEarned =
    victory
      ? 20
      : 10;

  const progression =
    gainXp(
      player.level,
      player.xp,
      xpEarned
    );

  const levelsGained =
    progression.level -
    player.level;

  const summary: BattleSummary = {
    victory,
    xpEarned,
    levelsGained,
  };

  const battleHistoryEntry = {
    id:
      crypto.randomUUID(),
    foughtAt:
      new Date().toISOString(),
    opponentSpecies:
      opponent.species,
    opponentLevel:
      opponent.level,
    result:
      victory
        ? "victory"
        : "defeat",
    xpEarned,
    levelsGained,
    playerLevelAfter:
      progression.level,
  } as const;

  const leveledPlayer: Pokemon = {
    ...player,

    level:
      progression.level,

    xp:
      progression.xp,

    battles:
      player.battles + 1,

    wins:
      player.wins +
      (victory ? 1 : 0),

    losses:
      player.losses +
      (victory ? 0 : 1),

    battleHistory: [
      battleHistoryEntry,
      ...player.battleHistory,
    ].slice(
      0,
      MAX_BATTLE_HISTORY
    ),
  };

  const updatedPlayer: Pokemon =
    levelsGained > 0
      ? {
          ...leveledPlayer,
          pendingRewardCount:
            levelsGained,
          pendingRewardChoices:
            createLevelRewards(
              leveledPlayer
            ),
        }
      : {
          ...leveledPlayer,
          pendingRewardCount: 0,
          pendingRewardChoices: [],
        };

  const session: BattleSession = {
    id:
      crypto.randomUUID(),
    createdAt:
      new Date().toISOString(),
    player,
    opponent,
    events:
      result.events,
    summary,
  };

  return {
    session,
    updatedPlayer,
  };
}

export default function Combat() {
  const player =
    useSyncExternalStore(
      subscribePokemon,
      loadPokemon,
      () => null
    );

  const battleSession =
    useSyncExternalStore(
      subscribeBattleSession,
      loadBattleSession,
      () => null
    );

  const [
    opponentSeed,
    setOpponentSeed,
  ] = useState(0);

  const [
    playerHp,
    setPlayerHp,
  ] = useState<number | null>(null);

  const [
    enemyHp,
    setEnemyHp,
  ] = useState<number | null>(null);

  const [
    currentEvent,
    setCurrentEvent,
  ] = useState("");

  const [
    eventLog,
    setEventLog,
  ] = useState<string[]>([]);

  const [
    summary,
    setSummary,
  ] = useState<BattleSummary | null>(null);

  const [
    isBattling,
    setIsBattling,
  ] = useState(false);

  const [
    isChoosingReward,
    setIsChoosingReward,
  ] = useState(false);

  const opponent =
    useMemo(
      () =>
        player
          ? createOpponent(
              player,
              opponentSeed
            )
          : null,
      [
        player,
        opponentSeed,
      ]
    );

  async function playBattleSession(
    session: BattleSession
  ) {
    setIsBattling(
      true
    );

    setSummary(
      null
    );

    setEventLog(
      []
    );

    const playerMaxHp =
      getPokemonMaxHp(
        session.player
      );

    const enemyMaxHp =
      getPokemonMaxHp(
        session.opponent
      );

    setPlayerHp(
      playerMaxHp
    );

    setEnemyHp(
      enemyMaxHp
    );

    for (const event of session.events) {
      await wait(
        BATTLE_EVENT_DELAY
      );

      const message =
        describeEvent(
          event,
          session.player,
          session.opponent
        );

      setCurrentEvent(
        message
      );

      setEventLog(
        (events) =>
          [
            message,
            ...events,
          ].slice(
            0,
            8
          )
      );

      if (
        event.type ===
        "damage"
      ) {
        if (
          event.defenderId ===
          session.player.id
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
    }

    clearBattleSession();

    setSummary(
      session.summary
    );

    setOpponentSeed(
      (seed) =>
        seed + 1
    );

    setIsBattling(
      false
    );
  }

  async function startBattle() {
    if (
      !player ||
      !opponent ||
      isBattling ||
      battleSession ||
      player.pendingRewardChoices.length > 0
    ) {
      return;
    }

    const {
      session,
      updatedPlayer,
    } = resolveBattle(
      player,
      opponent
    );

    saveBattleSession(
      session
    );

    savePokemon(
      updatedPlayer
    );

    await playBattleSession(
      session
    );
  }

  function skipBattleReplay(
    session: BattleSession
  ) {
    clearBattleSession();

    setSummary(
      session.summary
    );

    setPlayerHp(
      null
    );

    setEnemyHp(
      null
    );

    setCurrentEvent(
      ""
    );

    setEventLog(
      []
    );
  }

  function chooseReward(
    reward: LevelReward
  ) {
    if (
      !player ||
      isChoosingReward ||
      !player.pendingRewardChoices.some(
        (choice) =>
          choice.id === reward.id
      )
    ) {
      return;
    }

    setIsChoosingReward(
      true
    );

    const updatedPlayer =
      applyLevelReward(
        player,
        reward
      );

    const remainingRewards =
      Math.max(
        0,
        player.pendingRewardCount - 1
      );

    savePokemon({
      ...updatedPlayer,
      pendingRewardCount:
        remainingRewards,
      pendingRewardChoices:
        remainingRewards > 0
          ? createLevelRewards(
              updatedPlayer
            )
          : [],
    });

    window.setTimeout(
      () =>
        setIsChoosingReward(
          false
        ),
      250
    );
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

  const playerDisplayHp =
    playerHp ??
    getPokemonMaxHp(
      battleSession?.player ??
        player
    );

  const activePlayer =
    battleSession?.player ??
    player;

  const activeOpponent =
    battleSession?.opponent ??
    opponent;

  const enemyDisplayHp =
    activeOpponent
      ? enemyHp ??
        getPokemonMaxHp(
          activeOpponent
        )
      : 0;

  const hasPendingReward =
    player.pendingRewardChoices.length > 0 &&
    !battleSession;

  return (
    <main className="min-h-screen p-8">
      <Navbar />

      <h1 className="mb-8 text-5xl font-bold">
        Combat
      </h1>

      {activeOpponent && (
        <>
          <BattleArena
            player={activePlayer}
            opponent={activeOpponent}
            playerHp={playerDisplayHp}
            enemyHp={enemyDisplayHp}
            currentEvent={currentEvent}
          />

          {battleSession && !isBattling && (
            <div className="mx-auto mt-8 max-w-md rounded border-2 border-red-500 p-4 text-center">
              <p className="text-2xl font-bold">
                Combat déjà résolu
              </p>

              <p className="mt-2 text-gray-600">
                Le résultat a été sauvegardé avant l&apos;animation.
              </p>

              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() =>
                    playBattleSession(
                      battleSession
                    )
                  }
                  className="rounded bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
                >
                  Reprendre
                </button>

                <button
                  onClick={() =>
                    skipBattleReplay(
                      battleSession
                    )
                  }
                  className="rounded border px-5 py-3 font-bold hover:bg-gray-50"
                >
                  Voir le résultat
                </button>
              </div>
            </div>
          )}

          {summary && (
            <div className="mx-auto mt-8 max-w-md rounded border p-4 text-center">
              <p className="text-2xl font-bold">
                {summary.victory
                  ? "Victoire"
                  : "Défaite"}
              </p>

              <p className="mt-2 text-gray-600">
                +{summary.xpEarned} XP
              </p>

              {summary.levelsGained > 0 && (
                <p className="mt-2 font-bold text-blue-600">
                  Niveau +{summary.levelsGained}
                </p>
              )}

              <Link
                href="/dashboard"
                className="mt-4 inline-block rounded border px-5 py-3 font-bold hover:bg-gray-50"
              >
                Retour au dashboard
              </Link>
            </div>
          )}

          {hasPendingReward && (
            <div className="mx-auto mt-8 max-w-3xl rounded border-2 border-blue-500 p-5">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold">
                  Choisis une récompense
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {player.pendingRewardCount} choix de niveau restant
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {player.pendingRewardChoices.map(
                  (reward) => (
                    <button
                      key={reward.id}
                      disabled={isChoosingReward}
                      onClick={() =>
                        chooseReward(
                          reward
                        )
                      }
                      className="rounded border p-4 text-left hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <p className="text-xs font-bold uppercase text-gray-500">
                        {reward.type === "stat"
                          ? "Statistique"
                          : reward.type === "talent"
                            ? "Talent"
                            : "Objet"}
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {reward.name}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {reward.description}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {eventLog.length > 0 && (
            <div className="mx-auto mt-8 max-w-xl rounded border p-4">
              <h2 className="mb-3 text-xl font-bold">
                Journal du combat
              </h2>

              <ol className="space-y-2 text-sm text-gray-600">
                {eventLog.map(
                  (event, index) => (
                    <li key={`${event}-${index}`}>
                      {event}
                    </li>
                  )
                )}
              </ol>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={startBattle}
              disabled={
                isBattling ||
                hasPendingReward ||
                Boolean(
                  battleSession
                )
              }
              className="rounded bg-red-500 px-8 py-4 text-xl text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isBattling
                ? "Combat en cours"
                : battleSession
                  ? "Combat déjà résolu"
                : hasPendingReward
                  ? "Choisis une récompense"
                  : "Combattre"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
