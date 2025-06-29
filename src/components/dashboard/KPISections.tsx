
import { KPICard } from '@/components/KPICard';
import { DollarSign, Users, TrendingUp, Percent, Target, CreditCard, Receipt, TrendingDown } from 'lucide-react';
import { getPrimaryKPIs, getSecondaryKPIs } from '@/utils/dashboardData';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { useEffect } from 'react';

interface KPISectionsProps {
  onKPIClick: (kpi: any) => void;
}

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  Percent,
  Target,
  CreditCard,
  Receipt,
  TrendingDown
};

export const KPISections = ({ onKPIClick }: KPISectionsProps) => {
  const { selectedUnit } = useUnit();
  const { periodFilter } = usePeriod();
  
  useEffect(() => {
    console.log('🔄 [KPISections] Unit changed to:', selectedUnit);
    console.log('🔄 [KPISections] Period changed to:', periodFilter);
    console.log('🔄 [KPISections] Force refresh triggered');
  }, [selectedUnit, periodFilter]);
  
  console.log('🎯 [KPISections] Rendering with unit:', selectedUnit, 'and period:', periodFilter);
  
  const primaryKPIs = getPrimaryKPIs(selectedUnit, periodFilter);
  const secondaryKPIs = getSecondaryKPIs(selectedUnit, periodFilter);

  console.log('📊 [KPISections] Primary KPIs:', primaryKPIs);
  console.log('📊 [KPISections] Secondary KPIs:', secondaryKPIs);

  const mapKPIWithIcon = (kpi: any) => ({
    ...kpi,
    icon: iconMap[kpi.icon as keyof typeof iconMap]
  });

  return (
    <>
      {/* Primary KPIs - Top 4 metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKPIs.map((kpi, index) => (
          <KPICard key={`primary-${index}-${selectedUnit}-${periodFilter.year}-${periodFilter.month}`} {...mapKPIWithIcon(kpi)} onClick={() => onKPIClick(kpi)} />
        ))}
      </div>

      {/* Secondary KPIs - Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((kpi, index) => (
          <KPICard key={`secondary-${index}-${selectedUnit}-${periodFilter.year}-${periodFilter.month}`} {...mapKPIWithIcon(kpi)} onClick={() => onKPIClick(kpi)} />
        ))}
      </div>
    </>
  );
};
