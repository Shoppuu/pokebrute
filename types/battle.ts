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

      pokemon: string;
    }
  | {
      type: "block";

      pokemon: string;
    }
  | {
      type: "doubleAttack";

      pokemon: string;
    }
  | {
      type: "win";

      pokemon: string;
    };

export type BattleResult = {
  winner: Pokemon;
  loser: Pokemon;

  events: BattleEvent[];
};