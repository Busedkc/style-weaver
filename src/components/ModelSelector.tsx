import { cn } from '@/lib/utils';
import { Model } from '@/data/mockData';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: Model | null;
  onSelect: (model: Model) => void;
}

export const ModelSelector = ({ models, selectedModel, onSelect }: ModelSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Model Seç</h2>
        <span className="text-sm text-muted-foreground font-mono">
          {models.length} model
        </span>
      </div>
      
      <div className="flex gap-4 justify-center">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={cn(
              "group relative w-24 aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300",
              "border-2 bg-card",
              selectedModel?.id === model.id
                ? "border-primary glow-primary scale-[1.05]"
                : "border-transparent hover:border-primary/50 hover:scale-[1.02]"
            )}
          >
            <img
              src={model.thumbnail}
              alt={model.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent">
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-xs font-medium text-foreground">{model.name}</p>
              </div>
            </div>
            {selectedModel?.id === model.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
