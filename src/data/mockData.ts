// Mock data for VTON comparison tool
// In real usage, this would come from your dataset structure

export interface Garment {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export interface Model {
  id: string;
  name: string;
  thumbnail: string;
}

export interface VTONResult {
  garmentId: string;
  modelId: string;
  vtonModelId: string;
  resultImage: string;
}

export const garmentCategories = [
  'anorak',
  'blazer',
  'blouse',
  'coat',
  'jacket',
  'knitwear',
  'shirt',
  'sweatshirt',
  'tshirt',
  'vest',
] as const;

export type GarmentCategory = typeof garmentCategories[number];

// Mock garments - in real app, load from manifest.json
export const mockGarments: Garment[] = [
  { id: 'anorak_1', name: 'Anorak 1', category: 'anorak', thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop' },
  { id: 'anorak_2', name: 'Anorak 2', category: 'anorak', thumbnail: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=200&h=200&fit=crop' },
  { id: 'blazer_1', name: 'Blazer 1', category: 'blazer', thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop' },
  { id: 'blazer_2', name: 'Blazer 2', category: 'blazer', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
  { id: 'tshirt_1', name: 'T-Shirt 1', category: 'tshirt', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop' },
  { id: 'tshirt_2', name: 'T-Shirt 2', category: 'tshirt', thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=200&fit=crop' },
  { id: 'jacket_1', name: 'Jacket 1', category: 'jacket', thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop' },
  { id: 'shirt_1', name: 'Shirt 1', category: 'shirt', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop' },
  { id: 'coat_1', name: 'Coat 1', category: 'coat', thumbnail: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop' },
  { id: 'sweatshirt_1', name: 'Sweatshirt 1', category: 'sweatshirt', thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop' },
];

// Mock person models
export const mockModels: Model[] = [
  { id: 'model_1', name: 'Model 1', thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop' },
  { id: 'model_2', name: 'Model 2', thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop' },
  { id: 'model_3', name: 'Model 3', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop' },
];

// Mock VTON models (AI models to compare)
export const vtonModels = [
  { id: 'cat', name: 'CAT-VTON', description: 'Category-Aware Transformer' },
  { id: 'hr_viton', name: 'HR-VITON', description: 'High Resolution VITON' },
  { id: 'gp_vton', name: 'GP-VTON', description: 'General Purpose VTON' },
] as const;

export type VTONModelId = typeof vtonModels[number]['id'];

// Generate mock results
export const generateMockResult = (garmentId: string, modelId: string, vtonModelId: string): string => {
  // In real app, this would return actual result paths from your dataset
  // For demo, we return placeholder images with slight variations
  const baseImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
  ];
  
  const index = (garmentId.charCodeAt(0) + modelId.charCodeAt(0) + vtonModelId.charCodeAt(0)) % baseImages.length;
  return baseImages[index];
};
