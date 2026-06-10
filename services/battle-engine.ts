import { Pokemon } from "@/types/pokemon";
import {
  BattleEvent,
  BattleResult,
} from "@/types/battle";

import { getPokemonStats } from "./pokemon-stats";
import { TYPE_ADVANTAGES } from "./type-chart";

function randomMultiplier() {
  return 0.8 + Math.random() * 0.4;
}

function getTypeMultiplier(
  attacker: Pokemon,
  defender: Pokemon
) {
  const advantages =
    TYPE_ADVANTAGES[attacker.type];

  if (
    advantages.includes(
      defender.type as never
    )
  ) {
    return 1.3;
  }

  return 1;
}

function getRelativeChance(
  attackerSpeed: number,
  defenderSpeed: number,
  min: number,
  max: number
) {
  const ratio =
    defenderSpeed /
    (attackerSpeed + defenderSpeed);

  return (
    min +
    (max - min) * ratio
  );
}

function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon,
  critical: boolean
) {
  const stats =
    getPokemonStats(
      attacker
    );

  const typeMultiplier =
    getTypeMultiplier(
      attacker,
      defender
    );

  let damage =
    stats.attack *
    randomMultiplier() *
    typeMultiplier;

  if (critical) {
    damage *= 2;
  }

  return Math.floor(
    damage
  );
}

export function simulateBattle(
  pokemonA: Pokemon,
  pokemonB: Pokemon
): BattleResult {
  const statsA =
    getPokemonStats(
      pokemonA
    );

  const statsB =
    getPokemonStats(
      pokemonB
    );

  let hpA =
    statsA.defense * 7;

  let hpB =
    statsB.defense * 7;

  const events: BattleEvent[] =
    [];

  let attacker =
    pokemonA;

  let defender =
    pokemonB;

  if (
    statsB.speed >
    statsA.speed
  ) {
    attacker =
      pokemonB;

    defender =
      pokemonA;
  }

  while (
    hpA > 0 &&
    hpB > 0
  ) {
    const attackerStats =
      getPokemonStats(
        attacker
      );

    const defenderStats =
      getPokemonStats(
        defender
      );

    let keepAttacking =
      true;

    while (
      keepAttacking &&
      hpA > 0 &&
      hpB > 0
    ) {
      // Blocage

      if (
        Math.random() <
        0.05
      ) {
        events.push({
          type: "block",

          pokemon:
            defender.species,
        });
      }

      // Esquive

      else {
        const dodgeChance =
          getRelativeChance(
            attackerStats.speed,
            defenderStats.speed,
            0.10,
            0.20
          );

        if (
          Math.random() <
          dodgeChance
        ) {
          events.push({
            type: "dodge",

            pokemon:
              defender.species,
          });
        }

        // Dégâts

        else {
          const critical =
            Math.random() <
            0.05;

          const damage =
            calculateDamage(
              attacker,
              defender,
              critical
            );

          if (
            defender.id ===
            pokemonA.id
          ) {
            hpA -= damage;

            events.push({
              type: "damage",

              attackerId:
                attacker.id,

              attacker:
                attacker.species,

              defenderId:
                defender.id,

              defender:
                defender.species,

              damage,

              remainingHp:
                Math.max(
                  0,
                  hpA
                ),

              critical,
            });
          } else {
            hpB -= damage;

            events.push({
              type: "damage",

              attackerId:
                attacker.id,

              attacker:
                attacker.species,

              defenderId:
                defender.id,

              defender:
                defender.species,

              damage,

              remainingHp:
                Math.max(
                  0,
                  hpB
                ),

              critical,
            });
          }
        }
      }

      if (
        hpA <= 0 ||
        hpB <= 0
      ) {
        break;
      }

      const doubleChance =
        getRelativeChance(
          defenderStats.speed,
          attackerStats.speed,
          0.10,
          0.20
        );

      if (
        Math.random() <
        doubleChance
      ) {
        events.push({
          type:
            "doubleAttack",

          pokemon:
            attacker.species,
        });
      } else {
        keepAttacking =
          false;
      }
    }

    [
      attacker,
      defender,
    ] = [
      defender,
      attacker,
    ];
  }

  const winner =
    hpA > 0
      ? pokemonA
      : pokemonB;

  const loser =
    hpA > 0
      ? pokemonB
      : pokemonA;

  events.push({
    type: "win",

    pokemon:
      winner.species,
  });

  return {
    winner,
    loser,
    events,
  };
}