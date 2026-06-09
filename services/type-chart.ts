import { PokemonType } from "@/types/pokemon";

export const TYPE_ADVANTAGES: Record<
  PokemonType,
  PokemonType[]
> = {
  NORMAL: [],

  FIRE: ["GRASS"],

  WATER: ["FIRE"],

  GRASS: ["WATER"],

  ELECTRIC: [
    "WATER",
    "FLYING",
  ],

  FIGHTING: ["NORMAL"],

  PSYCHIC: ["FIGHTING"],

  FLYING: ["GRASS"],
};

export function hasTypeAdvantage(
  attacker: PokemonType,
  defender: PokemonType
) {
  return TYPE_ADVANTAGES[
    attacker
  ].includes(defender);
}