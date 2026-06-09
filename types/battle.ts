import { Pokemon } from "./pokemon";

export type BattleEvent =
  | {
      type: "damage";

      attacker: string;
      defender: string;

      damage: number;

      remainingHp: number;
    }
  | {
      type: "dodge";

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