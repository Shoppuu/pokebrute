import { PokemonType } from "./pokemon";

export type PokemonSpecies = {
  species: string;
  type: PokemonType;

  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
};