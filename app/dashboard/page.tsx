"use client";

import Navbar from "@/components/navbar";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import {
  loadPokemon,
  subscribePokemon,
} from "@/services/player-storage";
import {
  getPokemonMaxHp,
  getPokemonStats,
} from "@/services/pokemon-stats";
import {
  getCombatModifiers,
  getRewardDescription,
  getRewardName,
} from "@/services/progression-rewards";
import { getXpToNextLevel } from "@/services/pokemon-leveling";

import HealthBar from "@/components/healthbar";
import XpBar from "@/components/xpbar";

function formatPercent(
  value: number
) {
  return `${Math.round(
    value * 100
  )}%`;
}

function formatBattleDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    new Date(
      value
    )
  );
}

export default function Dashboard() {
  const pokemon =
    useSyncExternalStore(
      subscribePokemon,
      loadPokemon,
      () => null
    );

  const stats = pokemon
    ? getPokemonStats(
        pokemon
      )
    : null;

  const modifiers = pokemon
    ? getCombatModifiers(
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

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded border p-3">
              <p className="text-2xl font-bold">
                {pokemon.battles}
              </p>

              <p className="text-xs text-gray-500">
                Combats
              </p>
            </div>

            <div className="rounded border p-3">
              <p className="text-2xl font-bold">
                {pokemon.wins}
              </p>

              <p className="text-xs text-gray-500">
                Victoires
              </p>
            </div>

            <div className="rounded border p-3">
              <p className="text-2xl font-bold">
                {pokemon.losses}
              </p>

              <p className="text-xs text-gray-500">
                Défaites
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 font-bold">
              PV
            </p>

            <HealthBar
              current={
                getPokemonMaxHp(
                  pokemon
                )
              }
              max={
                getPokemonMaxHp(
                  pokemon
                )
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
              {" "}
              <span className="text-sm text-gray-500">
                (+{pokemon.statBonuses.attack})
              </span>
            </p>

            <p>
              🛡️ DEF : {stats?.defense}
              {" "}
              <span className="text-sm text-gray-500">
                (+{pokemon.statBonuses.defense})
              </span>
            </p>

            <p>
              ⚡ SPD : {stats?.speed}
              {" "}
              <span className="text-sm text-gray-500">
                (+{pokemon.statBonuses.speed})
              </span>
            </p>
          </div>

          {modifiers && (
            <div className="mt-6">
              <h3 className="font-bold">
                Effets de combat
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    Critique
                  </p>

                  <p className="text-lg font-bold">
                    {formatPercent(
                      modifiers.criticalChance
                    )}
                  </p>
                </div>

                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    Blocage
                  </p>

                  <p className="text-lg font-bold">
                    {formatPercent(
                      modifiers.blockChance
                    )}
                  </p>
                </div>

                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    Esquive
                  </p>

                  <p className="text-lg font-bold">
                    +{formatPercent(
                      modifiers.dodgeBonus
                    )}
                  </p>
                </div>

                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    Double frappe
                  </p>

                  <p className="text-lg font-bold">
                    +{formatPercent(
                      modifiers.doubleAttackBonus
                    )}
                  </p>
                </div>

                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    Dégâts
                  </p>

                  <p className="text-lg font-bold">
                    x{modifiers.damageMultiplier.toFixed(2)}
                  </p>
                </div>

                <div className="rounded border p-3">
                  <p className="text-gray-500">
                    PV
                  </p>

                  <p className="text-lg font-bold">
                    x{modifiers.hpMultiplier.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-bold">
              Talents
            </h3>

            {pokemon.talents.length > 0 ? (
              <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                {pokemon.talents.map(
                  (talent, index) => (
                    <li key={`${talent}-${index}`}>
                      <span className="font-medium text-gray-800">
                        {getRewardName(
                          talent
                        )}
                      </span>
                      {" - "}
                      {getRewardDescription(
                        talent
                      )}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Aucun talent pour le moment.
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-bold">
              Objets
            </h3>

            {pokemon.items.length > 0 ? (
              <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                {pokemon.items.map(
                  (item, index) => (
                    <li key={`${item}-${index}`}>
                      <span className="font-medium text-gray-800">
                        {getRewardName(
                          item
                        )}
                      </span>
                      {" - "}
                      {getRewardDescription(
                        item
                      )}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Aucun objet pour le moment.
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-bold">
              Historique récent
            </h3>

            {pokemon.battleHistory.length > 0 ? (
              <div className="mt-3 space-y-3">
                {pokemon.battleHistory.slice(
                  0,
                  5
                ).map(
                  (battle) => (
                    <div
                      key={battle.id}
                      className="rounded border p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold">
                          {battle.result === "victory"
                            ? "Victoire"
                            : "Défaite"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatBattleDate(
                            battle.foughtAt
                          )}
                        </p>
                      </div>

                      <p className="mt-1 text-gray-600">
                        vs {battle.opponentSpecies} niv. {battle.opponentLevel}
                      </p>

                      <p className="mt-1 text-gray-600">
                        +{battle.xpEarned} XP
                        {battle.levelsGained > 0 &&
                          ` - Niveau +${battle.levelsGained}`}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Aucun combat enregistré.
              </p>
            )}
          </div>

        </div>
      ) : (
        <div className="mb-10 rounded-lg border p-6">

          <h2 className="text-2xl font-bold">
            Aucun Pokémon actif
          </h2>

          <p className="mt-2 text-gray-500">
            Retournez à l&apos;accueil pour obtenir votre premier Pokémon.
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
