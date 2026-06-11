import { Pokemon } from "@/types/pokemon";
import { getPokemonStats } from "@/services/pokemon-stats";

import HealthBar from "./healthbar";

type Props = {
  pokemon: Pokemon;
  hp: number;
};

export default function PokemonCard({
  pokemon,
  hp,
}: Props) {
  const stats =
    getPokemonStats(
      pokemon
    );

  const maxHp =
    stats.defense * 7;

  return (
    <div className="w-72 rounded-lg border bg-white p-4 shadow">
      <h2 className="text-2xl font-bold">
        {pokemon.species}
      </h2>

      <p>
        {pokemon.type}
      </p>

      <p>
        Niveau {pokemon.level}
      </p>

      <div className="mt-4">
        <HealthBar
          current={hp}
          max={maxHp}
        />
      </div>

      <div className="mt-4 text-sm">
        <p>
          ATK : {stats.attack}
        </p>

        <p>
          DEF : {stats.defense}
        </p>

        <p>
          SPD : {stats.speed}
        </p>
      </div>
    </div>
  );
}