import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

const DB_NAME = 'recipes.db';
const DB_DIR = `${FileSystem.documentDirectory}SQLite/`;
const DB_PATH = `${DB_DIR}${DB_NAME}`;

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initialized = false;
let initPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

async function initDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(DB_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true });
    }

    // Copy bundled asset to the SQLite directory on first launch
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
    if (!fileInfo.exists) {
      const asset = Asset.fromModule(require('../../data/recipes.db'));
      await asset.downloadAsync();
      if (!asset.localUri) return null;
      await FileSystem.copyAsync({ from: asset.localUri, to: DB_PATH });
    }

    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Verify this is a fully populated DB, not the empty placeholder.
    // The placeholder has no schema_meta table, so this query throws → returns null.
    const meta = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM schema_meta WHERE key = 'version'"
    );
    if (!meta) {
      await db.closeAsync();
      return null;
    }

    return db;
  } catch {
    // DB unavailable — callers fall back to mock data
    return null;
  }
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  if (initialized) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = initDatabase().then(db => {
    dbInstance = db;
    initialized = true;
    initPromise = null;
    return db;
  });

  return initPromise;
}
