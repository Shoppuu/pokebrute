import {
  LevelReward,
  StatBonuses,
} from "./progression";

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

  statBonuses: StatBonuses;
  talents: string[];
  items: string[];

  pendingRewardChoices: LevelReward[];
  pendingRewardCount: number;

  battles: number;
  wins: number;
  losses: number;

  battleHistory: BattleHistoryEntry[];
};

export type BattleHistoryEntry = {
  id: string;
  foughtAt: string;
  opponentSpecies: string;
  opponentLevel: number;
  result: "victory" | "defeat";
  xpEarned: number;
  levelsGained: number;
  playerLevelAfter: number;
};
