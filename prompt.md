## 🎯 İSTEK 3 — SQLite altyapısı + 100-200 tariflik veritabanı

### Karar Gerekçesi

Tarif sayısı kısa vadede 100-200, orta vadede 1000+ olacak. Bunu in-memory array olarak tutmak Hermes JS bundle'ını şişirir, lazy load mümkün olmaz, full-text arama imkânsız. SQLite seçildi çünkü:

- `expo-sqlite` SDK 54 ile native async API sunuyor (UI thread'i bloklamaz)
- FTS5 full-text search desteği var (kullanıcı "tavuk avokado" yazınca tag/içindekiler/ad'da arama yapılabilir)
- Prebuilt `.db` asset olarak bundle'a girer, app açılışında dosya sistemi alanına kopyalanır
- İleride sync/remote DB'ye geçiş kolay (DAO katmanı soyutlandığı sürece)

### Mimari

```
data/
├── seed/
│   ├── recipes-seed.json          ← (YENİ) 100-200 tariflik düz JSON, insan-okunur
│   └── build-db.js                ← (YENİ) Node.js script — seed.json → recipes.db üretir
├── recipes.db                     ← (YENİ, build edilmiş, git'e commitlenir; bundle'a girer)
└── mockRecipes.ts                 ← KALDIRILMAZ ama deprecated marker eklenir;
                                     ileri commit'lerde silinecek, şimdilik test/fallback için bekler

services/
├── db/
│   ├── database.ts                ← (YENİ) DB açma, asset'ten kopyalama, migration kontrolü
│   ├── recipeRepository.ts        ← (YENİ) DAO katmanı — tüm Recipe CRUD/query metotları
│   └── userSignalsRepository.ts   ← (YENİ) Kullanıcı sinyallerini kaydet/oku (Adım 20'de detaylı)
```

### Veritabanı Şeması

```sql
-- Ana tarif tablosu
CREATE TABLE recipes (
  id            TEXT PRIMARY KEY,           -- 'r001' formatı, idempotent seed için
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  calories      INTEGER NOT NULL,
  prep_time     INTEGER NOT NULL,           -- dakika
  protein       REAL NOT NULL,              -- gram
  carbs         REAL NOT NULL,
  fat           REAL NOT NULL,
  thumbnail     TEXT NOT NULL,              -- hex renk veya ileride URL
  category      TEXT NOT NULL,              -- 'yemek' | 'icecek' (içecekler de eklenecek)
  popularity    INTEGER NOT NULL DEFAULT 0  -- öneri skorlamasında baz olarak kullanılacak
);

-- N:M ilişki — tags
CREATE TABLE recipe_tags (
  recipe_id  TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);
CREATE INDEX idx_recipe_tags_tag ON recipe_tags(tag);

-- 1:N — sıralı içindekiler
CREATE TABLE recipe_ingredients (
  recipe_id  TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL,
  text       TEXT NOT NULL,
  PRIMARY KEY (recipe_id, position)
);

-- 1:N — sıralı adımlar
CREATE TABLE recipe_steps (
  recipe_id  TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL,
  text       TEXT NOT NULL,
  PRIMARY KEY (recipe_id, position)
);

-- Full-text search (opsiyonel ama önerilen — kullanıcı arama UX'ini sonradan geliştirebiliriz)
CREATE VIRTUAL TABLE recipes_fts USING fts5(
  name, description, ingredients_text,
  content='', tokenize='unicode61'
);

-- Şema versiyonu (migration için)
CREATE TABLE schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT INTO schema_meta (key, value) VALUES ('version', '1');
```

### Seed Veri Üretimi

`data/seed/recipes-seed.json` — yapısı:

```json
[
  {
    "id": "r001",
    "name": "Mercimek Çorbası",
    "description": "Geleneksel Türk lezzeti, protein deposu.",
    "calories": 220,
    "prepTime": 25,
    "protein": 14,
    "carbs": 32,
    "fat": 4,
    "thumbnail": "#E8D5B7",
    "category": "yemek",
    "popularity": 85,
    "tags": ["vejetaryen", "düşük-kalori", "yüksek-protein"],
    "ingredients": ["1 su bardağı kırmızı mercimek", ...],
    "steps": ["Mercimekleri iyice yıkayıp süzün.", ...]
  },
  ...
]
```

**Backend ajanından beklenen kapsam:**

- En az **120 yemek tarifi** üret. Çeşitlilik kritik — Türk mutfağı, dünya mutfağı, kahvaltı, ana yemek, çorba, salata, tatlı, atıştırmalık.
- En az **30 içecek** üret (smoothie, çay/kahve karışımları, taze sıkma sular, vegan süt tarifleri vs.) — `category: 'icecek'`.
- **Toplam minimum: 150, hedef: 180-200.**
- Her tarif gerçekçi olsun: kalori = ~(protein\*4 + carbs\*4 + fat\*9) ±%15.
- `prepTime` makul aralıklarda (içecekler 3-10 dk, ana yemekler 20-60 dk).
- `popularity` 0-100 arası, dağılım dengeli olsun (çok az tarif 90+).
- Tag çeşitliliği: `vegan`, `vejetaryen`, `glutensiz`, `yüksek-protein`, `düşük-kalori`, `15-dk`, `tek-tencere`, `tatlı`, `kahvaltı`, `çorba`, `salata`, `atıştırmalık`, `omega-3`, `demir-kaynağı`, `kalsiyum`, `vb.` — Backend ajanı kendi makul setini oluşturur ama tag isimleri tutarlı olmalı (lowercase, tireli).

### `data/seed/build-db.js` Script'i

Node tarafında çalışır (app içinde değil), `better-sqlite3` kullanır, `recipes-seed.json`'u okur ve `data/recipes.db` üretir. `npm run build:db` script'i `package.json`'a eklensin:

```json
"scripts": {
  "build:db": "node data/seed/build-db.js"
}
```

Script şu adımları yapar:

1. Mevcut `data/recipes.db`'yi sil (idempotent).
2. Yeni DB aç, şemayı uygula (CREATE TABLE ...).
3. Transaction içinde her tarifi insert et (recipes + recipe_tags + recipe_ingredients + recipe_steps).
4. FTS5 tablosuna `INSERT INTO recipes_fts (rowid, name, description, ingredients_text) SELECT ...` ile veriyi doldur (`ingredients_text` = içindekilerin space ile join'i).
5. `VACUUM` ve `ANALYZE` çalıştır, dosyayı kapat.
6. Konsola tarif sayısı + dosya boyutu yazsın.

**Önemli:** Üretilen `data/recipes.db` git'e commit edilir (binary olsa da seed sürümü kontrol altında olsun). Geliştirici tarif eklemek istediğinde yalnızca `recipes-seed.json`'u düzenler ve `npm run build:db` çalıştırır.

### `metro.config.js` Asset Uzantısı

Metro varsayılan olarak `.db` dosyalarını asset olarak tanımıyor. `metro.config.js` güncellenecek:

```js
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("db");
module.exports = config;
```

### `services/db/database.ts` Davranışı

```
Görev: SQLiteDatabase nesnesini singleton olarak yönet.

Açılış akışı (uygulama ilk açıldığında veya store'lar ilk DB'ye eriştiğinde):
  1. expo-file-system ile SQLite dizininin yolu hesaplanır:
     `${FileSystem.documentDirectory}SQLite/recipes.db`
  2. Bu yolda dosya yoksa veya mevcut dosyanın embedded asset'ten daha eski bir
     "schema version"u varsa, asset'ten kopyala:
       - Asset.fromModule(require('../../data/recipes.db'))
       - downloadAsync() çağır
       - FileSystem.copyAsync ile hedef yola yaz
  3. expo-sqlite/next API ile DB aç:
       const db = await SQLite.openDatabaseAsync('recipes.db')
  4. PRAGMA foreign_keys = ON çalıştır
  5. Schema version kontrolü:
       - schema_meta tablosundan `version` oku
       - Asset'ten gelen versiyonla karşılaştır (sabit string)
       - Uyumsuzsa: kullanıcı verisini koru, ama tarif tablosunu drop edip asset'ten
         tekrar kopyalama yap. **İlk versiyonda migration gerekmiyor**, ama bu hook
         baştan hazır olsun.

Singleton pattern:
  - `let dbInstance: SQLiteDatabase | null = null;`
  - `export async function getDatabase(): Promise<SQLiteDatabase> { ... }`
  - İlk çağrıda init eder, sonrakilerde aynı instance'ı döner.
  - Race condition için bir promise cache'i tut (concurrent ilk çağrılar için).
```

### `services/db/recipeRepository.ts` API

DAO katmanı — tüm sorgu fonksiyonları burada. Diğer kod katmanları **doğrudan DB instance'ına erişmesin**, hep bu repository'den geçsin.

Sunulan public fonksiyonlar (hepsi `async`, Promise döner, `Recipe` tipini döner):

```typescript
getRecipeById(id: string): Promise
getRecipesByIds(ids: string[]): Promise     // ID sırasını korur
getAllRecipes(limit?: number, offset?: number): Promise
getPopularRecipes(limit: number): Promise   // popularity DESC
getRecipesByTag(tag: string, limit?: number): Promise
getRecipesByTags(tags: string[], matchAll?: boolean, limit?: number): Promise
                                                       // matchAll=true → tüm tag'leri içeren
                                                       // matchAll=false (default) → herhangi birini
getRecipesByCategory(category: 'yemek' | 'icecek', limit?: number): Promise
getQuickRecipes(maxPrepTime: number, limit?: number): Promise
searchRecipes(query: string, limit?: number): Promise  // FTS5 üzerinden
getRandomRecipes(limit: number): Promise    // ORDER BY RANDOM()
getRecipesExcluding(excludeIds: string[], limit: number): Promise
```

**Önemli mapping kuralı:** SQLite'tan dönen flat row'ları `Recipe` tipine map'lerken ingredients ve steps `recipe_ingredients`/`recipe_steps` tablolarından `position ASC` sırasıyla çekilip array'e dönüştürülür. N+1 query'den kaçınmak için **tek bir JOIN sorgusu** + JS tarafında group-by ile çöz, ya da küçük listelerde IN sorgusu kullan.

Tip:

```typescript
import { Recipe } from "../../types/recipe";
// Recipe tipi şu an types/recipe.ts'te tanımlı — DAO bunu döner.
// recipe.category alanını eklediğimiz için types/recipe.ts'te de category: 'yemek' | 'icecek' alanı olmalı.
```

### Etkilenen Dosyalar (Adım 19)

| Dosya                             | Eylem                                                                                                                                                   | Ajan    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `data/seed/recipes-seed.json`     | YENİ — 150+ tarif                                                                                                                                       | Backend |
| `data/seed/build-db.js`           | YENİ — Node build script                                                                                                                                | Backend |
| `data/recipes.db`                 | YENİ — script tarafından üretilir, commit edilir                                                                                                        | Backend |
| `services/db/database.ts`         | YENİ                                                                                                                                                    | Backend |
| `services/db/recipeRepository.ts` | YENİ                                                                                                                                                    | Backend |
| `metro.config.js`                 | `.db` asset uzantısı eklenir                                                                                                                            | Backend |
| `package.json`                    | `build:db` script                                                                                                                                       | Backend |
| `types/recipe.ts`                 | `protein`, `carbs`, `fat`, `category` alanları eklenir                                                                                                  | Backend |
| `data/mockRecipes.ts`             | Üst kısma `@deprecated` JSDoc bloku ekle, "Bu dosya artık kullanılmıyor, recipes.db kullanın" notu yaz. Silme — Adım 23 sonunda doğrulamayla silinecek. | Backend |

---

## 🎯 İSTEK 4 — Öneri Algoritması (Tarifler sekmesi)

### Mevcut Durum

`app/(tabs)/recipes.tsx` içindeki `widgetRecipes` useMemo'su şu an:

```typescript
{
  'Popüler': mockRecipes,
  'Favoriler': mockRecipes.filter((r) => favorites.includes(r.id)),
  'Sana Özel': mockRecipes.slice(0, 5),
  'Hızlı Tarifler': mockRecipes.filter((r) => r.prepTime <= 20),
}
```

**Popüler** ve **Sana Özel** kullanıcıdan bağımsız sabit listeler — bu değişecek.

### Yeni Davranış

**Popüler widget'ı:** `recipeRepository.getPopularRecipes(20)` ile veritabanından `popularity DESC` sıralı 20 tarif. **+ küçük bir rastgelelik:** sonuçların son %30'u random shuffle edilir ki her açılışta tıpatıp aynı sırayla gelmesin.

**Sana Özel widget'ı:** Kullanıcının geçmişteki sinyallerinden türetilen kişiselleştirilmiş öneri. Aşağıdaki algoritmaya göre çalışır.

### Kullanıcı Sinyalleri (Yeni Store + DB Tablosu)

Algoritma şu sinyalleri kullanır:

```
1. AI chat sorguları — kullanıcının RecipeSearchBox'a yazdığı son N (örn. 30) input
2. Kalori analiz sonuçları — kullanıcının fotoğraflayıp analiz ettirdiği yemek adları
3. Favoriler — favoritesStore'daki recipe id'leri
4. Tıklanan tarifler — kullanıcının detayını açtığı tarif id'leri (tıklama frekansı)
5. Aktif filtreler — filterStore'dan o anki seçili tag'ler
```

**Saklama:**

- 1 ve 2 sinyali → SQLite `user_signals` tablosu (free-text)
- 4 sinyali → SQLite `recipe_interactions` tablosu (recipe_id, count, last_seen_at)
- 3 ve 5 sinyali → mevcut Zustand store'lar (zaten persist)

```sql
CREATE TABLE user_signals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  kind        TEXT NOT NULL,            -- 'ai_query' | 'photo_food_name'
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL          -- unix ms
);
CREATE INDEX idx_user_signals_created ON user_signals(created_at DESC);

CREATE TABLE recipe_interactions (
  recipe_id     TEXT PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  open_count    INTEGER NOT NULL DEFAULT 0,
  last_opened   INTEGER NOT NULL          -- unix ms
);
```

**Bu tablolar `recipes.db` içinde değil**, ayrı bir kullanıcı veritabanında tutulur: `userdata.db`. Sebep: `recipes.db` her uygulama güncellemesinde asset'ten yeniden kopyalanabilir (versiyon farklılığında), kullanıcı verisi de korunmuş olur. Hem `database.ts` her iki DB'yi de açabilir.

`services/db/userSignalsRepository.ts` yeni dosya:

```typescript
recordAiQuery(text: string): Promise
recordPhotoFoodName(name: string): Promise
recordRecipeOpen(recipeId: string): Promise
getRecentAiQueries(limit: number): Promise
getRecentPhotoFoodNames(limit: number): Promise
getTopOpenedRecipes(limit: number): Promise<Array>
```

### Algoritma — `services/recommendation/personalRecommender.ts` (YENİ)

```
Görev: Kullanıcının geçmiş sinyallerinden 8-10 tarif önerisi üret.

Public API:
  async function getPersonalRecommendations(limit: number = 8): Promise<Recipe[]>

Adımlar:
  1. SIGNAL TOPLAMA
     - signals = getRecentAiQueries(30) + getRecentPhotoFoodNames(20)
     - favoriteIds = useFavoritesStore.getState().favorites
     - openedRecipes = getTopOpenedRecipes(15)
     - activeFilters = useFilterStore.getState().selectedFilters

  2. ANAHTAR KELİME EKSTRAKSİYONU
     - Tüm AI chat input'larından ve fotoğraf yemek adlarından
       kelimeleri al, lowercase'e indir, 3 karakterden kısa olanları + stopword'leri at
     - Türkçe stopword listesi: ['ile', 'için', 'bir', 'bu', 'şu', 've', 'da', 'de',
       'mi', 'mı', 'ne', 'nasıl', 'gibi'] (kısa bir liste, backend'de sabit)
     - Sonuç: keywordFreq: Map<string, number> (frekans)

  3. ADAY TARİF KÜMESİ
     - Aday = SQLite'tan en fazla 60 tarif, şu kaynaklardan birleşik:
       a) favorilerin tag'lerine sahip tarifler (favorite tags exploded, getRecipesByTags)
       b) sık açılan tariflerle aynı tag'i paylaşanlar
       c) AI keyword'leriyle ad/içindekiler eşleşen tarifler (FTS5 searchRecipes ile her keyword için)
       d) activeFilters tag'leriyle eşleşenler
     - Bu kümeden, kullanıcının zaten son 7 günde 3+ kez gördüğü tarifleri çıkar
       (recipe_interactions üzerinden).

  4. SKORLAMA — Her aday tarif için:
       score = 0
       + 3.0 × (tarifin tag'lerinden kaçı kullanıcının "ilgi tag'i"yle eşleşir)
              ilgi tag'i = favorilerin tag'lerinde geçen tag'ler + filterStore aktifler
       + 2.0 × (tarifin ad/açıklamasında kaç AI keyword'ü geçer, max 3 sayılır)
       + 1.5 × log(1 + openCount(tarif))    // kullanıcının önceden açtıklarına bias
       + 0.01 × popularity                  // genel popülerlik tie-breaker
       + uniformRandom(0, 1.5)              // çeşitlilik için gürültü
       - 5.0 × isFavorite(tarif) ? 1 : 0    // favori olanları öne çıkarmak değil,
                                              farklı seçenek sunmak istiyoruz; favoriler
                                              zaten "Favoriler" widget'ında

  5. SIRALAMA + ÇEŞİTLİLİK
     - Skor DESC ile sırala
     - Ardışık olarak aynı kategoriden (yemek/içecek) maksimum 3 art arda — 4'üncüde alt skorlu
       farklı kategori sıraya alınır. Basit "MMR-lite" gibi düşün.
     - İlk `limit` sonucu döndür.

  6. SIGNAL'LARDAN YETERLİ VERİ YOKSA (cold start)
     - Eğer keywordFreq.size < 3 ve favoriteIds.length < 2:
         → `getRandomRecipes(limit)` döndür, ama popularity DESC ile ağırlıklı
           rastgelelik (popüler tarifleri biraz daha sık göster).

Determinizm:
  - Bu algoritma her çağrıda farklı sonuç dönmeli — uniformRandom + günlük seed kullanma.
  - Yeniden çağrıda gerçek rastgelelik OK, kullanıcı her widget açılışında biraz farklı görsün.

Performans:
  - SQLite sorguları paralel (Promise.all).
  - Aday kümesi 60'tan fazla olmasın; skor hesaplama O(N) ve N küçük.
  - Tüm fonksiyon hedef ~150ms altında bitsin (test edilecek).

Output:
  - Recipe[] dizisi, hazır UI'ya verilebilir.
```

### Entegrasyon Noktaları (Signal Recording)

- `components/home/RecipeSearchBox.tsx` → `handleSearch` içinde başarılı sorgu sonrası `userSignalsRepository.recordAiQuery(input)` çağrısı.
- `store/calorieStore.ts` → `analyzeImage` içinde sonuç döndükten sonra `recordPhotoFoodName(result.foodName)`.
- Detay ekranı (Adım 21) açılınca → `recordRecipeOpen(recipeId)`.
- Long-press peek (Adım 22) açılınca → **kaydetme**. Peek hafif bir etkileşim, "tam görüntülemedi" sayalım, sinyal kirliliği yapmasın.

### Etkilenen Dosyalar (Adım 20)

| Dosya                                            | Eylem                                                                                                                                     | Ajan    |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `services/db/database.ts`                        | `userdata.db` ikinci DB'yi yönet, açılışta user_signals + recipe_interactions tablolarını idempotent oluştur (CREATE TABLE IF NOT EXISTS) | Backend |
| `services/db/userSignalsRepository.ts`           | YENİ                                                                                                                                      | Backend |
| `services/recommendation/personalRecommender.ts` | YENİ                                                                                                                                      | Backend |
| `services/recommendation/keywords.ts`            | YENİ — stopword listesi + extractKeywords fonksiyonu                                                                                      | Backend |

---

şimdi burada anlatılanları yapmanı istiyorum kalan aşamalar ayrı bir promptta detaylıca verilecek.
