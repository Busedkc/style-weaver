// Dataset loader for VTON comparison tool
// Replace mockData imports with this file when you have your dataset ready

import { Garment, Model, GarmentCategory, VTONModelId, mockGarments, mockModels, generateMockResult } from './mockData';

// Dataset configuration
// Klasör yapınıza göre: garment, model, result
const DATASET_BASE_PATH = '/dataset';

// Load garments from your dataset
// Expected structure: public/dataset/garment/{garment_id}.jpg veya {category}/{garment_id}.jpg
export const loadGarments = async (): Promise<Garment[]> => {
  // Option 1: Load from a manifest.json file (önerilen)
  try {
    const response = await fetch(`${DATASET_BASE_PATH}/manifest.json`);
    if (response.ok) {
      const data = await response.json();
      return data.garments || [];
    }
  } catch (error) {
    console.warn('manifest.json bulunamadı, alternatif yöntem kullanılacak');
  }

  // Option 2: Load from a TypeScript/JSON file
  // Import your garments data here
  // Example:
  // import { garmentsData } from './your-garments-data';
  // return garmentsData;

  // Option 3: Fallback to mock data if no dataset found
  console.warn('Dataset bulunamadı, mock veriler kullanılıyor');
  return mockGarments;
};

// Load models from your dataset
// Expected structure: public/dataset/model/{model_id}.jpg
export const loadModels = async (): Promise<Model[]> => {
  // Option 1: Load from manifest.json
  try {
    const response = await fetch(`${DATASET_BASE_PATH}/manifest.json`);
    if (response.ok) {
      const data = await response.json();
      return data.models || [];
    }
  } catch (error) {
    console.warn('manifest.json bulunamadı, alternatif yöntem kullanılacak');
  }

  // Option 2: Fallback to mock data if no dataset found
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
  // Expected: /dataset/model/{model_id}.jpg
  return `${DATASET_BASE_PATH}/model/${model.id}.jpg`;
};

