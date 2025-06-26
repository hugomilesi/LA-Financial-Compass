import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Building } from 'lucide-react';

interface PlanningFiltersProps {
  selectedPeriod: { year: number; month: number };
  onPeriodChange: (period: { year: number; month: number }) => void;
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
}

export const PlanningFilters = ({ 
  selectedPeriod, 
  onPeriodChange, 
  selectedUnit, 
  onUnitChange 
}: PlanningFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const units = [
    { value: 'all', label: 'Todas Unidades' },
    { value: 'campo-grande', label: 'Campo Grande' },
    { value: 'recreio', label: 'Recreio' },
    { value: 'barra', label: 'Barra' }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          
          <Select 
            value={selectedPeriod.month.toString()} 
            onValueChange={(value) => onPeriodChange({ ...selectedPeriod, month: parseInt(value) })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedPeriod.year.toString()} 
            onValueChange={(value) => onPeriodChange({ ...selectedPeriod, year: parseInt(value) })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-6">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Unidade:</span>
          </div>

          <Select value={selectedUnit} onValueChange={onUnitChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
