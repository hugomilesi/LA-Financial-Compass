
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnit, UNITS } from '@/contexts/UnitContext';

export const DashboardHeader = () => {
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="text-gray-600 mt-1">
          Visão estratégica consolidada - Junho 2024 - {getUnitDisplayName(selectedUnit)}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
        <Calendar className="w-4 h-4 text-gray-500" />
        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
          <SelectTrigger className="w-[180px] border-none shadow-none">
            <SelectValue placeholder="Selecionar unidade" />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
