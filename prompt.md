# GÖREV: Tarifler ekranı liste item tıklama davranışı — teşhis ve düzeltme

Sen Planning ajanısın. `@agents/planning.md`, `@agents/frontend.md`, `@agents/backend.md`, `@agents/review.md` ve `@PROJECT_CONTEXT.md` dosyalarını oku, sonra aşağıdaki iterasyonu yönet.

## 🚨 ÖN UYARI — PROMPT KÖRÜ KÖRÜNE UYGULAMA YASAK

Bu iterasyonda DAHA ÖNCE şu yanlış mimariyi uygulayan bir prompt fail oldu:

- "RecipeDetailOverlay'i recipes.tsx root'una mount et"
- "ExpandedOverlay'e onRecipePress prop'u ekle, callback ile recipes.tsx'e propagate et"

Bu mimari `agents/frontend.md` Fragment Pattern bölümünde (satır ~226-258) AÇIKÇA YASAKLANMIŞTIR. Mevcut kod zaten DOĞRU fragment pattern'ı kullanıyor:

```
components/recipes/ExpandedOverlay.tsx
  ├─ <Modal> (liste)
  │    └─ RecipeListItem listesi, her birinde onPress={() => handleRecipePress(recipe)}
  └─ <RecipeDetailOverlay visible recipe onClose /> (kardeş, aynı Modal seviyesi)
```

`recipes.tsx` ekranı `RecipeDetailOverlay`'i ASLA doğrudan render ETMEZ. Bu mimariyi koruyacaksın.

## 🎯 İterasyon Tipi: Bug Fix (varsa) — Belirti Doğrulama

### ADIM 1 — Belirti netleştirme (kod yazmadan önce)

Kullanıcı şunu raporladı: "Tarifler sekmesindeki Popüler, Sana Özel, Hızlı Tarifler, Favoriler widget'larındaki yemek adlarına tıklayınca hiçbir şey olmuyor."

Bu rapor MUĞLAK. Şu üç senaryodan hangisi olduğunu kodu okuyarak teşhis et:

**Senaryo A — Kullanıcı widget kartının kendisine tıkladığını sanıyor:**

- `app/(tabs)/recipes.tsx`'te widget'lar `<WidgetCard>` bileşenleri. WidgetCard sadece başlık+ikon gösteriyor, içinde RecipeListItem YOK. RecipeListItem'lar ancak widget'a tıklanınca açılan `ExpandedOverlay` içinde görünür.
- Eğer kullanıcı bunu "tarif adlarına tıklamak" sanıyorsa → mevcut davranış zaten doğru, action gerekmez.

**Senaryo B — ExpandedOverlay içindeki RecipeListItem'a tıklayınca gerçekten hiçbir şey olmuyor:**

- ExpandedOverlay.tsx satır 238-245'te `<StaggeredItem ... onPress={() => handleRecipePress(recipe)} />` var.
- StaggeredItem (satır 54-77) bu onPress'i RecipeListItem'a `<RecipeListItem recipe={recipe} onPress={onPress} />` olarak iletiyor.
- RecipeListItem.tsx satır 16-21'de `<Pressable onPress={onPress}>` ile sarılı.
- Sözleşme uçtan uca DOĞRU görünüyor. Eğer bu zincirde bir kopukluk varsa → BU GERÇEK BUG.

**Senaryo C — Detay overlay açılıyor ama görünmüyor (z-index / Modal layering bug'ı):**

- RecipeDetailOverlay açılıyor ama liste Modal'ının ALTINDA kalıyor.
- iOS/Android Modal yığını bozulmuş olabilir.

### ADIM 2 — Yetki dağılımı ve sıralı çalıştırma

Planning kararı:

**1. Önce Frontend Ajanına TEŞHİS GÖREVİ (kod yazmadan):**

```
HEDEF: Belirti A/B/C teşhisi yap.

OKUMA İZNİ:
  - app/(tabs)/recipes.tsx
  - components/recipes/WidgetCard.tsx
  - components/recipes/ExpandedOverlay.tsx
  - components/recipes/RecipeListItem.tsx
  - components/recipes/RecipeDetailOverlay.tsx
  - components/recipes/FavoriteButton.tsx
  - types/recipe.ts
  - hooks/useFavorites.ts

YAZMA İZNİ: HENÜZ YOK. Önce teşhis raporu üret.

GÖREV ADIMLARI:
  1. WidgetCard → ExpandedOverlay → RecipeListItem → onPress zincirini satır satır izle.
  2. Zincirde bir kopukluk var mı? (callback geçişi, prop adı uyumsuzluğu, useCallback closure stale state)
  3. RecipeDetailOverlay'in `visible` + `recipe` props sözleşmesi doğru tüketiliyor mu?
  4. RecipeDetailOverlay.tsx satır 170: `if (!recipe) return null` — bu Modal mount'undan ÖNCE.
     `selectedRecipe` null'a setlendiğinde Modal kapanma animasyonu tamamlanmadan Modal
     DOM'dan kaldırılıyor olabilir. Bu kapanma animasyonunu bozar mı? Test et.
  5. FavoriteButton (RecipeListItem içinde) Pressable'ı Pressable, dış Pressable'ın onPress'ini
     stopPropagation ile blokluyor olabilir mi? FavoriteButton.tsx'i incele.
  6. RecipeListItem'ın dış Pressable'ı ile FavoriteButton'un iç Pressable'ı arasında
     event bubble sorunu var mı? (Kullanıcı kalbe değil isme bastığında ne olur?)

ÇIKTI: Aşağıdaki formatta TEŞHİS RAPORU:
  - SENARYO: A | B | C
  - GEREKLİ DEĞİŞİKLİK: (varsa minimum kapsam, hangi dosya hangi satır)
  - GEREKLİ DEĞİŞİKLİK YOK ise: kullanıcıya iletilecek açıklama (widget'a değil, açılan listeye tıklanması gerektiğini söyle)

YASAK:
  - RecipeDetailOverlay'i recipes.tsx root'una taşıma.
  - Fragment pattern'ı bozma.
  - ExpandedOverlay'den selectedRecipe state'ini DIŞARIYA taşıma — ExpandedOverlay içinde kalacak.
  - "Belki şu da gerekir" diye spekülatif refactor yapma. Minimal düzeltme.
```

**2. Sonra (eğer Senaryo B/C teşhis edildiyse) Frontend Ajanına DÜZELTME GÖREVİ:**

```
HEDEF: Teşhis raporundaki minimum kök nedeni gider.

YAZMA İZNİ: Yalnızca teşhiste belirtilen dosya(lar). Liste önceden açık değil — teşhise göre belirlenir.

KISITLAR:
  - Magic number yok → constants/'tan import
  - Animasyon sabitleri (mass:0.7, damping:18, stiffness:180 vb.) DEĞİŞTİRİLEMEZ
  - useCallback bağımlılık listeleri doğru tutulacak (stale closure önlemi)
  - displayName + accessibilityLabel + Türkçe etiketler korunacak
  - RecipeListItem React.memo kalacak
  - Tip uyumluluğu: `Recipe` tipi tek kaynak (`types/recipe.ts`), AI ve DB tarifleri aynı tipi kullanıyor (PROJECT_CONTEXT Adım 25-26 notları)

DOĞRULAMA:
  1. npx tsc --noEmit → 0 hata
  2. ExpandedOverlay açıkken RecipeListItem'a tıklanınca RecipeDetailOverlay açılır
  3. RecipeDetailOverlay açıkken FavoriteButton'a tıklanınca SADECE favori toggle olur,
     detay overlay açılmaz (event propagation)
  4. RecipeDetailOverlay kapanınca selectedRecipe null'a düşer, ExpandedOverlay açık kalır
  5. ExpandedOverlay kapanınca selectedRecipe da temizlenir (stale state önlemi)
  6. Android + iOS'ta Modal layering doğru — detay overlay liste overlay'in ÜSTÜNDE
```

**3. Son Review Ajanını çağır:**

Review kontrol listesinde özellikle şunlara odaklan:

- Modal layering / fragment pattern bozulmamış
- selectedRecipe state hâlâ ExpandedOverlay içinde, recipes.tsx'e sızmamış
- RecipeDetailOverlay null guard mevcut (satır 170: `if (!recipe) return null`)
- accessibilityViewIsModal={true} hem ExpandedOverlay hem RecipeDetailOverlay'de var
- FavoriteButton ile dış Pressable arasında event çakışması yok
- Adım 26'da düzeltilen "expanded overlay stale snapshot" regresyona uğramamış

### ADIM 3 — PROJECT_CONTEXT.md güncellemesi

İterasyon kapanınca:

- Eğer Senaryo A çıktıysa: `🐛 Bilinen Sorunlar` bölümüne "kullanıcı widget kartının içinde tarif listesi olduğunu sanıyor — UX iyileştirmesi adayı (örn. small variant'a önizleme satırı eklemek)" notu ekle.
- Eğer B/C ile bug fix yapıldıysa: `📜 İterasyon Geçmişi` bölümüne kayıt ekle, değişen dosyaları listele, kök neden + çözüm tek paragrafta.

## 🚫 KESİN YASAKLAR (Hatırlatma)

1. `RecipeDetailOverlay`'i `app/(tabs)/recipes.tsx` ekranına TAŞIMA
2. `ExpandedOverlay`'den `selectedRecipe` state'ini DIŞARIYA çıkarma
3. `ExpandedOverlay`'e `onRecipePress` prop'u EKLEME (gereksiz; state zaten içeride yönetiliyor)
4. Fragment pattern'ı (`<><Modal/><RecipeDetailOverlay/></>`) BOZMA
5. Çalışan kodu "iyileştirme" amaçlı refactor ETME
6. `types/recipe.ts`'i ya da herhangi bir backend katmanı dosyasını Frontend ajanından DEĞİŞTİRME
