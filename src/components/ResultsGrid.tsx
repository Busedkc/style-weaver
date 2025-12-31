import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Garment, Model, vtonModels, VTONModelId } from '@/data/mockData';
import { getResultImagePath, getGarmentThumbnailPath, getModelThumbnailPath } from '@/data/dataset';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ResultsGridProps {
  garment: Garment | null;
  model: Model | null;
  selectedVTONModels: VTONModelId[];
}

export const ResultsGrid = ({ garment, model, selectedVTONModels }: ResultsGridProps) => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Download image function
  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('İndirme hatası:', error);
      // Fallback: Open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  if (!garment || !model) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground mb-1">Sonuçları Görmek İçin</p>
        <p className="text-sm text-muted-foreground">Bir kıyafet ve model seçin</p>
      </div>
    );
  }

  if (selectedVTONModels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground mb-1">VTON Modeli Seçin</p>
        <p className="text-sm text-muted-foreground">Karşılaştırma için en az bir model seçin</p>
      </div>
    );
  }

  // Sabit 2x2 grid düzeni: Üst satır (cat, idm), Alt satır (stable_vton, tpd)
  const gridOrder: VTONModelId[] = ['cat', 'idm', 'stable_vton', 'tpd'];
  const orderedVTONModels = gridOrder
    .map(id => vtonModels.find(m => m.id === id))
    .filter((m): m is typeof vtonModels[number] => m !== undefined && selectedVTONModels.includes(m.id));

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <img 
            src={getGarmentThumbnailPath(garment)} 
            alt={garment.name}
            className="w-12 h-12 rounded-lg object-cover border border-border"
            onError={(e) => {
              // Fallback to original thumbnail if dataset path fails
              if (e.currentTarget.src !== garment.thumbnail) {
                e.currentTarget.src = garment.thumbnail;
              }
            }}
          />
          <div>
            <p className="text-xs text-muted-foreground">Kıyafet</p>
            <p className="text-sm font-medium text-foreground">{garment.name}</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <div className="flex items-center gap-3">
          <img 
            src={getModelThumbnailPath(model)} 
            alt={model.name}
            className="w-12 h-12 rounded-lg object-cover border border-border"
            onError={(e) => {
              // Fallback to original thumbnail if dataset path fails
              if (e.currentTarget.src !== model.thumbnail) {
                e.currentTarget.src = model.thumbnail;
              }
            }}
          />
          <div>
            <p className="text-xs text-muted-foreground">Model</p>
            <p className="text-sm font-medium text-foreground">{model.name}</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <div>
          <p className="text-xs text-muted-foreground">Karşılaştırma</p>
          <p className="text-sm font-medium text-accent">{selectedVTONModels.length} VTON Model</p>
        </div>
      </div>

      {/* Results Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
        {gridOrder.map((vtonModelId, index) => {
          const vtonModel = vtonModels.find(m => m.id === vtonModelId);
          if (!vtonModel || !selectedVTONModels.includes(vtonModelId)) {
            return null;
          }
          
          return (
            <div 
              key={vtonModel.id}
              className="group bg-card rounded-xl border border-border overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{vtonModel.name}</h3>
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{vtonModel.description}</p>
            </div>
            <div className="relative aspect-[2/3] overflow-hidden">
              {(() => {
                const imagePath = getResultImagePath(garment.id, model.id, vtonModel.id, garment.category);
                const filename = `${vtonModel.id}_${garment.id}_${model.id}.jpg`;
                
                return (
                  <>
                    <img
                      src={imagePath}
                      alt={`${vtonModel.name} result`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const currentSrc = img.src;
                        
                        // If .jpg failed, try .jpeg extension
                        if (currentSrc.endsWith('.jpg')) {
                          img.src = currentSrc.replace('.jpg', '.jpeg');
                        } else {
                          // Fallback to placeholder if both extensions fail
                          img.src = '/placeholder.svg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        <Dialog open={openDialog === imagePath} onOpenChange={(open) => setOpenDialog(open ? imagePath : null)}>
                          <DialogTrigger asChild>
                            <button 
                              className="flex-1 py-2 px-3 rounded-lg bg-primary/90 text-primary-foreground text-xs font-medium hover:bg-primary transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDialog(imagePath);
                              }}
                            >
                              Tam Ekran
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0 shadow-none">
                            <div className="relative w-full bg-background/95 rounded-lg p-4">
                              <img
                                src={imagePath}
                                alt={`${vtonModel.name} - Tam Ekran`}
                                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  const currentSrc = img.src;
                                  if (currentSrc.endsWith('.jpg')) {
                                    img.src = currentSrc.replace('.jpg', '.jpeg');
                                  } else {
                                    img.src = '/placeholder.svg';
                                  }
                                }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <button 
                          className="py-2 px-3 rounded-lg bg-secondary/90 text-secondary-foreground text-xs font-medium hover:bg-secondary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(imagePath, filename);
                          }}
                        >
                          İndir
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
