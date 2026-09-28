import Dexie, { type Table } from 'dexie';

export interface OfflineProfile {
  id?: number;
  transcript: string;
  language: string;
  status: 'pending_sync' | 'synced';
  timestamp: string;
  parsedData?: any;
}

export class JeevikaDB extends Dexie {
  profiles!: Table<OfflineProfile, number>;

  constructor() {
    super('JeevikaDB');
    this.version(1).stores({
      profiles: '++id, status, timestamp'
    });
  }
}

export const db = new JeevikaDB();
