import { useState, useEffect } from 'react';
import { GarmentSelector } from '@/components/GarmentSelector';
import { ModelSelector } from '@/components/ModelSelector';
import { VTONModelSelector } from '@/components/VTONModelSelector';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Garment, Model, VTONModelId } from '@/data/mockData';
import { loadGarments, loadModels } from '@/data/dataset';

const Index = () => {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVTONModels, setSelectedVTONModels] = useState<VTONModelId[]>(['cat']);
  const [loading, setLoading] = useState(true);

  // Load dataset on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedGarments, loadedModels] = await Promise.all([
          loadGarments(),
          loadModels(),
        ]);
        setGarments(loadedGarments);
        setModels(loadedModels);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleVTONModelToggle = (modelId: VTONModelId) => {
    setSelectedVTONModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VTON Benchmark</h1>
                <p className="text-xs text-muted-foreground">Virtual Try-On Model Karşılaştırma</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-mono">
                v0.1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Veri seti yükleniyor...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Selection Panel */}
            <section className="grid lg:grid-cols-2 gap-6">
              {/* Left: Garment Selection */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <GarmentSelector
                  garments={garments}
                  selectedGarment={selectedGarment}
                  onSelect={setSelectedGarment}
                />
              </div>

              {/* Right: Model & VTON Selection */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <ModelSelector
                    models={models}
                    selectedModel={selectedModel}
                    onSelect={setSelectedModel}
                  />
                </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <VTONModelSelector
                selectedModels={selectedVTONModels}
                onToggle={handleVTONModelToggle}
              />
            </div>
              </div>
            </section>

            {/* Results Section */}
            <section className="p-6 rounded-2xl bg-card border border-border min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Sonuçlar</h2>
                {selectedGarment && selectedModel && selectedVTONModels.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                    <span className="text-sm text-muted-foreground">Sonuçlar hazır</span>
                  </div>
                )}
              </div>
              <ResultsGrid
                garment={selectedGarment}
                model={selectedModel}
                selectedVTONModels={selectedVTONModels}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>VTON Benchmark Tool</p>
            <p className="font-mono">Built for Research</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
