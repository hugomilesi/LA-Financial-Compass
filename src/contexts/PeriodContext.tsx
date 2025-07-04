
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  availableYears: number[];
  availableMonths: { value: number; label: string }[];
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
  const [availableYears, setAvailableYears] = useState<number>([]);
  const [availableMonths, setAvailableMonths] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      const { data, error } = await supabase
        .from('kpis_data')
        .select('date_ref')
        .order('date_ref', { ascending: true });

      if (error) {
        console.error('Error fetching available dates:', error);
        return;
      }

      if (data) {
        const uniqueDates = Array.from(new Set(data.map(item => item.date_ref)));
        const years = Array.from(new Set(uniqueDates.map(dateStr => new Date(dateStr).getFullYear()))).sort((a, b) => a - b);
        setAvailableYears(years);

        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const months = Array.from(new Set(uniqueDates.map(dateStr => new Date(dateStr).getMonth() + 1)))
          .sort((a, b) => a - b)
          .map(monthNum => ({ value: monthNum, label: monthNames[monthNum - 1] }));
        setAvailableMonths(months);

        // Set initial filter to the latest available month/year if data exists
        if (uniqueDates.length > 0) {
          const latestDate = new Date(uniqueDates[uniqueDates.length - 1]);
          setPeriodFilter(prev => ({
            ...prev,
            year: latestDate.getFullYear(),
            month: latestDate.getMonth() + 1,
          }));
        }
      }
    };

    fetchAvailableDates();
  }, []);

  const updateMonth = (month: number) => {
    console.log('🔄 [PeriodContext] Updating month to:', month);
    setPeriodFilter(prev => {
      const newFilter = { ...prev, month };
      console.log('🔄 [PeriodContext] New period filter:', newFilter);
      return newFilter;
    });
  };

  const updateYear = (year: number) => {
    console.log('🔄 [PeriodContext] Updating year to:', year);
    setPeriodFilter(prev => {
      const newFilter = { ...prev, year };
      console.log('🔄 [PeriodContext] New period filter:', newFilter);
      return newFilter;
    });
  };

  const updateViewType = (viewType: 'monthly' | 'ytd') => {
    console.log('🔄 [PeriodContext] Updating view type to:', viewType);
    setPeriodFilter(prev => {
      const newFilter = { ...prev, viewType };
      console.log('🔄 [PeriodContext] New period filter:', newFilter);
      return newFilter;
    });
  };

  const updateDateRange = (dateRange?: { start: Date; end: Date }) => {
    console.log('🔄 [PeriodContext] Updating date range to:', dateRange);
    setPeriodFilter(prev => {
      const newFilter = { ...prev, dateRange };
      console.log('🔄 [PeriodContext] New period filter:', newFilter);
      return newFilter;
    });
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
        getDisplayPeriod,
        availableYears,
        availableMonths,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};
