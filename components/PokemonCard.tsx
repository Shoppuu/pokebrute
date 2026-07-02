import { Pokemon } from "@/types/pokemon";
import {
  getPokemonMaxHp,
  getPokemonStats,
} from "@/services/pokemon-stats";

import HealthBar from "./healthbar";

type Props = {
  pokemon: Pokemon;
  hp: number;
  label: string;
  accentClassName: string;
};

export default function PokemonCard({
  pokemon,
  hp,
  label,
  accentClassName,
}: Props) {
  const stats =
    getPokemonStats(
      pokemon
    );

  const maxHp =
    getPokemonMaxHp(
      pokemon
    );

  return (
    <div className={`w-72 rounded-lg border-2 bg-white p-4 shadow ${accentClassName}`}>
      <p className="mb-2 text-xs font-bold uppercase text-gray-500">
        {label}
      </p>

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
