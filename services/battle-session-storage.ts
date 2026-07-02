import { BattleSession } from "@/types/battle";

const STORAGE_KEY =
  "pokebrute-active-battle";

const STORAGE_EVENT =
  "pokebrute-active-battle-updated";

let cachedData:
  string | null | undefined;

let cachedSession:
  BattleSession | null = null;

function isBrowser() {
  return (
    typeof window !==
    "undefined"
  );
}

function notifyBattleSessionChange() {
  window.dispatchEvent(
    new Event(
      STORAGE_EVENT
    )
  );
}

export function saveBattleSession(
  session: BattleSession
) {
  if (!isBrowser()) {
    return;
  }

  const data =
    JSON.stringify(session);

  localStorage.setItem(
    STORAGE_KEY,
    data
  );

  cachedData =
    data;

  cachedSession =
    session;

  notifyBattleSessionChange();
}

export function loadBattleSession():
  BattleSession | null {
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
    return cachedSession;
  }

  cachedData =
    data;

  if (!data) {
    cachedSession =
      null;

    return null;
  }

  cachedSession =
    JSON.parse(
      data
    ) as BattleSession;

  return cachedSession;
}

export function clearBattleSession() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );

  cachedData =
    null;

  cachedSession =
    null;

  notifyBattleSessionChange();
}

export function subscribeBattleSession(
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
