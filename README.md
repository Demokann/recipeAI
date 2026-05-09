# RecipeAI

A mobile app for discovering recipes and tracking calorie intake. Browse curated recipe collections, search for meal ideas using an AI-powered text input, and analyze the calorie content of your food by taking a photo.

Built with Expo SDK 54 and React Native 0.81.

---

## Screenshots

> Coming soon.

---

## Getting Started

**Requirements**

- Node.js 18 or later
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone, or an iOS/Android simulator

**Install dependencies**

```bash
cd recipeAI
npm install --legacy-peer-deps
```

**Start the development server**

```bash
npx expo start --clear
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR code with Expo Go.

---

## Folder Structure

```
recipeAI/
├── app/
│   ├── _layout.tsx              # Root layout — fonts, splash screen, providers
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator
│       ├── index.tsx            # Home screen
│       ├── recipes.tsx          # Recipes screen
│       └── settings.tsx         # Settings screen (placeholder)
├── components/
│   ├── calorie/
│   │   ├── TotalCaloriesHeader.tsx
│   │   ├── CalorieBreakdownList.tsx
│   │   └── NutrientCard.tsx
│   ├── home/
│   │   ├── FilterChip.tsx
│   │   ├── FilterChipRow.tsx
│   │   ├── RecipeSearchBox.tsx
│   │   ├── CameraCapture.tsx
│   │   ├── LoadingAnalysis.tsx
│   │   └── CalorieResultCard.tsx
│   ├── recipes/
│   │   ├── WidgetCard.tsx
│   │   ├── ExpandedOverlay.tsx
│   │   ├── RecipeListItem.tsx
│   │   └── FavoriteButton.tsx
│   ├── navigation/
│   │   └── CustomBottomTab.tsx
│   └── shared/
│       ├── AnimatedPressable.tsx
│       └── GlassContainer.tsx
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
├── data/
│   └── mockRecipes.ts
├── hooks/
│   └── useFavorites.ts
├── services/
│   ├── mockLLMService.ts
│   ├── mockCameraService.ts
│   └── mockCalorieService.ts
├── store/
│   ├── favoritesStore.ts
│   └── calorieStore.ts
├── types/
│   ├── recipe.ts
│   └── calorie.ts
└── utils/
    └── delay.ts
```

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | Expo SDK 54 |
| Language | TypeScript 5.9 |
| Navigation | expo-router v6 (file-based) |
| Animation | react-native-reanimated v4 |
| Gestures | react-native-gesture-handler v2 |
| State management | Zustand v5 |
| Fonts | Playfair Display, DM Sans (expo-google-fonts) |
| UI effects | expo-blur (glassmorphism) |
| Icons | @expo/vector-icons |
| Storage | @react-native-async-storage/async-storage |

---

## Features

**Recipes screen**

- Three expandable widget cards: Popular, Favorites, and Personalized
- Tapping a widget opens a glassmorphism overlay panel with a full recipe list
- Each recipe row shows a color thumbnail, name, description, and a favorite button
- The overlay can be dismissed by swiping down or tapping the close button
- Favorite state persists across sessions via AsyncStorage

**Home screen**

- Horizontal filter chip row with multi-select (quick, vegan, gluten-free, etc.)
- AI search box — type ingredients or a meal idea to get a suggestion (mocked)
- Camera button to photograph food and get a calorie estimate (mocked)
- Loading animation while analysis runs
- Calorie result card with:
  - Large animated calorie count (counts up from zero)
  - Macro breakdown list with animated progress bars
  - Protein, carbs, and fat oval cards with staggered pop-in animation

**Settings screen**

- Placeholder screen, ready for future profile and notification settings

**General**

- Custom floating bottom tab bar with glassmorphism effect
- Spring-based animations throughout, following iOS interaction patterns
- Full accessibility support — all interactive elements have labels and roles
- Warm cream color palette with serif display font for a editorial feel

---

## Notes

- All AI and camera features are currently mocked. Replace the files in `services/` to connect real APIs.
- The project targets the New Architecture (React Native 0.81 default). All dependencies are compatible.
Made by Demokan Turan and Oğuz Kaan Kaya