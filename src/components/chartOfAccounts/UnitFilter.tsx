
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building } from 'lucide-react';

interface UnitFilterProps {
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
}

export const UnitFilter = ({ selectedUnit, onUnitChange }: UnitFilterProps) => {
  const units = [
    { id: 'all', name: 'Todas as Unidades' },
    { id: 'campo-grande', name: 'Campo Grande' },
    { id: 'recreio', name: 'Recreio' },
    { id: 'barra', name: 'Barra' }
  ];

  return (
    <div className="flex items-center gap-3">
      <Building className="h-5 w-5 text-primary-600" />
      <div className="space-y-2">
        <Label htmlFor="unit-select">Filtrar por Unidade</Label>
        <Select value={selectedUnit} onValueChange={onUnitChange}>
          <SelectTrigger id="unit-select" className="w-48">
            <SelectValue placeholder="Selecione uma unidade" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
