// Hook centralizado para buscar dados do dashboard via Supabase
// Segue SoC, usa os contexts globais e os serviços do dashboardService

import { useState, useEffect } from 'react';
import { getMonthlyFinancials, getCostCenterDistribution, getKPIs } from '@/services/dashboardService';
import { usePeriod } from '@/contexts/PeriodContext';
import { useUnit } from '@/contexts/UnitContext';

interface DashboardData {
  monthlyFinancials: any[];
  costCenterDistribution: any[];
  kpis: any[];
  loading: boolean;
}

export function useDashboardData() {
  const { period } = usePeriod();
  const { selectedUnit } = useUnit();
  const [data, setData] = useState<DashboardData>({
    monthlyFinancials: [],
    costCenterDistribution: [],
    kpis: [],
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    setData(prev => ({ ...prev, loading: true }));
    async function fetchData() {
      try {
        const [monthlyFinancials, costCenterDistribution, kpis] = await Promise.all([
          getMonthlyFinancials(selectedUnit, period),
          getCostCenterDistribution(selectedUnit, period),
          getKPIs(selectedUnit, period, [
            'Receita Total', 'Despesa Total', 'Geração de Caixa', 'Margem Líquida',
            'Ticket Médio', 'Custo por Aluno', 'Alunos Ativos', 'Inadimplência (%)'
          ]),
        ]);
        if (isMounted) {
          setData({
            monthlyFinancials,
            costCenterDistribution,
            kpis,
            loading: false,
          });
        }
      } catch (e) {
        if (isMounted) setData(prev => ({ ...prev, loading: false }));
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [selectedUnit, period]);

  return data;
}
