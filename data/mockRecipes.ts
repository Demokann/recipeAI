import { Recipe } from '../types/recipe';

/**
 * Uygulama genelinde kullanılacak mock tarif verileri.
 * 8 adet tarif, farklı tag kombinasyonları ile.
 */
export const mockRecipes: Recipe[] = [
  {
    id: 'r001',
    name: 'Mercimek Çorbası',
    description: 'Geleneksel Türk lezzeti, protein deposu.',
    calories: 220,
    prepTime: 25,
    tags: ['vejetaryen', 'düşük-kalori', 'yüksek-protein'],
    thumbnail: '#E8D5B7',
  },
  {
    id: 'r002',
    name: 'Tavuk Salatası',
    description: 'Yüksek proteinli, hafif öğle yemeği seçeneği.',
    calories: 380,
    prepTime: 15,
    tags: ['yüksek-protein', '15-dk'],
    thumbnail: '#B7D5E8',
  },
  {
    id: 'r003',
    name: 'Avokadolu Tost',
    description: 'Sağlıklı yağlar içeren pratik kahvaltı.',
    calories: 290,
    prepTime: 10,
    tags: ['vejetaryen', '15-dk'],
    thumbnail: '#B7E8C8',
  },
  {
    id: 'r004',
    name: 'Sebzeli Makarna',
    description: 'Tek tencerede kolayca hazırlanan vitamin deposu.',
    calories: 420,
    prepTime: 20,
    tags: ['vejetaryen', 'tek-tencere'],
    thumbnail: '#E8C8B7',
  },
  {
    id: 'r005',
    name: 'Chia Puding',
    description: 'Besleyici ve hafif bir atıştırmalık.',
    calories: 180,
    prepTime: 5,
    tags: ['vegan', 'düşük-kalori', '15-dk'],
    thumbnail: '#D5B7E8',
  },
  {
    id: 'r006',
    name: 'Izgara Somon',
    description: 'Omega-3 kaynağı, sağlıklı akşam yemeği.',
    calories: 460,
    prepTime: 20,
    tags: ['yüksek-protein', 'glutensiz'],
    thumbnail: '#E8B7B7',
  },
  {
    id: 'r007',
    name: 'Falafel Wrap',
    description: 'Vegan dostu, doyurucu sokak lezzeti.',
    calories: 350,
    prepTime: 30,
    tags: ['vegan'],
    thumbnail: '#E8E0B7',
  },
  {
    id: 'r008',
    name: 'Muzlu Pancake',
    description: 'Sadece 3 malzemeyle hazırlanan sağlıklı tatlı.',
    calories: 310,
    prepTime: 15,
    tags: ['vejetaryen', 'tatlı', '15-dk'],
    thumbnail: '#F5DEB3',
  },
];
