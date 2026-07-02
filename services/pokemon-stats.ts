import { POKEDEX } from "@/data/pokedex";
import { Pokemon } from "@/types/pokemon";
import { getCombatModifiers } from "./progression-rewards";

const BASE_STAT =
  2;

function getNaturalBonus(
  level: number
) {
  return (
    Math.floor(
      level / 5
    ) * 2
  );
}

export function getPokemonStats(
  pokemon: Pokemon
) {
  const species =
    POKEDEX.find(
      (entry) =>
        entry.species ===
        pokemon.species
    );

  if (!species) {
    throw new Error(
      `Espèce inconnue : ${pokemon.species}`
    );
  }

  const naturalBonus =
    getNaturalBonus(
      pokemon.level
    );

  return {
    attack:
      BASE_STAT +
      naturalBonus +
      pokemon.statBonuses.attack,

    defense:
      BASE_STAT +
      naturalBonus +
      pokemon.statBonuses.defense,

    speed:
      BASE_STAT +
      naturalBonus +
      pokemon.statBonuses.speed,
  };
}

export function getPokemonMaxHp(
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
