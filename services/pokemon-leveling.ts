export function getXpToNextLevel(
  level: number
) {
  return (
    10 +
    level * 10
  );
}

export function gainXp(
  level: number,
  currentXp: number,
  amount: number
) {
  let newLevel =
    level;

  let newXp =
    currentXp + amount;

  while (true) {
    const requiredXp =
      getXpToNextLevel(
        newLevel
      );

    if (
      newXp <
      requiredXp
    ) {
      break;
    }

    newXp -=
      requiredXp;

    newLevel++;
  }

  return {
    level: newLevel,
    xp: newXp,
  };
}