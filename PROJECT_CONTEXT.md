# 📋 PROJECT_CONTEXT.md

# Yemek Tarifi & Kalori Takip Uygulaması — Oturum Takip Logu

> **Geliştirici Notu:**
> Her oturumun BAŞINDA bu dosyayı oku.
> Her oturumun SONUNDA tamamlanan adımları buraya yaz.
> Detaylar için: `@PROJECT_SPEC.md`

---

## 🔢 Genel İlerleme

```
Toplam Adım : 27
Tamamlanan  : 23
Kalan       : 4  (aktif sprint)
Son Güncelleme: 17.05.2026
```

---

## ✅ Tamamlanan Adımlar

### Adım 1 — Proje iskeleti + klasör yapısı + constants

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - constants/colors.ts
  - constants/spacing.ts
  - constants/typography.ts
  - constants/shadows.ts
- Notlar: Temel renk, tipografi, spacing ve gölge sabitleri PROJECT_SPEC.md'ye uygun olarak oluşturuldu.

### Adım 2 — TypeScript tip tanımları (types/)

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - types/common.ts
  - types/recipe.ts
  - types/calorie.ts
- Notlar: Uygulama genelinde kullanılacak veri yapıları ve servis tipleri tanımlandı.

### Adım 3 — Mock servisler ve mock veri

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - utils/delay.ts
  - data/mockRecipes.ts
  - services/mockLLMService.ts
  - services/mockCameraService.ts
  - services/mockCalorieService.ts
- Notlar: Uygulamanın veri ve servis katmanı mock olarak hazırlandı. İleride gerçek servislerle değiştirilmek üzere tasarlandı.

### Adım 4 — Zustand store'ları

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - store/favoritesStore.ts
  - store/calorieStore.ts
- Notlar: Favori yönetimi ve kalori analizi için state yönetim katmanı Zustand ile kuruldu.

### Adım 5 — Shared components (AnimatedPressable, GlassContainer)

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/shared/AnimatedPressable.tsx
  - components/shared/GlassContainer.tsx
- Notlar: Uygulama genelinde kullanılacak temel UI bileşenleri Reanimated ve expo-blur ile oluşturuldu.

### Adım 6 — Custom Bottom Tab Navigator

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/navigation/CustomBottomTab.tsx
  - app/(tabs)/\_layout.tsx
- Notlar: Yüzen, Glassmorphism etkili ve animasyonlu alt navigasyon barı kuruldu.

### Adım 7 — Recipes ekranı — WidgetCard (animasyonsuz)

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/recipes/WidgetCard.tsx
  - app/(tabs)/recipes.tsx
- Notlar: Recipes ana ekranı ve temel widget kartı yapısı oluşturuldu.

### Adım 8 — ExpandedOverlay animasyonu

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/recipes/ExpandedOverlay.tsx
- Notlar: Widget genişleme animasyonu Reanimated, Modal ve PanGestureHandler ile kuruldu.

### Adım 9 — RecipeListItem + FavoriteButton

- Tarih: 01.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/recipes/RecipeListItem.tsx
  - components/recipes/FavoriteButton.tsx
  - hooks/useFavorites.ts
- Notlar: Tarif liste öğeleri ve animasyonlu favori butonu sisteme entegre edildi.

### Adım 10 — Home ekranı — FilterChip + RecipeSearchBox

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/home/FilterChip.tsx
  - components/home/FilterChipRow.tsx
  - components/home/RecipeSearchBox.tsx
  - app/(tabs)/index.tsx
- Notlar: Ana sayfa iskeleti, çoklu seçim destekli filtreler ve LLM entegrasyonlu arama kutusu tamamlandı.

### Adım 11 — CameraCapture + LoadingAnalysis

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/home/CameraCapture.tsx
  - components/home/LoadingAnalysis.tsx
- Notlar: Kamera akışı ve animasyonlu analiz yükleme ekranı sisteme dahil edildi.

### Adım 12 — CalorieResult ekranı (3 alt component)

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - components/calorie/TotalCaloriesHeader.tsx
  - components/calorie/CalorieBreakdownList.tsx
  - components/calorie/NutrientCard.tsx
  - components/home/CalorieResultCard.tsx
- Notlar: countUp (TextInput animated), progress bar stagger (150ms×n), NutrientCard pop spring. index.tsx güncellendi.

### Adım 13 — Settings placeholder

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan dosyalar:
  - app/(tabs)/settings.tsx
- Notlar: Minimal placeholder; ileriki versiyonda profil/dil/bildirim ayarları gelecek.

### Adım 14 — Animasyonların ince ayarı

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar:
  - components/recipes/ExpandedOverlay.tsx — yeniden yazıldı: backdrop 300ms, content translateY 60→0 withSpring(50ms delay), list stagger +50ms
  - components/recipes/FavoriteButton.tsx — iki katman cross-fade ile renk animasyonu
  - app/(tabs)/recipes.tsx — duplicate styles kaldırıldı
- Notlar: Spec animasyon sekansı (t=0/50/150ms) tam uygulandı.

### Adım 15 — Accessibility eklemeleri

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar: Tüm ekran ve bileşenlere accessibilityLabel, accessibilityRole, accessibilityState eklendi.
- Notlar: Tüm etkileşimli öğeler screen reader uyumlu hale getirildi.

---

### Adım 16 — Gemini AI gerçek entegrasyonu + kamera servisi

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan / değiştirilen dosyalar:
  - `services/geminiService.ts` ← **YENİ** — Gemini 2.5 Flash API istemcisi
  - `services/cameraService.ts` ← **YENİ** — expo-image-picker tabanlı gerçek kamera servisi (mockCameraService'in yerini aldı)
  - `store/calorieStore.ts` ← **GÜNCELLENDİ** — artık `analyzeImage()` içinde `analyzeFood()` çağırıyor
  - `store/favoritesStore.ts` ← **GÜNCELLENDİ** — Zustand `persist` middleware ile AsyncStorage'a kalıcı hale getirildi
  - `components/home/CameraCapture.tsx` ← **GÜNCELLENDİ** — gerçek `cameraService` ile değiştirildi
- Notlar:
  - `geminiService.ts` iki public fonksiyon sunar: `analyzeFood(base64)` ve `suggestRecipes(input, filters)`.
  - `analyzeFood`: fotoğrafı base64 olarak Gemini Vision'a gönderir, protein/carbs/fat/kalori döner.
  - `suggestRecipes`: kullanıcı girdisi + aktif filtreleri prompt'a yazar, 3 tarif JSON'u döner.
  - Her iki fonksiyon da API yanıtından JSON bloğu çıkarmak için `extractJson()` yardımcısını kullanır; markdown code fence durumları ele alınmıştır.
  - API anahtarı `.env` → `EXPO_PUBLIC_GEMINI_API_KEY` değişkeninden okunur.
  - `cameraService.captureFood()` → `expo-image-picker.launchCameraAsync()` ile gerçek kamera, base64 döner; `analyzeFood` bu base64'ü doğrudan tüketir.

### Adım 17 — Recipe tip genişletmesi + mock veri zenginleştirmesi

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar:
  - `types/recipe.ts` ← `protein: number`, `carbs: number`, `fat: number` alanları eklendi
  - `data/mockRecipes.ts` ← tüm 8 tarife `protein`, `carbs`, `fat`, `ingredients[]`, `steps[]` dizileri eklendi
- Notlar:
  - Makro veriler AI öneri akışının hem çıkış şemasıyla hem de ileride bağlanacak SQLite şemasıyla uyumlu olacak şekilde tasarlandı.
  - Her tarif artık tam adım ve içindekiler listesi içeriyor; bu sayede `RecipeDetailOverlay` mock verilerle de tam işlevsel.

### Adım 18 — RecipeDetailOverlay + FilterStore

- Tarih: 09.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan / değiştirilen dosyalar:
  - `components/recipes/RecipeDetailOverlay.tsx` ← **YENİ**
  - `store/filterStore.ts` ← **YENİ**
  - `components/home/RecipeSearchBox.tsx` ← **GÜNCELLENDİ** — `suggestRecipes()` entegre edildi, sonuç listesi `RecipeDetailOverlay` ile bağlandı
- Notlar:
  - `RecipeDetailOverlay`: glassmorphism kart (rgba 0.78 + BlurView), üst tutma barı, PanGestureHandler swipe-to-close (velocityY > 500 || translationY > 100), başlık satırında tarif adı + makrolar (P/K/Y gram + kcal + hazırlık süresi), `StaggeredItem` ile içindekiler ve adımlar animasyonlu listeleme.
  - `filterStore.ts`: `selectedFilters: string[]`, `toggleFilter`, `clearFilters` — `RecipeSearchBox` bu store'dan filtreleri okur ve Gemini prompt'una yazar.
  - `RecipeSearchBox`: gerçek `suggestRecipes(input, selectedFilters)` çağrısı; sonuç listesinde her tarife tıklandığında `RecipeDetailOverlay` açılır; hata durumu ayrı hata kartı ile gösterilir.

### Adım 19 — Ana sayfa AI öneri UI iyileştirmesi (makro gösterimi)

- Tarih: 16.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar:
  - `components/home/RecipeSearchBox.tsx`
  - `components/recipes/RecipeDetailOverlay.tsx`
- Notlar:
  - AI öneri listesinden bir tarife tıklandığında açılan detail overlay artık `prepTime`, `calories`, `protein`, `carbs`, `fat` değerlerini meta satırında tam olarak gösteriyor.
  - Öneri listesi renk dot + tarif adı + chevron row düzenine kavuştu; UI okunabilirliği ve hiyerarşisi güçlendirildi.
  - `FadeInUp.springify()` ve `Layout.springify()` ile sonuç kartı ve hata kartı yumuşak geçişle ekrana giriyor.

### Adım 20 — SQLite veritabanı altyapısı hazırlığı

- Tarih: 16.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan / değiştirilen dosyalar:
  - `types/recipe.ts` ← `category?: 'yemek' | 'icecek'` alanı eklendi (isteğe bağlı — mevcut mock veriler etkilenmez)
  - `metro.config.js` ← `config.resolver.assetExts.push('db')` eklendi; Metro artık `.db` dosyalarını binary asset olarak paketler
  - `package.json` ← `"build:db": "node data/seed/build-db.js"` script'i eklendi
  - `data/mockRecipes.ts` ← `@deprecated` JSDoc marker eklendi
  - `data/recipes.db` ← **YENİ** — geçici boş SQLite placeholder (8 KB geçerli SQLite dosyası; Metro bundling için gerekli)
  - `services/db/database.ts` ← **YENİ** — singleton DB yöneticisi
  - `services/db/recipeRepository.ts` ← **YENİ** — tam DAO katmanı
- Notlar:
  - **Mevcut uygulama davranışı değişmemiştir.** Tüm bileşenler mock verilerle çalışmaya devam etmektedir.
  - `database.ts`: expo-file-system/legacy + expo-asset kullanılarak asset'ten SQLite dizinine kopyalama akışı; `schema_meta` tablosu üzerinden DB doğrulaması; veritabanı mevcut/geçerli değilse `null` döner (graceful fallback).
  - `recipeRepository.ts`: `getRecipeById`, `getRecipesByIds`, `getAllRecipes`, `getPopularRecipes`, `getRecipesByTag`, `getRecipesByTags`, `getRecipesByCategory`, `getQuickRecipes`, `searchRecipes` (FTS5 → LIKE fallback), `getRandomRecipes`, `getRecipesExcluding` — toplam 11 public fonksiyon. DB `null` döndüğünde tüm fonksiyonlar otomatik olarak `mockRecipes`'e düşer.
  - Hydrasyon stratejisi: `recipes` tablosundan flat row'lar çekilir, ardından `recipe_tags` / `recipe_ingredients` / `recipe_steps` için 3 adet IN-sorgusu paralel çalıştırılır (N+1 yok); JS tarafında Map ile birleştirilir.
  - `searchRecipes`: önce FTS5 virtual table dener; tablo henüz doldurulmamışsa LIKE sorguya geçer.
  - `better-sqlite3` (devDependency olarak zaten kurulu) ve `expo-sqlite ~16.0.10` altyapısı hazır.
  - **Veritabanı bağlantısı için kalan iki adım:** (1) `data/recipes.db`'yi DataGrip export'u ile değiştir — `schema_meta` tablosuna `('version','1')` kaydının girilmesi zorunlu; (2) `app/(tabs)/recipes.tsx` içinde `mockRecipes` referansları `recipeRepository` fonksiyonlarıyla değiştirilir.

### Adım 21 — RecipeDetailOverlay makro etiket iyileştirmesi

- Tarih: 16.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar:
  - `components/recipes/RecipeDetailOverlay.tsx`
- Notlar:
  - Daha önce tek satırda `P {n}g · K {n}g · Y {n}g` olarak gösterilen makro bilgileri iki ayrı `Text` satırına bölündü.
  - Birinci satır: `{prepTime} dk · {calories} kcal` — hazırlık ve kalori bilgisi.
  - İkinci satır: `Protein {n}g · Karb. {n}g · Yağ {n}g` — okunabilir kısaltmalarla tek satırda üç makro. "Protein" tam yazılır (Türkçe'de aynı), "Karbonhidrat" → "Karb." (taşma riski nedeniyle), "Yağ" zaten kısadır.
  - `numberOfLines={1}` ile ikinci satırın her zaman tek satırda kalması güvence altına alındı.

### Adım 22 — Kamera / Galeri seçim alt sayfası

- Tarih: 16.05.2026
- Durum: ✅ Tamamlandı
- Değiştirilen dosyalar:
  - `services/cameraService.ts` ← `pickFromGallery()` fonksiyonu eklendi; paylaşılan picker seçenekleri ve base64 çıkarma mantığı ortak sabitlere taşındı
  - `components/home/CameraCapture.tsx` ← kamera butonuna doğrudan kamera açmak yerine animasyonlu seçenek alt sayfası eklendi
- Notlar:
  - **`cameraService.pickFromGallery()`**: `requestMediaLibraryPermissionsAsync` ile galeri izni alır, ardından `launchImageLibraryAsync` ile fotoğraf seçtirir. Seçim iptali "iptal" içeren bir hata fırlatır; bu hata UI'da sessizce yutulur (Alert gösterilmez).
  - **`CameraCapture` alt sayfası**: kamera butonuna basıldığında `Modal` içinde glassmorphism bottom sheet açılır. İki seçenek sunar:
    - _Fotoğraf çek_ (`camera-outline` ikon) — mevcut `captureFood()` akışı
    - _Galeriden yükle_ (`image-outline` ikon) — yeni `pickFromGallery()` akışı
  - Animasyon: backdrop `withTiming 250ms`, sheet `withSpring` ile yukarı kayar; kapanışta `Easing.in(quad) 220ms` ile aşağı iner, animasyon callback'inde `runOnJS(setSheetVisible)(false)` çağrılır.
  - Seçenek seçildikten sonra sheet kapanış animasyonu başlar; 350ms gecikmeyle sistem kamerası/galerisi açılır — bu gecikme modal'ın tam olarak unmount olmasını garanti eder.
  - Dışarıya tıklama ve Android geri tuşu sheet'i kapatır.
  - Stil: mevcut overlay bileşenleriyle tutarlı (`rgba(250,247,242,0.98)`, `borderTopLeftRadius: 32`, handle bar, accent renkli ikon kutuları, `chevron-right` yön oku).

### Adım 23 — Veritabanı bağlantısı

- Tarih: 17.05.2026
- Durum: ✅ Tamamlandı
- Oluşturulan / değiştirilen dosyalar:
  - `data/recipes.db` ← DataGrip export'u ile değiştirildi (64 KB, 8 tarif, FTS5 indeksi dahil)
  - `app/(tabs)/recipes.tsx` ← `mockRecipes` referansları `recipeRepository` fonksiyonlarıyla değiştirildi
- Notlar:
  - WAL checkpoint yapıldıktan sonra `recipesai_db/recipeai.db` → `data/recipes.db` olarak kopyalandı.
  - `schema_meta` tablosunda `('version','1')` kaydı doğrulandı — `database.ts` DB'yi geçerli kabul eder.
  - `useMemo` → `useEffect` + `useState` geçişi yapıldı (async repository çağrıları için).
  - Widget eşlemeleri: Popüler → `getPopularRecipes(20)`, Sana Özel → `getRandomRecipes(5)`, Hızlı Tarifler → `getQuickRecipes(20, prepTime≤20dk)`, Favoriler → `getRecipesByIds(favorites)` (favorites store'a reaktif).
  - `recipesai_db/` klasörü DataGrip proje dosyalarıyla birlikte proje kökünde bırakıldı (kaynak olarak korunuyor).

---

## 🔄 Devam Eden / Yarım Kalan

_Yok._

---

## ⏳ Sonraki Adımlar (Öncelik Sırasına Göre)

| #   | Adım                                    | Açıklama                                                                                              | Bağımlılık               |
| --- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------ |
| 24  | `userdata.db` + `userSignalsRepository` | `user_signals` ve `recipe_interactions` tabloları; kullanıcı etkileşim kayıt servisi                  | ✅ Adım 23 tamam          |
| 25  | Kişiselleştirme öneri motoru            | `services/recommendation/personalRecommender.ts` + `keywords.ts`; sinyal tabanlı skorlama algoritması | Adım 24                  |
| 26  | Recipes ekranı widget güncelleme        | "Sana Özel" → öneri motorundan (şimdilik random)                                                      | Adım 25                  |
| 27  | Settings ekranı (gerçek içerik)         | Profil, dil, bildirim ayarları                                                                        | —                        |

---

## 📁 Mevcut Dosya Ağacı

```
project-root/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── recipes.tsx
│       └── settings.tsx
├── components/
│   ├── calorie/
│   │   ├── CalorieBreakdownList.tsx
│   │   ├── NutrientCard.tsx
│   │   └── TotalCaloriesHeader.tsx
│   ├── home/
│   │   ├── CalorieResultCard.tsx
│   │   ├── CameraCapture.tsx
│   │   ├── FilterChip.tsx
│   │   ├── FilterChipRow.tsx
│   │   ├── LoadingAnalysis.tsx
│   │   └── RecipeSearchBox.tsx
│   ├── navigation/
│   │   └── CustomBottomTab.tsx
│   ├── recipes/
│   │   ├── ExpandedOverlay.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── RecipeDetailOverlay.tsx    ← YENİ (Adım 18)
│   │   ├── RecipeListItem.tsx
│   │   └── WidgetCard.tsx
│   └── shared/
│       ├── AnimatedPressable.tsx
│       └── GlassContainer.tsx
├── constants/
│   ├── colors.ts
│   ├── shadows.ts
│   ├── spacing.ts
│   └── typography.ts
├── data/
│   ├── mockRecipes.ts                 ← @deprecated (Adım 20)
│   └── recipes.db                    ← placeholder (Adım 20)
├── hooks/
│   └── useFavorites.ts
├── services/
│   ├── cameraService.ts              ← GÜNCELLENDİ (Adım 22 — pickFromGallery eklendi)
│   ├── db/
│   │   ├── database.ts               ← YENİ (Adım 20)
│   │   └── recipeRepository.ts       ← YENİ (Adım 20)
│   ├── geminiService.ts              ← YENİ (Adım 16)
│   ├── mockCalorieService.ts
│   ├── mockCameraService.ts
│   └── mockLLMService.ts
├── store/
│   ├── calorieStore.ts
│   ├── favoritesStore.ts
│   └── filterStore.ts                ← YENİ (Adım 18)
├── types/
│   ├── calorie.ts
│   ├── common.ts
│   └── recipe.ts
└── utils/
    └── delay.ts
```

---

## 🐛 Bilinen Sorunlar / Önemli Kararlar

- **`data/recipes.db` placeholder:** Şu anda sadece Metro bundling için gerekli olan boş bir SQLite dosyasıdır. Gerçek DB eklendikten sonra uygulamanın SQLite dizinindeki önbelleği temizlemek için simülatör/cihazda uygulama silinip yeniden kurulması gerekebilir.
- **`expo-file-system` API değişikliği:** SDK 54 (expo-file-system v55) ile `documentDirectory` gibi sabitler ana paketten kaldırıldı; `expo-file-system/legacy` alt yolundan içe aktarılıyor. `services/db/database.ts` buna göre güncellendi.
- **Mock servisler kaldırılmadı:** `mockLLMService.ts`, `mockCameraService.ts`, `mockCalorieService.ts` dosyaları hâlâ yerinde durmaktadır. Gerçek servisler aktif olduğu için kullanılmıyorlar; ileride temizlenebilir.

---

## 🔁 Sonraki Oturum İçin Bağlam

```
@PROJECT_CONTEXT.md dosyasını oku.
Adım 23 tamamlandı: recipes.db entegre edildi, recipes.tsx artık recipeRepository kullanıyor.
Sıradaki: Adım 24 — userdata.db + userSignalsRepository.
user_signals ve recipe_interactions tabloları oluşturulacak; kullanıcı etkileşimleri (favori, görüntüleme vb.) kaydedilecek.
```
