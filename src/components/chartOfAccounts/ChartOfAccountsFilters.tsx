
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UnitFilter } from './UnitFilter';

interface ChartOfAccountsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
  accountCount: number;
}

export const ChartOfAccountsFilters = ({
  searchTerm,
  onSearchChange,
  selectedUnit,
  onUnitChange,
  accountCount
}: ChartOfAccountsFiltersProps) => {
  const getUnitDisplayName = () => {
    switch (selectedUnit) {
      case 'campo-grande': return 'Campo Grande';
      case 'recreio': return 'Recreio';
      case 'barra': return 'Barra';
      default: return 'Todas as Unidades';
    }
  };

  return (
    <>
      <div className="flex gap-6 items-start">
        <div className="flex gap-4 items-center flex-1">
          <Input
            placeholder="Buscar contas por nome ou código..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-md"
          />
          <Badge variant="outline" className="text-sm">
            {accountCount} contas encontradas
          </Badge>
        </div>
        
        <UnitFilter 
          selectedUnit={selectedUnit} 
          onUnitChange={onUnitChange}
        />
      </div>

      {selectedUnit !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Filtro Ativo
            </Badge>
            <span className="text-sm text-blue-700">
              Mostrando contas para: <strong>{getUnitDisplayName()}</strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
