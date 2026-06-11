import { POKEDEX } from "@/data/pokedex";
import { Pokemon } from "@/types/pokemon";

function getGrowth(
  baseStat: number
) {
  return (
    0.5 +
    baseStat / 6
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

  const attackGrowth =
    getGrowth(
      species.baseAttack
    );

  const defenseGrowth =
    getGrowth(
      species.baseDefense
    );

  const speedGrowth =
    getGrowth(
      species.baseSpeed
    );

  return {
    attack:
      species.baseAttack +
      Math.floor(
        (pokemon.level -
          1) *
          attackGrowth
      ),

    defense:
      species.baseDefense +
      Math.floor(
        (pokemon.level -
          1) *
          defenseGrowth
      ),

    speed:
      species.baseSpeed +
      Math.floor(
        (pokemon.level -
          1) *
          speedGrowth
      ),
  };
}