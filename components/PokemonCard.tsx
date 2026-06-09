import { Pokemon } from "@/types/pokemon";
import { getPokemonStats } from "@/services/pokemon-stats";

type Props = {
  pokemon: Pokemon;
};

export default function PokemonCard({
  pokemon,
}: Props) {
  const stats = getPokemonStats(pokemon);

  return (
    <div className="min-w-[300px] rounded-lg border p-4 shadow">
      <h2 className="text-2xl font-bold">
        {pokemon.species}
      </h2>

      <p>Type : {pokemon.type}</p>

      <p>Qualité : {pokemon.quality}</p>

      <p>Niveau : {pokemon.level}</p>

      <div className="mt-4">
        <p>ATK : {stats.attack}</p>
        <p>DEF : {stats.defense}</p>
        <p>SPD : {stats.speed}</p>
      </div>
    </div>
  );
}