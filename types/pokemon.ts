export type PokemonType =
  | "NORMAL"
  | "FIRE"
  | "WATER"
  | "GRASS"
  | "ELECTRIC"
  | "FIGHTING"
  | "PSYCHIC"
  | "FLYING";

export type Pokemon = {
  id: string;

  species: string;
  type: PokemonType;

  level: number;
  xp: number;
};