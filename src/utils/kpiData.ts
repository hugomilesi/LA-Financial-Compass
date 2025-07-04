import { supabase } from '@/integrations/supabase/client';

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  description: string;
  unit: string;
}

// Function to fetch historical data from Supabase
export const getHistoricalDataByUnit = async (unitId: string) => {
  console.log('📊 [kpiData.getHistoricalDataByUnit] Getting historical data for unit:', unitId);

  let query = supabase.from('kpis_data').select('date_ref, kpi_name, value');

  if (unitId !== 'all') {
    query = query.eq('unit_id', unitId);
  }

  const { data, error } = await query.order('date_ref', { ascending: true });

  if (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }

  // Group by month and pivot the data
  const monthlyData = data.reduce((acc, curr) => {
    const month = new Date(curr.date_ref).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month };
    }
    acc[month][curr.kpi_name] = curr.value;
    return acc;
  }, {} as Record<string, any>);

  const result = Object.values(monthlyData);
  console.log('📈 [kpiData.getHistoricalDataByUnit] Fetched and processed historical data:', result);
  return result;
};

// Function to fetch current KPI values from Supabase
export const getKPIsByUnit = async (unitId: string, getUnitDisplayName: (unitId: string) => string): Promise<KPIData[]> => {
  console.log('📊 [kpiData.getKPIsByUnit] Getting KPIs for unit:', unitId);

  // Fetch the most recent KPI data for each kpi_name
  const { data, error } = await supabase
    .rpc('get_latest_kpi_data_for_unit', { p_unit_id: unitId === 'all' ? null : unitId });


  if (error) {
    console.error('Error fetching KPIs:', error);
    return [];
  }

  const kpis: KPIData[] = data.map((kpi: any) => ({
    id: kpi.kpi_name.toLowerCase().replace(/ /g, '-'),
    title: kpi.kpi_name,
    value: kpi.kpi_name.includes('%') ? `${kpi.value.toFixed(1)}%` : `R$ ${kpi.value.toLocaleString()}`,
    change: Math.round((Math.random() * 10 - 5) * 10) / 10, // Placeholder change
    icon: 'TrendingUp', // Placeholder icon
    color: '#10B981', // Placeholder color
    description: `Latest data for ${kpi.kpi_name}`,
    unit: unitId === 'all' ? 'Consolidado' : getUnitDisplayName(unitId)
  }));

  console.log('📈 [kpiData.getKPIsByUnit] Generated KPIs from fetched data:', kpis);
  return kpis;
};


export const getKPIDetails = async (kpiId: string, unitId: string, getUnitDisplayName: (unitId: string) => string) => {
  console.log('🔍 [kpiData.getKPIDetails] Getting details for KPI:', kpiId, 'Unit:', unitId);

  const kpis = await getKPIsByUnit(unitId, getUnitDisplayName);
  const kpi = kpis.find(k => k.id === kpiId);

  if (!kpi) return null;

  // This part can be enhanced to fetch more detailed data from other tables
  return {
    ...kpi,
    details: {
        currentValue: kpi.value,
        target: 'Target not implemented',
        trend: 'Trend not implemented',
        factors: ['Factor not implemented'],
        recommendations: ['Recommendation not implemented']
    }
  };
};