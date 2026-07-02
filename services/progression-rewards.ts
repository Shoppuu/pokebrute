import { Pokemon } from "@/types/pokemon";
import {
  CombatModifiers,
  LevelReward,
  StatKey,
} from "@/types/progression";

const STAT_REWARDS: LevelReward[] = [
  {
    id: "stat-attack",
    type: "stat",
    name: "+2 ATK",
    description: "Augmente définitivement les dégâts.",
    stat: "attack",
  },
  {
    id: "stat-defense",
    type: "stat",
    name: "+2 DEF",
    description: "Augmente définitivement les points de vie.",
    stat: "defense",
  },
  {
    id: "stat-speed",
    type: "stat",
    name: "+2 SPD",
    description: "Augmente initiative, esquive et enchaînements.",
    stat: "speed",
  },
];

const COMMON_TALENTS: LevelReward[] = [
  {
    id: "critical-plus",
    type: "talent",
    name: "Critique +",
    description: "+5% de chance de coup critique.",
  },
  {
    id: "dodge-plus",
    type: "talent",
    name: "Esquive +",
    description: "+5% de chance d'esquiver.",
  },
  {
    id: "block-plus",
    type: "talent",
    name: "Blocage +",
    description: "+5% de chance de bloquer.",
  },
  {
    id: "double-attack-plus",
    type: "talent",
    name: "Double frappe +",
    description: "+5% de chance d'enchaîner.",
  },
  {
    id: "damage-plus",
    type: "talent",
    name: "Dégâts +",
    description: "+10% de dégâts.",
  },
  {
    id: "hp-plus",
    type: "talent",
    name: "PV +",
    description: "+10% de points de vie.",
  },
];

const SPECIES_TALENTS: Record<string, LevelReward[]> = {
  Pikachu: [
    {
      id: "static-electricity",
      type: "talent",
      name: "Électricité statique",
      description: "+5% blocage et +5% contre-attaque.",
    },
    {
      id: "overload",
      type: "talent",
      name: "Surcharge",
      description: "+15% de dégâts.",
    },
    {
      id: "quick-spark",
      type: "talent",
      name: "Vif éclair",
      description: "+5% esquive et +5% double frappe.",
    },
  ],
  Ronflex: [
    {
      id: "thick-skin",
      type: "talent",
      name: "Peau épaisse",
      description: "+15% de points de vie.",
    },
    {
      id: "deep-sleep",
      type: "talent",
      name: "Sommeil profond",
      description: "+5% blocage et +10% PV.",
    },
    {
      id: "bulk",
      type: "talent",
      name: "Corpulence",
      description: "+10% dégâts et +10% PV.",
    },
  ],
  Machoc: [
    {
      id: "steel-fists",
      type: "talent",
      name: "Poings d'acier",
      description: "+10% dégâts et +5% critique.",
    },
    {
      id: "brutal-strike",
      type: "talent",
      name: "Frappe brutale",
      description: "+15% de dégâts.",
    },
    {
      id: "intense-training",
      type: "talent",
      name: "Entraînement intensif",
      description: "+5% critique et +5% double frappe.",
    },
  ],
};

const ITEMS: LevelReward[] = [
  {
    id: "boxing-gloves",
    type: "item",
    name: "Gants de boxe",
    description: "+10% de dégâts.",
  },
  {
    id: "light-cape",
    type: "item",
    name: "Cape légère",
    description: "+5% d'esquive.",
  },
  {
    id: "worn-shield",
    type: "item",
    name: "Bouclier usé",
    description: "+5% de blocage.",
  },
  {
    id: "swift-boots",
    type: "item",
    name: "Bottes rapides",
    description: "+5% de double frappe.",
  },
];

const ALL_NAMED_REWARDS =
  [
    ...COMMON_TALENTS,
    ...Object.values(
      SPECIES_TALENTS
    ).flat(),
    ...ITEMS,
  ];

const DEFAULT_MODIFIERS: CombatModifiers = {
  criticalChance: 0.05,
  blockChance: 0.05,
  dodgeBonus: 0,
  doubleAttackBonus: 0,
  damageMultiplier: 1,
  hpMultiplier: 1,
};

function randomItem<T>(
  items: T[]
) {
  return items[
    Math.floor(
      Math.random() *
        items.length
    )
  ];
}

function getAvailableRewards(
  rewards: LevelReward[],
  ownedIds: string[]
) {
  const available =
    rewards.filter(
      (reward) =>
        !ownedIds.includes(
          reward.id
        )
    );

  return available.length > 0
    ? available
    : rewards;
}

export function createLevelRewards(
  pokemon: Pokemon
) {
  const speciesTalents =
    SPECIES_TALENTS[
      pokemon.species
    ] ?? [];

  const talentPool =
    getAvailableRewards(
      [
        ...COMMON_TALENTS,
        ...speciesTalents,
      ],
      pokemon.talents
    );

  const itemPool =
    getAvailableRewards(
      ITEMS,
      pokemon.items
    );

  return [
    randomItem(
      STAT_REWARDS
    ),
    randomItem(
      talentPool
    ),
    randomItem(
      itemPool
    ),
  ];
}

function addStatBonus(
  pokemon: Pokemon,
  stat: StatKey
) {
  return {
    ...pokemon,
    statBonuses: {
      ...pokemon.statBonuses,
      [stat]:
        pokemon.statBonuses[
          stat
        ] + 2,
    },
  };
}

export function applyLevelReward(
  pokemon: Pokemon,
  reward: LevelReward
): Pokemon {
  if (
    reward.type ===
      "stat" &&
    reward.stat
  ) {
    return addStatBonus(
      pokemon,
      reward.stat
    );
  }

  if (
    reward.type ===
    "talent"
  ) {
    return {
      ...pokemon,
      talents: [
        ...pokemon.talents,
        reward.id,
      ],
    };
  }

  return {
    ...pokemon,
    items: [
      ...pokemon.items,
      reward.id,
    ],
  };
}

function applyModifier(
  modifiers: CombatModifiers,
  id: string
) {
  if (
    id === "critical-plus"
  ) {
    modifiers.criticalChance +=
      0.05;
  }

  if (
    id === "dodge-plus" ||
    id === "light-cape"
  ) {
    modifiers.dodgeBonus +=
      0.05;
  }

  if (
    id === "block-plus" ||
    id === "worn-shield"
  ) {
    modifiers.blockChance +=
      0.05;
  }

  if (
    id === "double-attack-plus" ||
    id === "swift-boots"
  ) {
    modifiers.doubleAttackBonus +=
      0.05;
  }

  if (
    id === "damage-plus" ||
    id === "boxing-gloves"
  ) {
    modifiers.damageMultiplier +=
      0.1;
  }

  if (
    id === "hp-plus"
  ) {
    modifiers.hpMultiplier +=
      0.1;
  }

  if (
    id === "static-electricity"
  ) {
    modifiers.blockChance +=
      0.05;
    modifiers.doubleAttackBonus +=
      0.05;
  }

  if (
    id === "overload" ||
    id === "brutal-strike"
  ) {
    modifiers.damageMultiplier +=
      0.15;
  }

  if (
    id === "quick-spark"
  ) {
    modifiers.dodgeBonus +=
      0.05;
    modifiers.doubleAttackBonus +=
      0.05;
  }

  if (
    id === "thick-skin"
  ) {
    modifiers.hpMultiplier +=
      0.15;
  }

  if (
    id === "deep-sleep"
  ) {
    modifiers.blockChance +=
      0.05;
    modifiers.hpMultiplier +=
      0.1;
  }

  if (
    id === "bulk"
  ) {
    modifiers.damageMultiplier +=
      0.1;
    modifiers.hpMultiplier +=
      0.1;
  }

  if (
    id === "steel-fists"
  ) {
    modifiers.damageMultiplier +=
      0.1;
    modifiers.criticalChance +=
      0.05;
  }

  if (
    id === "intense-training"
  ) {
    modifiers.criticalChance +=
      0.05;
    modifiers.doubleAttackBonus +=
      0.05;
  }
}

export function getCombatModifiers(
  pokemon: Pokemon
) {
  const modifiers = {
    ...DEFAULT_MODIFIERS,
  };

  [
    ...pokemon.talents,
    ...pokemon.items,
  ].forEach(
    (id) =>
      applyModifier(
        modifiers,
        id
      )
  );

  return modifiers;
}

export function getRewardName(
  id: string
) {
  return (
    ALL_NAMED_REWARDS.find(
      (reward) =>
        reward.id === id
    )?.name ?? id
  );
}

export function getRewardDescription(
  id: string
) {
  return (
    ALL_NAMED_REWARDS.find(
      (reward) =>
        reward.id === id
    )?.description ?? ""
  );
}
