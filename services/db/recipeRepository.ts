import * as SQLite from 'expo-sqlite';
import { Recipe } from '../../types/recipe';
import { mockRecipes } from '../../data/mockRecipes';
import { getDatabase } from './database';

// Flat row shape returned by the `recipes` table
type RecipeRow = {
  id: string;
  name: string;
  description: string;
  calories: number;
  prep_time: number;
  protein: number;
  carbs: number;
  fat: number;
  thumbnail: string;
  category: 'yemek' | 'icecek';
  popularity: number;
};

// Fetches related tags/ingredients/steps and assembles full Recipe objects.
// Uses 3 IN-queries regardless of result set size to avoid N+1.
async function hydrateRecipes(
  db: SQLite.SQLiteDatabase,
  rows: RecipeRow[]
): Promise<Recipe[]> {
  if (rows.length === 0) return [];

  const ids = rows.map(r => r.id);
  const placeholders = ids.map(() => '?').join(',');

  const [tagRows, ingredientRows, stepRows] = await Promise.all([
    db.getAllAsync<{ recipe_id: string; tag: string }>(
      `SELECT recipe_id, tag FROM recipe_tags WHERE recipe_id IN (${placeholders})`,
      ids
    ),
    db.getAllAsync<{ recipe_id: string; text: string }>(
      `SELECT recipe_id, text FROM recipe_ingredients WHERE recipe_id IN (${placeholders}) ORDER BY position ASC`,
      ids
    ),
    db.getAllAsync<{ recipe_id: string; text: string }>(
      `SELECT recipe_id, text FROM recipe_steps WHERE recipe_id IN (${placeholders}) ORDER BY position ASC`,
      ids
    ),
  ]);

  const tagMap = new Map<string, string[]>();
  const ingredientMap = new Map<string, string[]>();
  const stepMap = new Map<string, string[]>();

  for (const t of tagRows) {
    if (!tagMap.has(t.recipe_id)) tagMap.set(t.recipe_id, []);
    tagMap.get(t.recipe_id)!.push(t.tag);
  }
  for (const i of ingredientRows) {
    if (!ingredientMap.has(i.recipe_id)) ingredientMap.set(i.recipe_id, []);
    ingredientMap.get(i.recipe_id)!.push(i.text);
  }
  for (const s of stepRows) {
    if (!stepMap.has(s.recipe_id)) stepMap.set(s.recipe_id, []);
    stepMap.get(s.recipe_id)!.push(s.text);
  }

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    calories: row.calories,
    prepTime: row.prep_time,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    thumbnail: row.thumbnail,
    category: row.category,
    tags: tagMap.get(row.id) ?? [],
    ingredients: ingredientMap.get(row.id) ?? [],
    steps: stepMap.get(row.id) ?? [],
  }));
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Public DAO API ───────────────────────────────────────────────────────────
// All functions fall back to mockRecipes when the DB is unavailable.

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const db = await getDatabase();
  if (!db) return mockRecipes.find(r => r.id === id) ?? null;

  const row = await db.getFirstAsync<RecipeRow>(
    'SELECT * FROM recipes WHERE id = ?',
    [id]
  );
  if (!row) return null;
  const results = await hydrateRecipes(db, [row]);
  return results[0] ?? null;
}

export async function getRecipesByIds(ids: string[]): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const map = new Map(mockRecipes.map(r => [r.id, r]));
    return ids.flatMap(id => (map.has(id) ? [map.get(id)!] : []));
  }

  const placeholders = ids.map(() => '?').join(',');
  const rows = await db.getAllAsync<RecipeRow>(
    `SELECT * FROM recipes WHERE id IN (${placeholders})`,
    ids
  );
  const hydrated = await hydrateRecipes(db, rows);
  const byId = new Map(hydrated.map(r => [r.id, r]));
  return ids.flatMap(id => (byId.has(id) ? [byId.get(id)!] : []));
}

export async function getAllRecipes(limit?: number, offset?: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const start = offset ?? 0;
    const end = limit !== undefined ? start + limit : undefined;
    return mockRecipes.slice(start, end);
  }

  const rows = await db.getAllAsync<RecipeRow>(
    'SELECT * FROM recipes LIMIT ? OFFSET ?',
    [limit ?? -1, offset ?? 0]
  );
  return hydrateRecipes(db, rows);
}

export async function getPopularRecipes(limit: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) return mockRecipes.slice(0, limit);

  const rows = await db.getAllAsync<RecipeRow>(
    'SELECT * FROM recipes ORDER BY popularity DESC LIMIT ?',
    [limit]
  );
  return hydrateRecipes(db, rows);
}

export async function getRecipesByTag(tag: string, limit?: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const filtered = mockRecipes.filter(r => r.tags.includes(tag));
    return limit !== undefined ? filtered.slice(0, limit) : filtered;
  }

  const rows = await db.getAllAsync<RecipeRow>(
    `SELECT r.* FROM recipes r
     JOIN recipe_tags rt ON r.id = rt.recipe_id
     WHERE rt.tag = ?
     LIMIT ?`,
    [tag, limit ?? -1]
  );
  return hydrateRecipes(db, rows);
}

export async function getRecipesByTags(
  tags: string[],
  matchAll = false,
  limit?: number
): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const filtered = mockRecipes.filter(r =>
      matchAll ? tags.every(t => r.tags.includes(t)) : tags.some(t => r.tags.includes(t))
    );
    return limit !== undefined ? filtered.slice(0, limit) : filtered;
  }

  const placeholders = tags.map(() => '?').join(',');
  const rows = matchAll
    ? await db.getAllAsync<RecipeRow>(
        `SELECT r.* FROM recipes r
         JOIN recipe_tags rt ON r.id = rt.recipe_id
         WHERE rt.tag IN (${placeholders})
         GROUP BY r.id
         HAVING COUNT(DISTINCT rt.tag) = ?
         LIMIT ?`,
        [...tags, tags.length, limit ?? -1]
      )
    : await db.getAllAsync<RecipeRow>(
        `SELECT DISTINCT r.* FROM recipes r
         JOIN recipe_tags rt ON r.id = rt.recipe_id
         WHERE rt.tag IN (${placeholders})
         LIMIT ?`,
        [...tags, limit ?? -1]
      );
  return hydrateRecipes(db, rows);
}

export async function getRecipesByCategory(
  category: 'yemek' | 'icecek',
  limit?: number
): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    // Mock recipes have no category; treat all as 'yemek'
    const result = category === 'yemek' ? mockRecipes : [];
    return limit !== undefined ? result.slice(0, limit) : result;
  }

  const rows = await db.getAllAsync<RecipeRow>(
    'SELECT * FROM recipes WHERE category = ? LIMIT ?',
    [category, limit ?? -1]
  );
  return hydrateRecipes(db, rows);
}

export async function getQuickRecipes(maxPrepTime: number, limit?: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const filtered = mockRecipes.filter(r => r.prepTime <= maxPrepTime);
    return limit !== undefined ? filtered.slice(0, limit) : filtered;
  }

  const rows = await db.getAllAsync<RecipeRow>(
    'SELECT * FROM recipes WHERE prep_time <= ? ORDER BY prep_time ASC LIMIT ?',
    [maxPrepTime, limit ?? -1]
  );
  return hydrateRecipes(db, rows);
}

export async function searchRecipes(query: string, limit?: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    const q = query.toLowerCase();
    const filtered = mockRecipes.filter(
      r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
    return limit !== undefined ? filtered.slice(0, limit) : filtered;
  }

  // FTS5 search; falls back to LIKE if the virtual table is not yet populated
  try {
    const ftsQuery = query
      .trim()
      .split(/\s+/)
      .map(w => `"${w}"*`)
      .join(' ');
    const rows = await db.getAllAsync<RecipeRow>(
      `SELECT r.* FROM recipes r
       WHERE r.rowid IN (SELECT rowid FROM recipes_fts WHERE recipes_fts MATCH ?)
       LIMIT ?`,
      [ftsQuery, limit ?? 20]
    );
    return hydrateRecipes(db, rows);
  } catch {
    const pattern = `%${query}%`;
    const rows = await db.getAllAsync<RecipeRow>(
      'SELECT * FROM recipes WHERE name LIKE ? OR description LIKE ? LIMIT ?',
      [pattern, pattern, limit ?? 20]
    );
    return hydrateRecipes(db, rows);
  }
}

export async function getRandomRecipes(limit: number): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) return shuffled(mockRecipes).slice(0, limit);

  const rows = await db.getAllAsync<RecipeRow>(
    'SELECT * FROM recipes ORDER BY RANDOM() LIMIT ?',
    [limit]
  );
  return hydrateRecipes(db, rows);
}

export async function getRecipesExcluding(
  excludeIds: string[],
  limit: number
): Promise<Recipe[]> {
  const db = await getDatabase();
  if (!db) {
    return mockRecipes.filter(r => !excludeIds.includes(r.id)).slice(0, limit);
  }

  if (excludeIds.length === 0) {
    return getAllRecipes(limit);
  }

  const placeholders = excludeIds.map(() => '?').join(',');
  const rows = await db.getAllAsync<RecipeRow>(
    `SELECT * FROM recipes WHERE id NOT IN (${placeholders}) LIMIT ?`,
    [...excludeIds, limit]
  );
  return hydrateRecipes(db, rows);
}
