
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UNITS } from '@/contexts/UnitContext';
import { Building2, X } from 'lucide-react';

interface UnitSelectorProps {
  selectedUnits: string[];
  onUnitsChange: (units: string[]) => void;
}

export const UnitSelector = ({ selectedUnits, onUnitsChange }: UnitSelectorProps) => {
  const handleUnitSelect = (unitId: string) => {
    if (unitId === 'all') {
      onUnitsChange(['all']);
      return;
    }

    const newUnits = selectedUnits.includes('all') 
      ? [unitId] 
      : selectedUnits.includes(unitId)
        ? selectedUnits.filter(id => id !== unitId)
        : [...selectedUnits.filter(id => id !== 'all'), unitId];

    onUnitsChange(newUnits.length === 0 ? ['all'] : newUnits);
  };

  const handleRemoveUnit = (unitId: string) => {
    const newUnits = selectedUnits.filter(id => id !== unitId);
    onUnitsChange(newUnits.length === 0 ? ['all'] : newUnits);
  };

  const getDisplayText = () => {
    if (selectedUnits.includes('all')) {
      return 'Todas as Unidades';
    }
    
    if (selectedUnits.length === 1) {
      const unit = UNITS.find(u => u.id === selectedUnits[0]);
      return unit?.displayName || 'Unidade Selecionada';
    }
    
    return `${selectedUnits.length} unidades selecionadas`;
  };

  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-4 h-4 text-gray-500" />
      <Select value="" onValueChange={handleUnitSelect}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={getDisplayText()} />
        </SelectTrigger>
        <SelectContent>
          {UNITS.map(unit => (
            <SelectItem key={unit.id} value={unit.id}>
              <div className="flex items-center justify-between w-full">
                <span>{unit.displayName}</span>
                {selectedUnits.includes(unit.id) && !selectedUnits.includes('all') && (
                  <Badge variant="secondary" className="ml-2">
                    Selecionada
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {!selectedUnits.includes('all') && selectedUnits.length > 0 && (
        <div className="flex items-center gap-1 max-w-96 overflow-x-auto">
          {selectedUnits.map(unitId => {
            const unit = UNITS.find(u => u.id === unitId);
            return unit && (
              <Badge key={unitId} variant="outline" className="flex items-center gap-1">
                {unit.displayName}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveUnit(unitId)}
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};
