import Dexie, { type Table } from "dexie";
import type {
  ClientSummary,
  LooksRepository,
  SavedLook,
} from "./types";

class LooksDatabase extends Dexie {
  looks!: Table<SavedLook, number>;

  constructor() {
    super("barbershop-tryon-looks");
    this.version(1).stores({
      looks: "++id, clientNameKey, createdAt, cutId",
    });
  }
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export class DexieLooksRepository implements LooksRepository {
  private readonly db = new LooksDatabase();

  async saveLook(
    look: Omit<SavedLook, "id" | "clientNameKey" | "createdAt"> & {
      createdAt?: number;
    },
  ): Promise<number> {
    if (!look.consent) {
      throw new Error("Consent required");
    }
    const clientName = look.clientName.trim();
    if (!clientName) {
      throw new Error("Client name required");
    }
    const id = await this.db.looks.add({
      clientName,
      clientNameKey: normalizeName(clientName),
      cutId: look.cutId,
      faceShape: look.faceShape,
      notes: look.notes ?? "",
      photo: look.photo,
      resultPhoto: look.resultPhoto,
      createdAt: look.createdAt ?? Date.now(),
      consent: true,
    });
    return id;
  }

  async listClients(query?: string): Promise<ClientSummary[]> {
    const q = query ? normalizeName(query) : "";
    const all = await this.db.looks.toArray();
    const map = new Map<string, ClientSummary>();

    for (const look of all) {
      if (q && !look.clientNameKey.includes(q)) continue;
      const existing = map.get(look.clientNameKey);
      if (!existing) {
        map.set(look.clientNameKey, {
          clientName: look.clientName,
          lookCount: 1,
          lastSavedAt: look.createdAt,
        });
      } else {
        existing.lookCount += 1;
        existing.lastSavedAt = Math.max(existing.lastSavedAt, look.createdAt);
      }
    }

    return [...map.values()].sort((a, b) => b.lastSavedAt - a.lastSavedAt);
  }

  async listLooksForClient(clientName: string): Promise<SavedLook[]> {
    const key = normalizeName(clientName);
    const rows = await this.db.looks.where("clientNameKey").equals(key).toArray();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getLook(id: number): Promise<SavedLook | undefined> {
    return this.db.looks.get(id);
  }

  async deleteLook(id: number): Promise<void> {
    await this.db.looks.delete(id);
  }

  async deleteClient(clientName: string): Promise<void> {
    const key = normalizeName(clientName);
    await this.db.looks.where("clientNameKey").equals(key).delete();
  }
}
