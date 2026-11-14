import { DexieLooksRepository } from "./dexieLooksRepository";
import type { LooksRepository } from "./types";

export type { ClientSummary, LooksRepository, SavedLook } from "./types";

let singleton: LooksRepository | null = null;

/**
 * Factory behind the LooksRepository interface so persistence can later
 * swap to Supabase/SQLite without touching UI code.
 */
export function getLooksRepository(): LooksRepository {
  if (typeof window === "undefined") {
    throw new Error("LooksRepository is browser-only (IndexedDB)");
  }
  if (!singleton) {
    singleton = new DexieLooksRepository();
  }
  return singleton;
}
