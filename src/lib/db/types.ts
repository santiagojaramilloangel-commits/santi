import type { CutId } from "@/lib/cuts";
import type { FaceShapeId } from "@/lib/faceShapes";

export type SavedLook = {
  id?: number;
  clientName: string;
  /** Normalized lowercase name for search. */
  clientNameKey: string;
  cutId: CutId;
  faceShape: FaceShapeId;
  notes: string;
  /** JPEG blob stored in IndexedDB. */
  photo: Blob;
  /** Optional generated result blob. */
  resultPhoto?: Blob;
  createdAt: number;
  consent: true;
};

export type ClientSummary = {
  clientName: string;
  lookCount: number;
  lastSavedAt: number;
};

export interface LooksRepository {
  saveLook(
    look: Omit<SavedLook, "id" | "clientNameKey" | "createdAt"> & {
      createdAt?: number;
    },
  ): Promise<number>;
  listClients(query?: string): Promise<ClientSummary[]>;
  listLooksForClient(clientName: string): Promise<SavedLook[]>;
  getLook(id: number): Promise<SavedLook | undefined>;
  deleteLook(id: number): Promise<void>;
  deleteClient(clientName: string): Promise<void>;
}
