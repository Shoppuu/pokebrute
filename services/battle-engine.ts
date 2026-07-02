import { Pokemon } from "@/types/pokemon";
import {
  BattleEvent,
  BattleResult,
} from "@/types/battle";

import { getPokemonStats } from "./pokemon-stats";
import { getCombatModifiers } from "./progression-rewards";

function clampChance(
  chance: number
) {
  return Math.max(
    0,
    Math.min(
      0.6,
      chance
    )
  );
}

function randomMultiplier() {
  return 0.8 + Math.random() * 0.4;
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
  critical: boolean
) {
  const stats =
    getPokemonStats(
      attacker
    );

  const modifiers =
    getCombatModifiers(
      attacker
    );

  let damage =
    stats.attack *
    randomMultiplier() *
    modifiers.damageMultiplier;

  if (critical) {
    damage *= 2;
  }

  return Math.max(
    1,
    Math.floor(
      damage
    )
  );
}

function getMaxHp(
  pokemon: Pokemon
) {
  const stats =
    getPokemonStats(
      pokemon
    );

  const modifiers =
    getCombatModifiers(
      pokemon
    );

  return Math.floor(
    stats.defense *
      7 *
      modifiers.hpMultiplier
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
    getMaxHp(
      pokemonA
    );

  let hpB =
    getMaxHp(
      pokemonB
    );

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

      const attackerModifiers =
        getCombatModifiers(
          attacker
        );

      const defenderModifiers =
        getCombatModifiers(
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
        clampChance(
          defenderModifiers.blockChance
        )
      ) {
        events.push({
          type: "block",

          pokemonId:
            defender.id,

          pokemon:
            defender.species,
        });
      }

      // Esquive

      else {
        const dodgeChance =
          clampChance(
            getRelativeChance(
              attackerStats.speed,
              defenderStats.speed,
              0.10,
              0.20
            ) +
              defenderModifiers.dodgeBonus
          );

        if (
          Math.random() <
          dodgeChance
        ) {
          events.push({
            type: "dodge",

            pokemonId:
              defender.id,

            pokemon:
              defender.species,
          });
        }

        // Dégâts

        else {
          const critical =
            Math.random() <
            clampChance(
              attackerModifiers.criticalChance
            );

          const damage =
            calculateDamage(
              attacker,
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
        clampChance(
          getRelativeChance(
            defenderStats.speed,
            attackerStats.speed,
            0.10,
            0.20
          ) +
            attackerModifiers.doubleAttackBonus
        );

      if (
        Math.random() <
        doubleChance
      ) {
        events.push({
          type:
            "doubleAttack",

          pokemonId:
            attacker.id,

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

    pokemonId:
      winner.id,

    pokemon:
      winner.species,
  });

  return {
    winner,
    loser,
    events,
  };
}
