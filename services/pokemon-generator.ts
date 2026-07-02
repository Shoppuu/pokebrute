import { POKEDEX } from "@/data/pokedex";
import { Pokemon } from "@/types/pokemon";

export function generatePokemon(): Pokemon {
  const species =
    POKEDEX[
      Math.floor(
        Math.random() *
          POKEDEX.length
      )
    ];

  return {
    id: crypto.randomUUID(),

    species:
      species.species,

    type: species.type,

    level: 1,

    xp: 0,

    statBonuses: {
      attack: 0,
      defense: 0,
      speed: 0,
    },

    talents: [],
    items: [],

    pendingRewardChoices: [],
    pendingRewardCount: 0,

    battles: 0,
    wins: 0,
    losses: 0,
    battleHistory: [],
  };
}
