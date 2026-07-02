export type StatKey =
  | "attack"
  | "defense"
  | "speed";

export type StatBonuses = {
  attack: number;
  defense: number;
  speed: number;
};

export type RewardType =
  | "stat"
  | "talent"
  | "item";

export type LevelReward = {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  stat?: StatKey;
};

export type CombatModifiers = {
  criticalChance: number;
  blockChance: number;
  dodgeBonus: number;
  doubleAttackBonus: number;
  damageMultiplier: number;
  hpMultiplier: number;
};
