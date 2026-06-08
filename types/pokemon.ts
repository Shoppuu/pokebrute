export type PokemonType =
  | "NORMAL"
  | "FIRE"
  | "WATER"
  | "GRASS"
  | "ELECTRIC"
  | "FIGHTING"
  | "PSYCHIC"
  | "FLYING";

export type Quality =
  | "Commun"
  | "Rare"
  | "Épique"
  | "Légendaire";

export type Pokemon = {
  id: string;

  species: string;
  type: PokemonType;

  quality: Quality;

  level: number;
  xp: number;
};