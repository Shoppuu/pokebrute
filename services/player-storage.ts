import { Pokemon } from "@/types/pokemon";

const STORAGE_KEY =
  "pokebrute-player";

export function savePokemon(
  pokemon: Pokemon
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(pokemon)
  );
}

export function loadPokemon():
  Pokemon | null {
  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!data) {
    return null;
  }

  return JSON.parse(
    data
  ) as Pokemon;
}

export function clearPokemon() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}