import { Pokemon } from "./pokemon";

export type BattleEvent =
  | {
      type: "damage";

      attackerId: string;
      attacker: string;

      defenderId: string;
      defender: string;

      damage: number;

      remainingHp: number;

      critical: boolean;
    }
  | {
      type: "dodge";

      pokemonId: string;
      pokemon: string;
    }
  | {
      type: "block";

      pokemonId: string;
      pokemon: string;
    }
  | {
      type: "doubleAttack";

      pokemonId: string;
      pokemon: string;
    }
  | {
      type: "win";

      pokemonId: string;
      pokemon: string;
    };

export type BattleResult = {
  winner: Pokemon;
  loser: Pokemon;

  events: BattleEvent[];
};

export type BattleSummary = {
  victory: boolean;
  xpEarned: number;
  levelsGained: number;
};

export type BattleSession = {
  id: string;
  createdAt: string;
  player: Pokemon;
  opponent: Pokemon;
  events: BattleEvent[];
  summary: BattleSummary;
};
