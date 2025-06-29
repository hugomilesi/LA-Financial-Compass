
import { KPICard } from '@/components/KPICard';
import { DollarSign, Users, TrendingUp, Percent, Target, Clock, TrendingDown } from 'lucide-react';
import { getStrategicKPIs } from '@/utils/strategicKPIs';
import { useUnit } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { useEffect, useMemo } from 'react';

interface StrategicKPISectionsProps {
  onKPIClick: (kpi: any) => void;
}

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Percent,
  Target,
  Clock
};

export const StrategicKPISections = ({ onKPIClick }: StrategicKPISectionsProps) => {
  const { selectedUnit } = useUnit();
  const { periodFilter } = usePeriod();
  
  useEffect(() => {
    console.log('🔄 [StrategicKPISections] Unit changed to:', selectedUnit);
    console.log('🔄 [StrategicKPISections] Period changed to:', periodFilter);
  }, [selectedUnit, periodFilter]);
  
  console.log('🎯 [StrategicKPISections] Rendering with unit:', selectedUnit, 'and period:', periodFilter);
  
  // Use useMemo to recalculate strategic KPIs when dependencies change
  const strategicKPIs = useMemo(() => {
    console.log('🔄 [StrategicKPISections] Recalculating strategic KPIs...');
    return getStrategicKPIs(selectedUnit, periodFilter);
  }, [selectedUnit, periodFilter]);

  console.log('📊 [StrategicKPISections] Strategic KPIs:', strategicKPIs);

  const mapKPIWithIcon = (kpi: any) => ({
    ...kpi,
    icon: iconMap[kpi.icon as keyof typeof iconMap]
  });

  // Create unique keys that include all relevant state
  const createKPIKey = (index: number) => 
    `strategic-${index}-${selectedUnit}-${periodFilter.year}-${periodFilter.month}-${periodFilter.viewType}-${Date.now()}`;

  return (
    <div className="space-y-6">
      {/* Strategic KPIs Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">KPIs Estratégicos</h2>
          <p className="text-sm text-gray-600">Indicadores financeiros e operacionais focados em rentabilidade</p>
        </div>
      </div>

      {/* Strategic KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategicKPIs.map((kpi, index) => (
          <KPICard 
            key={createKPIKey(index)} 
            {...mapKPIWithIcon(kpi)} 
            onClick={() => onKPIClick(kpi)} 
          />
        ))}
      </div>
    </div>
  );
};
