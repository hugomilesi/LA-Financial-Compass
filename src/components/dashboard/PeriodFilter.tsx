
import { useState } from 'react';
import { Calendar, ChevronDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { usePeriod } from '@/contexts/PeriodContext';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export const PeriodFilter = () => {
  const { 
    periodFilter, 
    updateMonth, 
    updateYear, 
    updateViewType, 
    updateDateRange,
    getDisplayPeriod 
  } = usePeriod();
  
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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

  const handleViewTypeChange = (viewType: 'monthly' | 'ytd') => {
    updateViewType(viewType);
    if (viewType !== 'monthly') {
      updateDateRange(undefined);
      setDateRange(undefined);
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateDateRange({ start: range.from, end: range.to });
    } else {
      updateDateRange(undefined);
    }
  };

  const clearDateRange = () => {
    setDateRange(undefined);
    updateDateRange(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-auto justify-between bg-white shadow-sm hover:bg-gray-50",
            isOpen && "ring-2 ring-primary"
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{getDisplayPeriod()}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Visualização</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={periodFilter.viewType === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewTypeChange('monthly')}
                className="justify-start"
              >
                Mensal
              </Button>
              <Button
                variant={periodFilter.viewType === 'ytd' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewTypeChange('ytd')}
                className="justify-start"
              >
                Acumulado
              </Button>
            </div>
          </div>

          {periodFilter.viewType === 'monthly' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Mês</label>
                  <Select 
                    value={periodFilter.month.toString()} 
                    onValueChange={(value) => updateMonth(parseInt(value))}
                  >
                    <SelectTrigger className="h-8">
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
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Ano</label>
                  <Select 
                    value={periodFilter.year.toString()} 
                    onValueChange={(value) => updateYear(parseInt(value))}
                  >
                    <SelectTrigger className="h-8">
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
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Período Personalizado (Opcional)</label>
                  {periodFilter.dateRange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDateRange}
                      className="h-6 px-2 text-xs"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
                
                {periodFilter.dateRange && (
                  <Badge variant="secondary" className="mb-2">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    Período personalizado ativo
                  </Badge>
                )}
                
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={1}
                  className="rounded-md border"
                />
              </div>
            </>
          )}

          {periodFilter.viewType === 'ytd' && (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Ano</label>
              <Select 
                value={periodFilter.year.toString()} 
                onValueChange={(value) => updateYear(parseInt(value))}
              >
                <SelectTrigger>
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
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
