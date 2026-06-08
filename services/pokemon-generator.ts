import { POKEDEX } from "@/data/pokedex";
import { Pokemon, Quality } from "@/types/pokemon";

function getRandomQuality(): Quality {
  const roll = Math.random();

  if (roll < 0.6) return "Commun";
  if (roll < 0.9) return "Rare";
  if (roll < 0.99) return "Épique";

  return "Légendaire";
}

export function generatePokemon(): Pokemon {
  const species =
    POKEDEX[Math.floor(Math.random() * POKEDEX.length)];

  return {
    id: crypto.randomUUID(),

    species: species.species,
    type: species.type,

    quality: getRandomQuality(),

    level: 1,
    xp: 0,
  };
}