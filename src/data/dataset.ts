// Dataset loader for VTON comparison tool
// Replace mockData imports with this file when you have your dataset ready

import { Garment, Model, GarmentCategory, VTONModelId, mockGarments, mockModels, generateMockResult, garmentCategories } from './mockData';

// Dataset configuration
// Klasör yapınıza göre: garment, model, result
const DATASET_BASE_PATH = '/dataset';

// Load garments from your dataset
// Expected structure: public/dataset/garment/{category}/{garment_id}.jpg
export const loadGarments = async (): Promise<Garment[]> => {
  const garments: Garment[] = [];
  
  try {
    // First, try to load from manifest.json to get all items
    const response = await fetch(`${DATASET_BASE_PATH}/garment/manifest.json`);
    if (response.ok) {
      const manifest: Record<string, Record<string, string>> = await response.json();
      
      // Iterate through each category in the manifest
      for (const [category, items] of Object.entries(manifest)) {
        // Iterate through each garment in the category
        for (const [filename] of Object.entries(items)) {
          // Extract garment ID from filename (e.g., "anorak_1.jpg" -> "anorak_1")
          const garmentId = filename.replace('.jpg', '');
          const garment: Garment = {
            id: garmentId,
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${garmentId.split('_')[1] || ''}`,
            category: category,
            thumbnail: `${DATASET_BASE_PATH}/garment/${category}/${filename}`
          };
          garments.push(garment);
        }
      }
    }
  } catch (error) {
    console.warn('Garment manifest.json bulunamadı, tüm kategoriler kontrol ediliyor:', error);
  }
  
  // Also generate all expected garments (1-10 for each category) to ensure nothing is missing
  // This ensures we load all photos even if manifest.json is incomplete
  for (const category of garmentCategories) {
    for (let i = 1; i <= 10; i++) {
      const garmentId = `${category}_${i}`;
      const filename = `${garmentId}.jpg`;
      
      // Check if this garment is already in the list
      const exists = garments.some(g => g.id === garmentId);
      
      if (!exists) {
        const garment: Garment = {
          id: garmentId,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${i}`,
          category: category,
          thumbnail: `${DATASET_BASE_PATH}/garment/${category}/${filename}`
        };
        garments.push(garment);
      }
    }
  }
  
  // Sort by category and then by ID
  garments.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    // Extract number from ID for proper numeric sorting
    const aNum = parseInt(a.id.split('_')[1] || '0');
    const bNum = parseInt(b.id.split('_')[1] || '0');
    return aNum - bNum;
  });
  
  if (garments.length === 0) {
    console.warn('Hiç kıyafet bulunamadı, mock veriler kullanılıyor');
    return mockGarments;
  }
  
  return garments;
};

// Load models from your dataset
// Expected structure: public/dataset/model/{model_id}.png
export const loadModels = async (): Promise<Model[]> => {
  try {
    // Load from model manifest.json
    const response = await fetch(`${DATASET_BASE_PATH}/model/manifest.json`);
    if (response.ok) {
      const manifest: Record<string, Record<string, string>> = await response.json();
      const models: Model[] = [];
      
      // Check if manifest has models structure or if we need to infer from files
      // Since we know there are model-1.png, model-2.png, model-3.png files
      const modelFiles = ['model-1.png', 'model-2.png', 'model-3.png'];
      
      for (const filename of modelFiles) {
        const modelId = filename.replace('.png', ''); // model-1, model-2, model-3
        const modelNumber = modelId.split('-')[1]; // 1, 2, 3
        const model: Model = {
          id: modelId,
          name: `Model ${modelNumber}`,
          thumbnail: `${DATASET_BASE_PATH}/model/${filename}`
        };
        models.push(model);
      }
      
      return models;
    }
  } catch (error) {
    console.warn('Model manifest.json bulunamadı, dosya sisteminden yükleniyor:', error);
    
    // Fallback: Try to load models directly from known files
    const modelFiles = ['model-1.png', 'model-2.png', 'model-3.png'];
    const models: Model[] = [];
    
    for (const filename of modelFiles) {
      const modelId = filename.replace('.png', '');
      const modelNumber = modelId.split('-')[1];
      const model: Model = {
        id: modelId,
        name: `Model ${modelNumber}`,
        thumbnail: `${DATASET_BASE_PATH}/model/${filename}`
      };
      models.push(model);
    }
    
    if (models.length > 0) {
      return models;
    }
  }

  // Fallback to mock data if no dataset found
  console.warn('Dataset bulunamadı, mock veriler kullanılıyor');
  return mockModels;
};

// Get result image path for a specific combination
// Actual structure: public/dataset/result/{vton_model_id}/{model_id}/{category}/{garment_id}.jpg
export const getResultImagePath = (
  garmentId: string,
  modelId: string,
  vtonModelId: VTONModelId,
  garmentCategory?: string
): string => {
  // Gerçek yapı: /dataset/result/{vton_model_id}/{model_id}/{category}/{garment_id}.jpg
  // Örnek: /dataset/result/stable_vton/model_3/tshirt/tshirt_1.jpg
  
  // Model ID'yi düzelt (model-1 -> model_1)
  // Result klasöründe model_1, model_2, model_3 formatı kullanılıyor
  const normalizedModelId = modelId.replace(/-/g, '_');
  
  // Category'yi garmentId'den çıkar veya parametre olarak al
  let category = garmentCategory;
  if (!category && garmentId.includes('_')) {
    // garmentId'den kategoriyi çıkar (örn: tshirt_1 -> tshirt)
    const parts = garmentId.split('_');
    if (parts.length > 1) {
      category = parts[0];
    }
  }
  
  if (category) {
    // Try .jpg first, then .jpeg (some files might be .jpeg)
    return `${DATASET_BASE_PATH}/result/${vtonModelId}/${normalizedModelId}/${category}/${garmentId}.jpg`;
  }
  
  // Fallback: Eski yapıyı dene
  return `${DATASET_BASE_PATH}/result/${vtonModelId}/${garmentId}_${modelId}.jpg`;
};

// Helper function to get garment thumbnail path
export const getGarmentThumbnailPath = (garment: Garment): string => {
  // If thumbnail is already a full path, return it
  if (garment.thumbnail.startsWith('http') || garment.thumbnail.startsWith('/')) {
    return garment.thumbnail;
  }
  
  // Otherwise, construct from dataset structure
  // Yapı 1: /dataset/garment/{category}/{garment_id}.jpg
  if (garment.category) {
    return `${DATASET_BASE_PATH}/garment/${garment.category}/${garment.id}.jpg`;
  }
  
  // Yapı 2: /dataset/garment/{garment_id}.jpg
  return `${DATASET_BASE_PATH}/garment/${garment.id}.jpg`;
};

// Helper function to get model thumbnail path
export const getModelThumbnailPath = (model: Model): string => {
  // If thumbnail is already a full path, return it
  if (model.thumbnail.startsWith('http') || model.thumbnail.startsWith('/')) {
    return model.thumbnail;
  }
  
  // Otherwise, construct from dataset structure
  // Expected: /dataset/model/{model_id}.png (models are PNG files)
  return `${DATASET_BASE_PATH}/model/${model.id}.png`;
};

