
import { createContext, useContext, useState, ReactNode } from 'react';

export interface PeriodFilter {
  year: number;
  month: number;
  viewType: 'monthly' | 'ytd';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface PeriodContextType {
  periodFilter: PeriodFilter;
  setPeriodFilter: (filter: PeriodFilter) => void;
  updateMonth: (month: number) => void;
  updateYear: (year: number) => void;
  updateViewType: (viewType: 'monthly' | 'ytd') => void;
  updateDateRange: (dateRange?: { start: Date; end: Date }) => void;
  getDisplayPeriod: () => string;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
};

interface PeriodProviderProps {
  children: ReactNode;
}

export const PeriodProvider = ({ children }: PeriodProviderProps) => {
  const currentDate = new Date();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1, // JavaScript months are 0-indexed
    viewType: 'monthly'
  });

  const updateMonth = (month: number) => {
    setPeriodFilter(prev => ({ ...prev, month }));
  };

  const updateYear = (year: number) => {
    setPeriodFilter(prev => ({ ...prev, year }));
  };

  const updateViewType = (viewType: 'monthly' | 'ytd') => {
    setPeriodFilter(prev => ({ ...prev, viewType }));
  };

  const updateDateRange = (dateRange?: { start: Date; end: Date }) => {
    setPeriodFilter(prev => ({ ...prev, dateRange }));
  };

  const getDisplayPeriod = () => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (periodFilter.viewType === 'ytd') {
      return `Acumulado ${periodFilter.year}`;
    }

    if (periodFilter.dateRange) {
      const startMonth = monthNames[periodFilter.dateRange.start.getMonth()];
      const endMonth = monthNames[periodFilter.dateRange.end.getMonth()];
      const startYear = periodFilter.dateRange.start.getFullYear();
      const endYear = periodFilter.dateRange.end.getFullYear();
      
      if (startYear === endYear) {
        return `${startMonth} - ${endMonth} ${startYear}`;
      }
      return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    }

    return `${monthNames[periodFilter.month - 1]} ${periodFilter.year}`;
  };

  return (
    <PeriodContext.Provider
      value={{
        periodFilter,
        setPeriodFilter,
        updateMonth,
        updateYear,
        updateViewType,
        updateDateRange,
        getDisplayPeriod
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};
