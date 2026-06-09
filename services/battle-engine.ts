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

function getDodgeChance(
  speed: number
) {
  return Math.min(
    0.25,
    speed / 1000
  );
}

function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon
) {
  const stats =
    getPokemonStats(
      attacker
    );

  const multiplier =
    getTypeMultiplier(
      attacker,
      defender
    );

  return Math.floor(
    stats.attack *
      randomMultiplier() *
      multiplier
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

  // IMPORTANT :
  // même formule que partout ailleurs
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
    const defenderStats =
      getPokemonStats(
        defender
      );

    if (
      Math.random() <
      getDodgeChance(
        defenderStats.speed
      )
    ) {
      events.push({
        type: "dodge",

        pokemon:
          defender.species,
      });

      [
        attacker,
        defender,
      ] = [
        defender,
        attacker,
      ];

      continue;
    }

    const damage =
      calculateDamage(
        attacker,
        defender
      );

    if (
      defender.id ===
      pokemonA.id
    ) {
      hpA -= damage;

      events.push({
        type: "damage",

        attacker:
          attacker.species,

        defender:
          defender.species,

        damage,

        remainingHp:
          Math.max(
            0,
            hpA
          ),
      });
    } else {
      hpB -= damage;

      events.push({
        type: "damage",

        attacker:
          attacker.species,

        defender:
          defender.species,

        damage,

        remainingHp:
          Math.max(
            0,
            hpB
          ),
      });
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