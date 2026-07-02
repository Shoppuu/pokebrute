import { Pokemon } from "@/types/pokemon";

import PokemonCard from "./PokemonCard";

type Props = {
  player: Pokemon;
  opponent: Pokemon;

  playerHp: number;
  enemyHp: number;

  currentEvent: string;
};

export default function BattleArena({
  player,
  opponent,
  playerHp,
  enemyHp,
  currentEvent,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-start gap-12">

        <PokemonCard
          pokemon={player}
          hp={playerHp}
          label="Toi"
          accentClassName="border-blue-500"
        />

        <div className="mt-20 text-4xl font-bold">
          VS
        </div>

        <PokemonCard
          pokemon={opponent}
          hp={enemyHp}
          label="Adversaire"
          accentClassName="border-red-500"
        />

      </div>

      <div className="min-h-20 text-center text-2xl font-bold">
        {currentEvent}
      </div>
    </div>
  );
}
