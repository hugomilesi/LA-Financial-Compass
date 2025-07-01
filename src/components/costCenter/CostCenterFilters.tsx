
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface CostCenterFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'amount' | 'percentage';
  onSortChange: (value: 'name' | 'amount' | 'percentage') => void;
  filterActive: boolean | null;
  onFilterActiveChange: (value: boolean | null) => void;
}

export const CostCenterFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterActive,
  onFilterActiveChange
}: CostCenterFiltersProps) => {
  const clearFilters = () => {
    onSearchChange('');
    onSortChange('amount');
    onFilterActiveChange(null);
  };

  const hasActiveFilters = searchTerm || sortBy !== 'amount' || filterActive !== null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amount">Maior Valor</SelectItem>
            <SelectItem value="percentage">Maior %</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filterActive === null ? 'all' : filterActive.toString()} 
          onValueChange={(value) => onFilterActiveChange(value === 'all' ? null : value === 'true')}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativos</SelectItem>
            <SelectItem value="false">Inativos</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm" className="gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};
