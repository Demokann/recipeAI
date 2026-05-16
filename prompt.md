# 🛠️ Yeni Özellik İsteği — RecipeAI

@PROJECT_CONTEXT.md @PROJECT_SPEC.md @CODEBASE.md @agents/planning.md @agents/backend.md @agents/frontend.md @agents/review.md

---

## 📋 Genel Bağlam

`PROJECT_CONTEXT.md` dosyasında 15 adımın tamamı bitmiş görünüyor, ancak uygulamanın gerçek kullanım testinde **iki kritik UX/işlevsel sorun** ortaya çıktı. Bu sorunlar, yeni bir mini-sprint olarak Adım 16 (Backend & Tipler), Adım 17 (Frontend — Home AI önerileri detay akışı) ve Adım 18 (Frontend — Favoriler düzeltmesi) olarak işlenecek.

Bu sprint, projedeki **4 ajanın eş zamanlı / koordineli** çalıştığı bir döngüdür:

```
Planning Agent  → görev briefini hazırlar, sıralamayı belirler, PROJECT_CONTEXT.md'yi günceller
Backend Agent   → Recipe tipini ve mock veriyi günceller, store'a "selected recipe" eklersek state'i kurar
Frontend Agent  → İki ekrandaki bileşenleri (RecipeSearchBox, FavoriteButton, RecipeListItem,
                  ExpandedOverlay, recipes.tsx) günceller
Review Agent    → CP-6 (Adım 17 sonrası) ve CP-7 (Adım 18 sonrası) checkpoint'lerinde denetler
```

**Eş zamanlı çalışma kuralı:** Planning ajan, Adım 16'yı (tipler + mock veri + store genişletmesi) Backend'e atadıktan sonra, frontend ajan Adım 18'in (Favoriler düzeltmesi — store şeması zaten mevcut olduğu için backend'e bağımlı değil) iskeletini paralel olarak yapabilir. Adım 17 (Home → detay akışı), Adım 16 tamamlanmadan başlayamaz, çünkü Recipe tipinin `ingredients: string[]` ve `steps: string[]` alanlarına ihtiyaç duyar.

---

## 🎯 İSTEK 1 — Home sekmesi: AI yemek önerisi sonuçları tıklanabilir + detay subview

### Mevcut Durum
`components/home/RecipeSearchBox.tsx` (satır 74-87): AI çağrısından gelen `result.recipes` dizisi düz `<Text>` olarak listeleniyor:

```tsx
{result.recipes.map((recipe, index) => (
  <Text key={recipe.id} style={styles.resultText}>
    {index + 1}. {recipe.name}
  </Text>
))}
```

Bu satırlar tıklanamıyor. Kullanıcı tarifin içindekilerini veya yapılışını göremiyor.

### İstenen Davranış
1. AI'dan gelen her tarif önerisi satırı **tıklanabilir** olacak.
2. Bir tarife dokunulduğunda, `Recipes` ekranındaki gibi **glassmorphism subview (overlay panel)** açılacak — **`ExpandedOverlay` ile aynı görsel dil**: krem-bej arka plan, blur, swipe-down ile kapatma, X butonu.
3. Bu overlay tarifin **içindekiler listesi** ve **adım adım yapılışını** gösterecek.
4. Overlay, **Home** sekmesinden açıldığında bile aynı bileşeni kullanabilmesi için `ExpandedOverlay` ya genelleştirilecek ya da yeni bir kardeş bileşen `RecipeDetailOverlay` türetilecek (öneri: ikinci yol — `ExpandedOverlay` liste için, `RecipeDetailOverlay` tek tarif detayı için).

### Etkilenen Dosyalar
| Dosya | Değişiklik | Ajan |
|---|---|---|
| `types/recipe.ts` | `Recipe` interface'ine `ingredients: string[]` (zorunlu yap), `steps: string[]` (yeni alan) ekle. `description` zaten var. | Backend |
| `data/mockRecipes.ts` | 8 tarifin tamamına `ingredients` (4-8 madde) ve `steps` (3-6 adım) ekle. Türkçe yaz. | Backend |
| `services/geminiService.ts` (`suggestRecipes`) | Gemini prompt'unu güncelle: dönen JSON'da artık `ingredients: string[]` ve `steps: string[]` alanları beklensin. Parse adımında map'le, eksikse boş array fallback ver. | Backend |
| `components/recipes/RecipeDetailOverlay.tsx` *(YENİ)* | `ExpandedOverlay`'in glassmorphism altyapısını yeniden kullanarak (kopyala-uyarla; refactor sırasında ortak parçaları `components/recipes/GlassOverlayShell.tsx` adında ortak bir shell'e çıkarabilirsin — opsiyonel ama tercih edilen) tek tarif gösteren overlay. İçerik: thumbnail rengi şeridi + tarif adı + kalori/süre etiketi + "İçindekiler" başlığı + madde listesi + "Yapılışı" başlığı + numaralı adım listesi. ScrollView içinde olmalı. | Frontend |
| `components/home/RecipeSearchBox.tsx` | `result.recipes.map` çıktısını düz `<Text>` yerine `AnimatedPressable` ile sarılı satırlara çevir. `selectedRecipe` lokal state'i tut. Tıklanınca `RecipeDetailOverlay` (visible prop ile) açılsın. | Frontend |

### Tasarım Detayları (`RecipeDetailOverlay`)
```
Yapı (ExpandedOverlay glass shell ile aynı):
  Modal transparent
  └── Animated backdrop (rgba(0,0,0,0.40), opacity withTiming 300ms)
      └── Pressable absoluteFill → handleClose
  └── PanGestureHandler (swipe down ile kapatma — velocityY>500 || translationY>100)
      └── Animated cardContainer (translateY 60→0 withSpring SPRING_CONFIG, opacity 0→1, 50ms delay)
          └── GlassContainer
              ├── Handle bar (40×4, radius.pill, textMuted opacity 0.3)
              ├── Header row:
              │     ├── Sol: tarif thumbnail rengi (renkli 40×40 yuvarlak)
              │     ├── Orta: tarif adı (typography.heading2, displayFont) + alt satırda
              │     │        süre + kalori (caption, textMuted) — örn: "20 dk · 380 kcal"
              │     └── Sağ: X close butonu
              ├── Divider
              ├── ScrollView (stagger animasyonu):
              │     ├── Bölüm 1 — "İçindekiler"
              │     │     başlık: typography.subheading, bodyFontBold, accent
              │     │     liste: her madde bir Row → 6px renkli dot (accent) + metin
              │     │     stagger: her madde +50ms, t=150ms'den başlar (mevcut StaggeredItem ile uyumlu)
              │     ├── Boşluk: spacing.xl
              │     └── Bölüm 2 — "Yapılışı"
              │           başlık: aynı stil
              │           liste: numaralandırılmış adımlar
              │             "1." rakamı accent renkli, bodyFontBold
              │             metin: typography.body, textPrimary, lineHeight 1.5
              │             stagger: içindekiler bittikten sonra devam eder
              └── (alt boşluk: spacing.xxl)

accessibilityViewIsModal={true}
accessibilityLabel: "{recipe.name} detayları"
SPRING_CONFIG: mevcut { mass: 0.7, damping: 18, stiffness: 180 } — KESINLIKLE değiştirilmeyecek
```

### `RecipeSearchBox` İçindeki Liste Satır Stili
```
Mevcut <Text> → AnimatedPressable wrap:
  Row layout: 8px renkli dot (recipe.thumbnail rengi) + metin (recipe.name)
  scaleValue: 0.96 (mevcut AnimatedPressable default'u)
  accessibilityLabel: `${recipe.name} tarifinin detayını aç`
  accessibilityRole: "button"
  Üzerine basıldığında setSelectedRecipe(recipe) çağrılır.
  Açıklayıcı küçük chevron-right ikonu sağda (Feather, size:16, textMuted) opsiyonel.

resultContainer içinde "Önerilen Tarifler ✨" başlığı kalsın.
```

---

## 🎯 İSTEK 2 — Tarifler sekmesi: Favoriler default boş + kalp ikonu düzeltmesi

### Mevcut Durum — Sorun Tespit
**Sorun A — Favoriler içeriği:** `components/recipes/ExpandedOverlay.tsx` satır 99'da:
```tsx
const displayRecipes = recipes ?? mockRecipes;
```
Hangi widget açılırsa açılsın (Popüler, Favoriler, Sana Özel, Hızlı Tarifler) — `recipes` prop'u `app/(tabs)/recipes.tsx`'ten **hiç geçilmiyor**, dolayısıyla `mockRecipes` (8 tarifin hepsi) gösteriliyor. Yani Favoriler widget'ı açıldığında bile bütün tarifler görünüyor, kullanıcı favoriye eklemese de orada duruyor.

**Sorun B — Kalp ikonu "?" görünüyor:** Ekran görüntüsünde (`assets/1.jpeg`) RecipeListItem'ın sağındaki `FavoriteButton` ikonu **soru işareti** olarak render oluyor. `components/recipes/FavoriteButton.tsx` AntDesign `hearto`/`heart` kullanıyor; @expo/vector-icons font'u splash sırasında yüklenmemiş veya `useFonts` hook'una eklenmemiş olabilir. Bunu `app/_layout.tsx`'te düzelt.

**Sorun C — Kalp ikonu boyutu:** Kullanıcı raporu — kalp tam ekrana sığmıyor. Mevcut default `size=24`. **20'ye düşür**, `container.padding`'i `spacing.xs` (4) yap (şu an `8`), böylece daha kompakt olur.

### İstenen Davranış
1. **Favoriler widget'ı**: Açıldığında sadece `favoritesStore.favorites` içindeki id'leri içeren tarifler listelensin. Liste boşsa "Henüz favori tarifin yok" boş-durum mesajı gösterilsin.
2. **Diğer widget'lar** içerik ataması:
   - **Popüler** → `mockRecipes` (hepsi) — mevcut davranış korunur
   - **Sana Özel** → `mockRecipes.slice(0, 5)` — ilk 5
   - **Hızlı Tarifler** → `mockRecipes.filter(r => r.prepTime <= 20)` veya `tags.includes('15-dk')` — hızlı olanlar
3. **Kalp ikonu**:
   - Doğru ikon font'unu kullansın (AntDesign yerine garantili çalışan `Ionicons` "heart-outline" / "heart" — bu Expo'da daha güvenilir tetiklenir). Renk paleti aynı kalsın (`favoriteInactive` boş, `favoriteActive` dolu kırmızı).
   - Default size: 20 (24'ten 20'ye)
   - container padding: spacing.xs (4'e indir)
4. **Favoriler default boş**: AsyncStorage'da hiç değer yoksa `favorites: []` ile başlasın (zaten öyle, sadece test et).

### Etkilenen Dosyalar
| Dosya | Değişiklik | Ajan |
|---|---|---|
| `app/_layout.tsx` | `useFonts` çağrısına `@expo/vector-icons` font'larını ekle: `Ionicons.font` ve `AntDesign.font` import edilip `useFonts({ ...Ionicons.font, ...AntDesign.font, ...mevcut fontlar })` şeklinde verilsin. | Frontend |
| `components/recipes/FavoriteButton.tsx` | `AntDesign` → `Ionicons` ile değiştir (`heart-outline` / `heart`). `size` default'unu 24 → **20** yap. Container padding'i 8 → `spacing.xs` yap. Animasyon sekansı (spring 1→1.4→1, ~350ms) **aynı kalsın**. Cross-fade mantığı aynı. | Frontend |
| `app/(tabs)/recipes.tsx` | Her `WidgetCard`'a uygun `recipes` prop'u türet ve `handleExpand` callback'inde de geçir. `expandedWidget` state'ine `recipes: Recipe[]` alanı ekle. Favoriler için `useFavorites` hook'undan `favorites` id listesi + `mockRecipes.filter`. | Frontend |
| `components/recipes/WidgetCard.tsx` | `recipes?: Recipe[]` prop'u zaten interface'te tanımlı değil (sadece spec'te bahsedilmiş). Ekle ve `onExpand` callback'ine 2. parametre olarak ilet: `onExpand?: (layout, recipes) => void`. | Frontend |
| `components/recipes/ExpandedOverlay.tsx` | `displayRecipes = recipes ?? mockRecipes` satırını `displayRecipes = recipes ?? []` yap. Liste boşsa empty state: ortada küçük ikon (MaterialCommunityIcons `heart-off-outline`, accent rengi, opacity 0.4) + "Henüz favori tarifin yok" metni (typography.body, textMuted). Sadece title === "Favoriler" değil, genel olarak length===0 kontrolü ile. | Frontend |

### `recipes.tsx` Önerilen Yapı
```tsx
const { favorites } = useFavorites();

const widgetRecipes = useMemo(() => ({
  'Popüler': mockRecipes,
  'Favoriler': mockRecipes.filter(r => favorites.includes(r.id)),
  'Sana Özel': mockRecipes.slice(0, 5),
  'Hızlı Tarifler': mockRecipes.filter(r => r.prepTime <= 20),
}), [favorites]);

// expandedWidget state'inde de recipes tut:
const [expandedWidget, setExpandedWidget] = useState<{
  title: string;
  icon: ...;
  layout: LayoutRectangle;
  recipes: Recipe[];
} | null>(null);

const handleExpand = useCallback((title, icon, layout) => {
  setExpandedWidget({ title, icon, layout, recipes: widgetRecipes[title] ?? [] });
}, [widgetRecipes]);
```

---

## 🚦 Ajan Görev Atamaları (Planning Agent koordinasyonu)

### ADIM 16 — Backend: Recipe tipini + mock veriyi + geminiService'i genişlet
**Hedef Ajan:** `backend`
**Ön Koşul:** Adım 15 ✅
**Okuma:** `PROJECT_SPEC.md → TypeScript Tip Tanımları`, `prompt.md`, `data/mockRecipes.ts`, `services/geminiService.ts`
**Yazma İzni:**
  - `types/recipe.ts`
  - `data/mockRecipes.ts`
  - `services/geminiService.ts`
**Kısıtlar:**
  - `ingredients` ve `steps` her tarif için **dolu** olmalı (boş array kabul edilmez), Türkçe yaz.
  - 8 tarif × en az 5 içindekiler × en az 4 adım = minimum kapsam.
  - JSDoc yorumu ekle, `as const` koru.
  - `any` yasak, `unknown` + type guard tercih edilir.
**Token Tahmini:** ~6k
**Doğrulama:** `tsc --noEmit` 0 hata. Her 8 tarif için `ingredients.length >= 5` ve `steps.length >= 4`.
**Review Gerekli mi?** Hayır — Adım 16 backend, ardından doğrudan Adım 17 frontend başlar.

### ADIM 17 — Frontend: Home AI önerileri detay akışı + RecipeDetailOverlay
**Hedef Ajan:** `frontend`
**Ön Koşul:** Adım 16 ✅
**Okuma:** `prompt.md`, `components/recipes/ExpandedOverlay.tsx` (referans olarak), `components/home/RecipeSearchBox.tsx`
**Yazma İzni:**
  - `components/recipes/RecipeDetailOverlay.tsx` *(YENİ)*
  - `components/home/RecipeSearchBox.tsx`
**Kısıtlar:**
  - Glass shell görselini ExpandedOverlay ile bire bir tut (krem-bej tonu, border radius 28, shadows.glass).
  - SPRING_CONFIG ve stagger değerleri spec'e sadık.
  - Tüm Pressable'larda accessibilityLabel + role.
  - Inline style yasak, constants kullan.
  - `React.memo` + `displayName` + `useCallback` zorunlu.
  - **Önemli:** `RecipeDetailOverlay` da `react-native-gesture-handler` PanGestureHandler ve `Modal` kullanmalı (ExpandedOverlay ile aynı kapatma davranışı).
**Token Tahmini:** ~12k
**Doğrulama:**
  - Home → AI search yap → öneri satırına bas → overlay açılır → içindekiler ve adımlar görünür → X veya swipe-down ile kapanır.
  - Boş state: AI sonucu yoksa overlay açılmaz.
**Review Gerekli mi?** **EVET — CP-6 (Adım 17 sonrası)**

### ADIM 18 — Frontend: Favoriler düzeltmesi + kalp ikonu fix
**Hedef Ajan:** `frontend`
**Ön Koşul:** Adım 17 ✅ (sıralı; aynı dosya tipi düzenleniyor, çakışmayı önlemek için)
**Okuma:** `prompt.md`, `assets/1.jpeg` (kalp "?" sorunu için referans), `components/recipes/FavoriteButton.tsx`, `app/(tabs)/recipes.tsx`, `components/recipes/ExpandedOverlay.tsx`, `app/_layout.tsx`
**Yazma İzni:**
  - `app/_layout.tsx`
  - `components/recipes/FavoriteButton.tsx`
  - `components/recipes/WidgetCard.tsx`
  - `app/(tabs)/recipes.tsx`
  - `components/recipes/ExpandedOverlay.tsx`
**Kısıtlar:**
  - `useFavorites` hook'unu doğrudan kullan; `useFavoritesStore`'u component'tan import etme.
  - Empty state UI'sını ExpandedOverlay içinde koşullu render et — yeni dosya açma.
  - Font yükleme değişikliğinde mevcut PlayfairDisplay ve DMSans fontlarını **koru**.
  - FavoriteButton animasyon timing'i spec'e (1→1.4→1, ~350ms) sadık kalmalı.
**Token Tahmini:** ~10k
**Doğrulama:**
  - Uygulama açılır, Favoriler boş (henüz hiçbir tarif favorilenmedi).
  - Popüler aç → kalp ikonları doğru görünür (soru işareti yok), boyut küçülmüş.
  - Bir tarifin kalbine bas → kırmızıya döner, haptic feedback gelir.
  - Tarifler'e dön, Favoriler aç → o tarif görünür.
  - Aynı tarifi tekrar kalpten çıkar → liste boşalır, "Henüz favori tarifin yok" mesajı gelir.
  - AsyncStorage persist çalışıyor: uygulama kapanıp açıldığında favoriler korunur.
**Review Gerekli mi?** **EVET — CP-7 (Adım 18 sonrası, FINAL)**

---

## 📊 Review Agent Checkpoint'leri

### CP-6 (Adım 17 sonrası)
İncelenecek:
- `RecipeDetailOverlay` SPRING_CONFIG = `{mass:0.7, damping:18, stiffness:180}` ✓
- Backdrop fade timing 300ms ✓
- İçerik translateY 60→0 + opacity 0→1, 50ms delay ✓
- Stagger 50ms per item, 150ms initial ✓
- PanGesture kapanma threshold: velocityY > 500 || translationY > 100 ✓
- accessibilityViewIsModal={true} ✓
- RecipeSearchBox'taki AnimatedPressable satırlarda Props interface var mı ✓
- Yeni overlay'de "Macros" / "Makrolar" string'i geçiyor mu → YASAK ✓
- displayName tüm React.memo bileşenlerinde ✓
- Inline style yok ✓

### CP-7 (Adım 18 sonrası, FINAL)
İncelenecek:
- Ionicons font yükleniyor mu (`useFonts({ ...Ionicons.font })`) ✓
- FavoriteButton size default 20 ✓
- FavoriteButton container padding spacing.xs ✓
- recipes.tsx'te useMemo ile widgetRecipes hesaplanıyor mu (favorites değişince yeniden) ✓
- ExpandedOverlay empty state metni: typography.body, colors.textMuted ✓
- Empty state ikonu MaterialCommunityIcons `heart-off-outline` ✓
- WidgetCard'taki yeni `recipes` prop'u Props interface'inde tanımlı ✓
- `recipes` prop'u opsiyonel ve type-safe ✓
- Favoriler için useFavorites hook üzerinden erişim (store import YOK) ✓

---

## 🔁 PROJECT_CONTEXT.md Güncelleme Talimatı

Planning agent her adım bitiminde `PROJECT_CONTEXT.md` dosyasını güncelleyecek:

1. `Toplam Adım: 15 → 18` yap
2. `Tamamlanan` sayısını artır
3. `Son Güncelleme` tarihini bugünkü tarihe çek
4. `✅ Tamamlanan Adımlar` bölümüne 3 yeni adım ekle (tarih, oluşturulan/değiştirilen dosyalar, kısa notlar)
5. `📁 Mevcut Dosya Ağacı` bölümüne `components/recipes/RecipeDetailOverlay.tsx` ekle (YENİ işaretiyle)
6. `🐛 Bilinen Sorunlar` bölümünden — bu sprint çözülen sorunları belge olarak işle (kalp ikonu soru işareti sorunu fix edildi notu)

---

## ✅ Sprint Tamamlama Kriteri

- [ ] AI öneri satırı tıklanır, glass detay overlay açılır, içindekiler + adımlar görünür
- [ ] Favoriler widget'ı boşken empty state mesajı çıkar
- [ ] Kalp ikonu soru işareti yerine ikon olarak görünür ve eskisinden küçüktür
- [ ] Diğer widget'larda doğru tarif listeleri görünür (Popüler/Sana Özel/Hızlı)
- [ ] CP-6 GEÇER kararı
- [ ] CP-7 GEÇER kararı
- [ ] `tsc --noEmit` 0 hata
- [ ] `npx expo start --no-dev` derleme hatasız
- [ ] `PROJECT_CONTEXT.md` güncellenmiş, 18/18 tamamlandı
 