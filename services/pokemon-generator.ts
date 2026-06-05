import { Pokemon } from "@/types/pokemon";
import { STARTER_POKEMON } from "@/data/pokemon";

export function generatePokemon(): Pokemon {
  const species =
    STARTER_POKEMON[
      Math.floor(Math.random() * STARTER_POKEMON.length)
    ];

  return {
    id: crypto.randomUUID(),

    species,

    level: 1,
    xp: 0,

    attack: Math.floor(Math.random() * 6) + 10,
    defense: Math.floor(Math.random() * 6) + 10,
    speed: Math.floor(Math.random() * 6) + 10,
  };
}