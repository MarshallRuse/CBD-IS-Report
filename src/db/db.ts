import Dexie, { Table } from "dexie";
import type { ElentraAugmentedUploadData, ElentraUploadMetaData } from "../lib/interfaces/ElentraUploadData";

export class MySubClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    elentraUploadData!: Table<ElentraAugmentedUploadData>;
    elentraUploadMetaData!: Table<ElentraUploadMetaData>;

    constructor() {
        super("localDB");
        this.version(1).stores({
            elentraData: "&id",
            elentraUploadMetaData: "++id",
        });
    }
}

export const db = new MySubClassedDexie();
