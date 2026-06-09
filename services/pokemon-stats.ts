import { POKEDEX } from "@/data/pokedex";
import { Pokemon } from "@/types/pokemon";

function getQualityBonus(quality: Pokemon["quality"]) {
  switch (quality) {
    case "Commun":
      return 0;

    case "Rare":
      return 1;

    case "Épique":
      return 2;

    case "Légendaire":
      return 3;
  }
}

function getQualityMultiplier(
  quality: Pokemon["quality"]
) {
  switch (quality) {
    case "Commun":
      return 1.0;

    case "Rare":
      return 1.1;

    case "Épique":
      return 1.2;

    case "Légendaire":
      return 1.35;
  }
}

function getGrowth(baseStat: number) {
  return 0.5 + baseStat / 6;
}

export function getPokemonStats(
  pokemon: Pokemon
) {
  const species = POKEDEX.find(
    (entry) => entry.species === pokemon.species
  );

  if (!species) {
    throw new Error(
      `Espèce inconnue : ${pokemon.species}`
    );
  }

  const qualityBonus = getQualityBonus(
    pokemon.quality
  );

  const multiplier = getQualityMultiplier(
    pokemon.quality
  );

  const attackGrowth =
  getGrowth(species.baseAttack);

const defenseGrowth =
  getGrowth(species.baseDefense);

const speedGrowth =
  getGrowth(species.baseSpeed);

return {
  attack:
    species.baseAttack +
    qualityBonus +
    Math.floor(
      (pokemon.level - 1) *
        multiplier *
        attackGrowth
    ),

  defense:
    species.baseDefense +
    qualityBonus +
    Math.floor(
      (pokemon.level - 1) *
        multiplier *
        defenseGrowth
    ),

  speed:
    species.baseSpeed +
    qualityBonus +
    Math.floor(
      (pokemon.level - 1) *
        multiplier *
        speedGrowth
    ),
};
}