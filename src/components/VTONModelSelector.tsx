import { cn } from '@/lib/utils';
import { vtonModels, VTONModelId } from '@/data/mockData';

interface VTONModelSelectorProps {
  selectedModels: VTONModelId[];
  onToggle: (modelId: VTONModelId) => void;
}

export const VTONModelSelector = ({ selectedModels, onToggle }: VTONModelSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">VTON Modelleri</h2>
        <span className="text-sm text-muted-foreground font-mono">
          {selectedModels.length} seçili
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {vtonModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          return (
            <button
              key={model.id}
              onClick={() => onToggle(model.id)}
              className={cn(
                "group relative px-5 py-3 rounded-xl transition-all duration-300",
                "border-2 bg-gradient-card",
                isSelected
                  ? "border-accent glow-accent"
                  : "border-border hover:border-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center",
                  isSelected 
                    ? "bg-accent border-accent" 
                    : "border-muted-foreground"
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-accent-foreground animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <p className={cn(
                    "text-sm font-semibold transition-colors",
                    isSelected ? "text-accent" : "text-foreground"
                  )}>
                    {model.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
