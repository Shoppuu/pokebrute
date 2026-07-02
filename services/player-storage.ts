import { Pokemon } from "@/types/pokemon";

const STORAGE_KEY =
  "pokebrute-player";

const STORAGE_EVENT =
  "pokebrute-player-updated";

let cachedData:
  string | null | undefined;

let cachedPokemon:
  Pokemon | null = null;

function isBrowser() {
  return (
    typeof window !==
    "undefined"
  );
}

function normalizePokemon(
  pokemon: Pokemon
): Pokemon {
  return {
    ...pokemon,

    statBonuses:
      pokemon.statBonuses ?? {
        attack: 0,
        defense: 0,
        speed: 0,
      },

    talents:
      pokemon.talents ?? [],

    items:
      pokemon.items ?? [],

    pendingRewardChoices:
      pokemon.pendingRewardChoices ?? [],

    pendingRewardCount:
      pokemon.pendingRewardCount ?? 0,

    battles:
      pokemon.battles ?? 0,

    wins:
      pokemon.wins ?? 0,

    losses:
      pokemon.losses ?? 0,

    battleHistory:
      pokemon.battleHistory ?? [],
  };
}

function notifyPokemonChange() {
  window.dispatchEvent(
    new Event(
      STORAGE_EVENT
    )
  );
}

export function savePokemon(
  pokemon: Pokemon
) {
  if (!isBrowser()) {
    return;
  }

  const data =
    JSON.stringify(pokemon);

  localStorage.setItem(
    STORAGE_KEY,
    data
  );

  cachedData =
    data;

  cachedPokemon =
    normalizePokemon(
      pokemon
    );

  notifyPokemonChange();
}

export function loadPokemon():
  Pokemon | null {
  if (!isBrowser()) {
    return null;
  }

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (
    data ===
    cachedData
  ) {
    return cachedPokemon;
  }

  cachedData =
    data;

  if (!data) {
    cachedPokemon =
      null;

    return null;
  }

  cachedPokemon =
    normalizePokemon(
    JSON.parse(
      data
    ) as Pokemon
  );

  return cachedPokemon;
}

export function clearPokemon() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );

  cachedData =
    null;

  cachedPokemon =
    null;

  notifyPokemonChange();
}

export function subscribePokemon(
  onStoreChange: () => void
) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener(
    STORAGE_EVENT,
    onStoreChange
  );

  window.addEventListener(
    "storage",
    onStoreChange
  );

  return () => {
    window.removeEventListener(
      STORAGE_EVENT,
      onStoreChange
    );

    window.removeEventListener(
      "storage",
      onStoreChange
    );
  };
}
