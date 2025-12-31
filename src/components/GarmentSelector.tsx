import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Garment, garmentCategories, GarmentCategory } from '@/data/mockData';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface GarmentSelectorProps {
  garments: Garment[];
  selectedGarment: Garment | null;
  onSelect: (garment: Garment) => void;
}

export const GarmentSelector = ({ garments, selectedGarment, onSelect }: GarmentSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'all'>('all');
  
  const filteredGarments = selectedCategory === 'all' 
    ? garments 
    : garments.filter(g => g.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Kıyafet Seç</h2>
        <span className="text-sm text-muted-foreground font-mono">
          {filteredGarments.length} item{filteredGarments.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Category Filter */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Tümü
          </button>
          {garmentCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Garment Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {filteredGarments.map((garment) => (
          <button
            key={garment.id}
            onClick={() => onSelect(garment)}
            className={cn(
              "group relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
              "border-2 bg-card",
              selectedGarment?.id === garment.id
                ? "border-primary glow-primary scale-[1.02]"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <img
              src={garment.thumbnail}
              alt={garment.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-medium text-foreground truncate">{garment.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{garment.category}</p>
              </div>
            </div>
            {selectedGarment?.id === garment.id && (
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
