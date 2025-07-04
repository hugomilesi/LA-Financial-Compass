
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { PeriodFilter } from './PeriodFilter';
import { useEffect } from 'react';

export const DashboardHeader = () => {
  const { selectedUnit, setSelectedUnit, getUnitDisplayName, units } = useUnit();
  const { getDisplayPeriod } = usePeriod();

  useEffect(() => {
    console.log('🏢 [DashboardHeader] Selected Unit:', selectedUnit);
    console.log('🏢 [DashboardHeader] Display Name:', getUnitDisplayName(selectedUnit));
  }, [selectedUnit, getUnitDisplayName]);

  const handleUnitChange = (newUnit: string) => {
    console.log('🔄 [DashboardHeader] Unit changing from', selectedUnit, 'to', newUnit);
    setSelectedUnit(newUnit);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="text-gray-600 mt-1">
          Visão estratégica consolidada - {getDisplayPeriod()} - {getUnitDisplayName(selectedUnit)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* Period Filter */}
        <PeriodFilter />
        
        {/* Unit Filter */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select value={selectedUnit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-[180px] border-none shadow-none">
              <SelectValue placeholder="Selecionar unidade" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
