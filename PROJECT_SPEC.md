# 🍽️ Yemek Tarifi & Kalori Takip Uygulaması — Tam Proje Spesifikasyonu

> **Gemini CLI Prompt Notu:** Bu dosya, React Native + Expo projesi için eksiksiz bir geliştirme rehberidir. Kodları aşamalı olarak üret; önce proje iskeleti ve navigasyon, sonra ekran bazlı component'lar, en son animasyon ve servis katmanı. Her component'ı ayrı dosyaya yaz. Hiçbir adımı atlamadan, yorumlarla (inline comments) zenginleştirilmiş, production-ready kod üret.

---

## 📐 Tasarım Dili & Görsel Kimlik

### Renk Paleti
```
Background (Ana):      #F5F0E8  ← Encumber ekranından alınan sıcak krem/bej ton
Background (Kart):     #FFFFFF  ile %85 opacity arası
Accent (Vurgu):        Şimdilik placeholder — CSS variable olarak tanımla: --color-accent
Text Primary:          #1A1A1A  (koyu, neredeyse siyah)
Text Secondary:        #6B6B6B  (orta gri)
Text Muted:            #A0A0A0  (soluk gri)
Bottom Nav Background: rgba(255,255,255,0.85) + blur
Glass Card:            rgba(255,255,255,0.60) + backdrop blur 20px
```

### Tipografi
```
Display Font (Başlıklar):   "Playfair Display" veya "Lora" — serif, zarif, literary his
                             → Encumber ekranındaki kelime başlığının serif ağırlığını yansıt
Body Font (Gövde Metin):    "DM Sans" veya "Nunito" — yuvarlak, okunabilir, modern sans-serif
Phonetic/Label Font:        Monospace veya "Courier Prime" — IPA notasyonu ve etiketler için
Weight Kullanımı:
  - Ekran başlıkları:  700-800 (bold/extrabold)
  - Kart başlıkları:   600 (semibold)
  - Gövde:             400 (regular)
  - Etiket/caption:    300-400 (light/regular)
```

> **Gemini Notu:** Font yüklemesi için `expo-font` ve `@expo-google-fonts` kullan. `_layout.tsx` içinde `useFonts` hook'u ile yükle, splash screen font yüklenene kadar bekletilsin.

### Köşe Yarıçapları (Border Radius Sistemi)
```
--radius-sm:   8px   → chip/pill butonlar, küçük etiketler
--radius-md:  16px   → liste öğeleri, küçük kartlar
--radius-lg:  24px   → orta boy widget'lar
--radius-xl:  32px   → ana kart container'ları
--radius-pill: 999px → chip/pill filtre butonları, badge'ler
--radius-card-inner: 20px → widget içindeki iç kartlar
```

### Gölge & Derinlik Sistemi
```javascript
// shadows.ts — tüm gölgeler buradan import edilecek
export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 20,
  },
};
```

### Glassmorphism Efekti (Kritik Bileşen)
```
Recipes ekranındaki "genişleyen widget" overlay için:
- Arka plan: rgba(245, 240, 232, 0.75)  ← krem bej + şeffaflık
- Blur: expo-blur → BlurView intensity={80} tint="light"
- Border: 1px solid rgba(255,255,255,0.4)
- İçerik kart: rgba(255,255,255,0.65) + blur
```

---

## 🗂️ Proje Klasör Yapısı

```
project-root/
├── app/
│   ├── _layout.tsx                    ← Root layout, font yükleme, SafeAreaProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx                ← Custom Bottom Tab Navigator
│   │   ├── recipes.tsx                ← Recipes ana ekranı
│   │   ├── index.tsx                  ← Home (Ana Sayfa) ekranı
│   │   └── settings.tsx               ← Settings placeholder
├── components/
│   ├── navigation/
│   │   └── CustomBottomTab.tsx        ← Özel bottom nav bar
│   ├── recipes/
│   │   ├── WidgetCard.tsx             ← Tıklanabilir genişleyen kart
│   │   ├── ExpandedOverlay.tsx        ← Glassmorphism genişleme overlay
│   │   ├── RecipeListItem.tsx         ← Tarif liste satırı (kalp ikonu ile)
│   │   └── FavoriteButton.tsx         ← Kalp butonu (Trendyol stili)
│   ├── home/
│   │   ├── FilterChip.tsx             ← Pill/chip filtre butonu
│   │   ├── FilterChipRow.tsx          ← Yatay scroll chip listesi
│   │   ├── RecipeSearchBox.tsx        ← LLM input textbox
│   │   ├── CameraCapture.tsx          ← Kamera mock arayüzü
│   │   ├── LoadingAnalysis.tsx        ← "Hesaplanıyor..." ekranı
│   │   └── CalorieResultCard.tsx      ← Kalori sonuç ekranı
│   ├── calorie/
│   │   ├── TotalCaloriesHeader.tsx    ← Büyük kalori göstergesi
│   │   ├── CalorieBreakdownList.tsx   ← Besin bazlı kalori alt listesi
│   │   └── NutrientCard.tsx           ← Protein/Carbs/Fats yuvarlak kartı
│   └── shared/
│       ├── AnimatedPressable.tsx      ← Scale animasyonlu dokunma
│       └── GlassContainer.tsx         ← Yeniden kullanılabilir blur container
├── services/
│   ├── mockLLMService.ts              ← LLM API mock
│   ├── mockCameraService.ts           ← Kamera mock
│   └── mockCalorieService.ts          ← Kalori hesaplama mock
├── store/
│   ├── favoritesStore.ts              ← Zustand/Context favorites state
│   └── calorieStore.ts                ← Kalori takip state
├── data/
│   └── mockRecipes.ts                 ← Mock tarif verileri
├── constants/
│   ├── colors.ts                      ← Renk sabitleri
│   ├── typography.ts                  ← Font sabitleri
│   ├── spacing.ts                     ← Spacing scale
│   └── shadows.ts                     ← Gölge stilleri
├── hooks/
│   ├── useFavorites.ts
│   ├── useCalorieAnalysis.ts
│   └── useWidgetExpansion.ts
└── types/
    ├── recipe.ts
    └── calorie.ts
```

---

## 📦 Bağımlılıklar & Kurulum

```bash
# Temel
npx create-expo-app@latest recipe-calorie-app --template

# Navigasyon
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Animasyon (KRİTİK — tüm animasyonlar için)
npx expo install react-native-reanimated react-native-gesture-handler

# Blur / Glassmorphism
npx expo install expo-blur

# Fontlar
npx expo install expo-font @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans

# Kamera (mock için de gerekli)
npx expo install expo-camera expo-image-picker

# State Yönetimi
npm install zustand

# İkonlar
npx expo install @expo/vector-icons

# Linear Gradient (arka plan efektleri)
npx expo install expo-linear-gradient
```

> **Gemini Notu:** `babel.config.js` içinde `react-native-reanimated/plugin` eklenmiş olmalı. `app.json` içinde `plugins: ["expo-camera"]` ekle.

---

## 🗺️ Navigasyon Yapısı

### Bottom Tab Navigator — `app/(tabs)/_layout.tsx`

```
Sıralama (soldan sağa):
  Tab 1: Recipes   → icon: "book-open" (Feather) veya "restaurant-menu" (MaterialIcons)
  Tab 2: Home      → icon: "home" (Feather) — ortada, hafif büyük
  Tab 3: Settings  → icon: "settings" (Feather)

Tasarım Kuralları:
  - tabBarStyle: position absolute, bottom 16, marginHorizontal 24
  - borderRadius: 32 (hap şeklinde yüzen bar)
  - backgroundColor: rgba(255,255,255,0.90)
  - backdropFilter / BlurView sarmalayıcı
  - height: 68
  - Aktif ikon: renk değişimi + hafif scale (1.1x) animasyonu
  - Geçiş animasyonu: Reanimated ile spring tabanlı smooth geçiş
  - tabBarShowLabel: false (sadece ikonlar)
  - Aktif sekme için küçük bir dot indicator (2px, accent rengi)
```

---

## 📱 Ekran 1: Recipes (Tarifler)

### Layout Yapısı
```
SafeAreaView
└── ScrollView (vertical, showsVerticalScrollIndicator: false)
    ├── Header (sayfa başlığı — "Tarifler")
    ├── Row: İki küçük widget yan yana (flex: 1, gap: 12)
    │   ├── WidgetCard → "Popüler Tarifler"
    │   └── WidgetCard → "Favoriler"
    └── WidgetCard (tam genişlik) → "Sana Özel"
        └── İçinde RecipeListItem × 8 adet
```

### WidgetCard Bileşeni — `components/recipes/WidgetCard.tsx`

**Görsel Özellikler:**
```
backgroundColor: rgba(255,255,255,0.80)
borderRadius: --radius-xl (32px)
padding: 16px
border: 1px solid rgba(255,255,255,0.5)
shadow: shadows.medium
```

**Animasyon Mantığı (KRİTİK — En Detaylı Bölüm):**

Tıklama → genişleme animasyonu iOS klasör açılışı / macOS Quick Look tarzında:

```
1. Kullanıcı widget'a basar
2. Widget kendi pozisyonundan ölçülür (measure() ile x, y, width, height)
3. Reanimated SharedValue'lar animate edilir:
   - progress: 0 → 1 (spring, mass:0.8, damping:20, stiffness:200)
   - Widget scale: 1.0 → genişlemiş boyut
   - Overlay opacity: 0 → 1
4. Overlay (ExpandedOverlay) render edilir, absoluteFill
5. ExpandedOverlay içinde BlurView (expo-blur) arka planı örter
6. İçerik kart aşağıdan yukarı kayarak (translateY: 40→0) ve
   opacity (0→1) ile belirerek gelir — delay: 100ms
7. Kapatma: swipe down (PanGestureHandler) veya üst sağdaki X butonu
   → reverse spring animasyonu ile kapanır
```

```javascript
// useWidgetExpansion.ts içinde:
// - useSharedValue, useAnimatedStyle, withSpring, withTiming
// - expandWidget(widgetId: string, initialMeasure: LayoutRectangle)
// - collapseWidget()
// - animatedOverlayStyle (opacity, translateY)
// - animatedContentStyle (scale, borderRadius geçişi)
```

### ExpandedOverlay — `components/recipes/ExpandedOverlay.tsx`

```
Yapı:
  Modal (transparent: true, animationType: 'none')
  └── BlurView (intensity=85, tint='light', style=absoluteFill)
      └── Pressable (absoluteFill, onPress=collapse için arka plan)
          └── Animated Container (ekranın %80'i, centered veya bottom-sheet stili)
              ├── Handle bar (üstte küçük gray pill — swipe göstergesi)
              ├── Widget başlığı (ikon + metin)
              ├── Separator çizgisi
              └── ScrollView → RecipeListItem listesi
```

```
Glassmorphism stil:
  backgroundColor: rgba(250, 247, 242, 0.78)
  borderRadius: 28
  border: 1.5px solid rgba(255,255,255,0.55)
  shadow: shadows.glass
  overflow: hidden
```

### RecipeListItem — `components/recipes/RecipeListItem.tsx`

```
Layout: Row
├── Thumbnail (60×60, borderRadius: 14, objectFit: cover) — mock renk bloğu
├── Metin Grubu (flex: 1)
│   ├── Tarif adı (semibold, 15px)
│   └── Açıklama (muted, 13px, numberOfLines: 1)
└── FavoriteButton (sağda)

FavoriteButton (Trendyol tarzı):
  - Kalp ikonu: AntDesign "hearto" (boş) / "heart" (dolu, kırmızı)
  - onPress: favorites store'a ekle/çıkar
  - Animasyon: scale spring (1 → 1.4 → 1) + renk değişimi
  - Haptic feedback: Haptics.impactAsync(ImpactFeedbackStyle.Light)
  - State: useRecipeFavorite(id) hook'u
```

### Mock Tarif Verisi — `data/mockRecipes.ts`

```typescript
export const mockRecipes: Recipe[] = [
  { id: '1', name: 'Mercimek Çorbası', description: 'Geleneksel Türk lezzeti', calories: 220, prepTime: 25, tags: ['vegan', 'glutensiz'], thumbnail: '#E8D5B7' },
  { id: '2', name: 'Tavuk Salatası', description: 'Yüksek proteinli hafif öğün', calories: 380, prepTime: 15, tags: ['yüksek-protein'], thumbnail: '#B7D5E8' },
  { id: '3', name: 'Avokadolu Tost', description: 'Sağlıklı kahvaltı seçeneği', calories: 290, prepTime: 10, tags: ['vejetaryen'], thumbnail: '#B7E8C8' },
  { id: '4', name: 'Sebzeli Makarna', description: 'Tek tencerede kolay tarif', calories: 420, prepTime: 20, tags: ['tek-tencere', 'vejetaryen'], thumbnail: '#E8C8B7' },
  { id: '5', name: 'Chia Puding', description: 'Besleyici atıştırmalık', calories: 180, prepTime: 5, tags: ['vegan', 'düşük-kalori'], thumbnail: '#D5B7E8' },
  { id: '6', name: 'Izgara Somon', description: 'Omega-3 kaynağı akşam yemeği', calories: 460, prepTime: 20, tags: ['yüksek-protein', 'glutensiz'], thumbnail: '#E8B7B7' },
  { id: '7', name: 'Falafel Wrap', description: 'Sokak lezzeti, sağlıklı versiyon', calories: 350, prepTime: 30, tags: ['vegan'], thumbnail: '#E8E0B7' },
  { id: '8', name: 'Muzlu Pancake', description: '3 malzemeyle tatlı', calories: 310, prepTime: 15, tags: ['tatlı', 'vejetaryen'], thumbnail: '#F5DEB3' },
];
```

---

## 📱 Ekran 2: Home (Ana Sayfa)

### Ana Konsept: "Ne Yemek İstersin?"

### Layout Yapısı
```
SafeAreaView
└── KeyboardAvoidingView
    └── ScrollView
        ├── Header Selamlama ("İyi günler 👋")
        ├── FilterChipRow (yatay scroll, chip'ler)
        ├── RecipeSearchBox (LLM input)
        ├── LLM Sonuç Alanı (conditional render)
        ├── Divider ("— veya —")
        └── CalorieTrackerSection
            ├── CameraButton
            └── CalorieResultCard (kamera çekimi sonrası)
```

### FilterChipRow — `components/home/FilterChipRow.tsx`

```
ScrollView horizontal, showsHorizontalScrollIndicator: false
Chip'ler: ["⚡ 15 dk'da Hazır", "🌾 Gluten-free", "🌿 Vegan",
           "💪 Yüksek Protein", "🥦 Vejetaryen", "📉 Düşük Kalori",
           "🍲 Tek Tencere", "🍰 Tatlı"]

FilterChip stili:
  backgroundColor: seçili → accent; seçisiz → rgba(255,255,255,0.8)
  borderRadius: --radius-pill (999px)
  paddingHorizontal: 16, paddingVertical: 8
  border: 1px solid rgba(0,0,0,0.08)
  fontSize: 13, fontWeight: 500
  Animasyon: seçimde scale spring + background color interpolation
  Çoklu seçim destekli (Set<string> state)
```

### RecipeSearchBox — `components/home/RecipeSearchBox.tsx`

```
Görsel:
  backgroundColor: rgba(255,255,255,0.90)
  borderRadius: 20px
  padding: 16px
  minHeight: 80px
  border: 1.5px solid rgba(0,0,0,0.06)
  shadow: shadows.soft
  placeholder: "Malzemelerini yaz veya ne yemek istediğini sor..."
  multiline: true
  Font: DM Sans, 15px, regular

Sağ alt köşe: Gönder butonu (ok ikonu, 36×36, accent arka plan, borderRadius: 12)
  onPress: mockLLMService.query(inputText)

Loading state: ActivityIndicator veya 3 nokta pulse animasyonu
Sonuç: Input altında kayan (translateY: 20→0, opacity: 0→1) beyaz kart içinde metin
```

### CameraCapture — `components/home/CameraCapture.tsx`

```
Kamera Başlatma Butonu:
  Büyük, merkezi, yuvarlak buton (80×80)
  İçinde kamera ikonu
  Alt yazı: "Yemeğini fotoğrafla, kalorisini öğren"
  backgroundColor: accent
  Pressable → mockCameraService.captureFood()

Mock Kamera Akışı:
  1. Buton → izin kontrolü (expo-camera PermissionResponse mock)
  2. "Kamera Arayüzü" → gri/blur preview mockup (Rectangle, borderRadius: 20)
     İçinde "📸 Çekmek için dokun" metni
  3. onCapture → LoadingAnalysis ekranına geç

LoadingAnalysis (components/home/LoadingAnalysis.tsx):
  Tam ekran, backgroundColor: arka plan rengi
  Merkezi animasyonlu loader:
    - Büyük daire (80×80) pulse animasyonu (opacity 1→0.3→1, repeat)
    - Altında "Yemeğin analiz ediliyor..." (italic, muted)
    - Küçük alt metin: "Bu birkaç saniye sürebilir"
  Duration: mockCalorieService 1500ms delay sonra resolve
```

### CalorieResultCard — `components/calorie/`

**TotalCaloriesHeader — `TotalCaloriesHeader.tsx`**
```
Layout: Column, centered
├── Üst etiket: "Toplam Kalori" (küçük, muted, letterSpacing: 1.5, uppercase, 11px)
├── Kalori rakamı: "615" (display font Playfair Display, 72px, bold, primary color)
│   → countUp animasyonu: 0'dan 615'e smooth (useAnimatedProps + Reanimated)
└── Alt etiket: "kcal" (16px, semibold, muted)
```

**CalorieBreakdownList — `CalorieBreakdownList.tsx`**
```
Her besin satırı (Row):
  ├── Renkli dot (8px circle, besine özel renk)
  ├── Besin adı ("Karbonhidrat", "Protein", "Yağ")
  ├── Progress bar (flex:1, height:4, borderRadius:2, animated width)
  └── Kalori değeri ("320 kcal", right-aligned, semibold)

Besin renkleri:
  Karbonhidrat: #F4A261 (turuncu-sarı)
  Protein:      #E76F51 (kırmızı-turuncu — baget tavuk teması)
  Yağ:          #457B9D (mavi-gri)
  Lif:          #2A9D8F (yeşil-teal)

Progress bar animasyonu: Reanimated withTiming(targetWidth, {duration: 800})
  delay: her satır için +150ms stagger
```

**NutrientCard — `NutrientCard.tsx`** (KRİTİK TASARIM)
```
⚠️ KESİNLİKLE "Makrolar" veya "Macros" başlığı KULLANILMAYACAK
Bölüm başlığı yok veya sadece ince bir separator çizgisi.

Kartlar: Yatay ScrollView veya flex wrap
Her NutrientCard:
  Şekil: Daire veya oval (borderRadius: 999 veya aspect ratio 1:1.1)
  Boyut: 100×110 (yaklaşık)
  backgroundColor: besine özel soft renk tonu (opacity 0.15)
  border: 1.5px solid (besine özel renk, opacity 0.4)
  
  İçerik (Column, centered):
    ├── İkon (28×28) — SVG veya emoji yaklaşımı:
    │     Protein  → 🍗 (veya MaterialCommunityIcons "food-drumstick")
    │     Carbs    → 🌾 (veya MaterialCommunityIcons "barley")
    │     Fats     → 🫒 (veya MaterialCommunityIcons "oil")
    │     Fiber    → 🥦 (opsiyonel)
    ├── Değer: "11g" (20px, bold, besine özel renk)
    └── İsim: "Protein" (11px, muted, regular)

  Animasyon: Ekrana girişte pop animasyonu (scale: 0→1.1→1, spring)
    Her kart için +100ms stagger delay

İç içe geçmiş kart efekti (opsiyonel advanced):
  Büyük kart (Protein 11g) içinde küçük dekoratif iç halka
  border: 1px dashed rgba(besin-rengi, 0.3)
  margin: 6px inside
```

---

## 📱 Ekran 3: Settings

```typescript
// app/(tabs)/settings.tsx
export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Yakında...</Text>
      </View>
    </SafeAreaView>
  );
}
// Bu ekrana sonradan profil, dil, bildirim ayarları eklenecek
// Şimdilik tamamen placeholder — styles minimal tutulacak
```

---

## 🔧 Servis Katmanı (Mock Services)

### mockLLMService.ts
```typescript
// Gerçek API bağlandığında sadece bu dosya değişecek
export const mockLLMService = {
  query: async (prompt: string): Promise<LLMResponse> => {
    await delay(1200); // simüle edilmiş ağ gecikmesi
    return {
      suggestion: `"${prompt}" için öneri: Mercimek çorbası + tam buğday ekmek kombinasyonu önerilir. Hazırlama süresi yaklaşık 25 dakika.`,
      recipes: mockRecipes.slice(0, 3), // ilk 3 tarifi döndür
    };
  },
  // Gerçek implementasyonda: fetch('https://api.anthropic.com/v1/messages', {...})
};
```

### mockCalorieService.ts
```typescript
export const mockCalorieService = {
  analyzeFood: async (imageUri: string): Promise<CalorieResult> => {
    await delay(1500); // "Hesaplanıyor..." süresine eşdeğer
    return {
      totalCalories: 615,
      breakdown: [
        { name: 'Karbonhidrat', calories: 372, grams: 93, color: '#F4A261' },
        { name: 'Protein', calories: 44, grams: 11, color: '#E76F51' },
        { name: 'Yağ', calories: 189, grams: 21, color: '#457B9D' },
      ],
      nutrients: [
        { label: 'Protein', value: 11, unit: 'g', icon: 'food-drumstick', color: '#E76F51' },
        { label: 'Carbs', value: 93, unit: 'g', icon: 'barley', color: '#F4A261' },
        { label: 'Fats', value: 21, unit: 'g', icon: 'oil', color: '#457B9D' },
      ],
      foodName: 'Blueberry Pancakes', // mock tespit edilen yemek
    };
  },
};
```

### mockCameraService.ts
```typescript
export const mockCameraService = {
  requestPermission: async (): Promise<boolean> => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  },
  captureFood: async (): Promise<string> => {
    // Gerçekte expo-image-picker ile fotoğraf çekilir
    // Mock olarak 1 saniyelik delay + sahte URI döner
    await delay(800);
    return 'mock://food-image-captured';
  },
};
```

---

## 🗄️ State Yönetimi

### Favorites Store — `store/favoritesStore.ts` (Zustand)
```typescript
interface FavoritesStore {
  favorites: Set<string>;          // recipe id'leri
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

// Zustand create() ile oluştur
// persist middleware ile AsyncStorage'a kaydet
// (expo-modules-core veya @react-native-async-storage/async-storage)
```

### Calorie Store — `store/calorieStore.ts`
```typescript
interface CalorieStore {
  currentResult: CalorieResult | null;
  isAnalyzing: boolean;
  setAnalyzing: (v: boolean) => void;
  setResult: (r: CalorieResult) => void;
  clearResult: () => void;
}
```

---

## 🎬 Animasyon Detayları (Reanimated 3)

### Widget Genişleme Animasyonu (En Kritik)
```
Kullanılacak API'lar:
  - useSharedValue
  - useAnimatedStyle
  - withSpring (config: mass:0.7, damping:18, stiffness:180)
  - withTiming (overlay opacity için: duration:250, easing: Easing.out(Easing.quad))
  - measure() (widget'ın ekran koordinatlarını al)
  - runOnJS (JS thread'e geç)

Animasyon Sekansı:
  t=0ms:   Widget'a dokunuldu → measure() çağrısı
  t=0ms:   Modal render başlar (opacity: 0)
  t=16ms:  BlurView opacity: 0→1 (withTiming, 300ms)
  t=50ms:  İçerik container translateY: 60→0 + opacity: 0→1 (withSpring)
  t=150ms: İçerik listesi stagger ile belirir (her item +50ms delay)

Kapanma Sekansı:
  PanGestureHandler onEnd: velocityY > 500 veya translationY > 100 → kapat
  Kapanma: reverse timing (200ms) → Modal unmount
```

### FavoriteButton Animasyonu
```
onPress sekansı:
  1. withSpring(1.4, {mass:0.3, damping:8}) → scale artışı
  2. withSpring(1.0) → normal boyuta dön
  3. Renk: withTiming (boş gri → kırmızı veya geri)
  Toplam süre: ~350ms
```

### CalorieResult Giriş Animasyonu
```
Ekran ilk render:
  - TotalCaloriesHeader: opacity 0→1 + translateY -20→0 (400ms, ease-out)
  - countUp number animasyonu: 0→615 (800ms, easeOut)
  - CalorieBreakdownList: her satır 150ms stagger ile kayarak gelir
  - NutrientCard'lar: scale 0→1.1→1 spring, 100ms stagger
```

---

## 📋 TypeScript Tip Tanımları

```typescript
// types/recipe.ts
export interface Recipe {
  id: string;
  name: string;
  description: string;
  calories: number;
  prepTime: number; // dakika
  tags: string[];
  thumbnail: string; // hex renk veya URL
  ingredients?: string[];
}

// types/calorie.ts
export interface CalorieBreakdown {
  name: string;
  calories: number;
  grams: number;
  color: string;
}

export interface NutrientItem {
  label: string;
  value: number;
  unit: string;
  icon: string; // MaterialCommunityIcons icon name
  color: string;
}

export interface CalorieResult {
  totalCalories: number;
  breakdown: CalorieBreakdown[];
  nutrients: NutrientItem[];
  foodName: string;
}

export interface LLMResponse {
  suggestion: string;
  recipes: Recipe[];
}
```

---

## ⚙️ Kodlama Kuralları & Best Practices

1. **Her bileşen tek dosyada:** Stil `StyleSheet.create` ile bileşen dosyasının altında tutulur
2. **Prop tipleri:** Her component için `interface Props {}` tanımla
3. **memo kullanımı:** Liste item'ları (`RecipeListItem`, `NutrientCard`) `React.memo` ile sarılacak
4. **Inline style yok:** Tüm stiller `StyleSheet.create` içinde
5. **Magic number yok:** Tüm spacing, border radius, font size `constants/` dosyalarından gelecek
6. **Yorumlar:** Her fonksiyon ve karmaşık blok üzerine JSDoc yorum ekle
7. **Error boundary:** Servis çağrıları try-catch içinde, hata state'i UI'da gösterilecek
8. **Accessibility:** Her tıklanabilir öğeye `accessibilityLabel` ve `accessibilityRole` ekle
9. **useMemo/useCallback:** Ağır hesaplamalar ve event handler'lar optimize edilecek
10. **Platform.OS:** Gerekli yerlerde iOS/Android ayrımı yapılacak (shadow, blur farkları)

---

## 🚀 Geliştirme Sırası (Gemini CLI İçin Önerilen Sıra)

```
Adım 1: Proje iskeleti + klasör yapısı + constants dosyaları
Adım 2: TypeScript tip tanımları (types/)
Adım 3: Mock servisler ve mock veri (services/, data/)
Adım 4: Zustand store'ları (store/)
Adım 5: Shared components (AnimatedPressable, GlassContainer)
Adım 6: Custom Bottom Tab Navigator
Adım 7: Recipes ekranı — WidgetCard (animasyonsuz önce)
Adım 8: ExpandedOverlay animasyonu (widget genişleme)
Adım 9: RecipeListItem + FavoriteButton
Adım 10: Home ekranı — FilterChip + RecipeSearchBox
Adım 11: CameraCapture + LoadingAnalysis
Adım 12: CalorieResult ekranı (3 alt component)
Adım 13: Settings placeholder
Adım 14: Tüm animasyonların ince ayarı
Adım 15: Erişilebilirlik (accessibility) eklemeleri
```

---

> **Son Not:** Bu MD dosyası, Gemini CLI'a tek seferde veya bölüm bölüm beslenerek kullanılabilir. Her "Adım" için ayrı bir prompt yapılması önerilir: `"PROJECT_SPEC.md Adım 7'yi uygula: WidgetCard component'ını yaz"` gibi. Bu, token limitini aşmadan tutarlı, izlenebilir kod üretimi sağlar.
