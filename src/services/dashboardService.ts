
import { supabase } from '@/integrations/supabase/supabaseClient'

export const getMonthlyFinancials = async (unitSlug: string, period: any) => {
  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('id')
    .eq('slug', unitSlug)
    .single()

  if (unitError) {
    console.error('Error fetching unit:', unitError)
    return []
  }

  const { data, error } = await supabase
    .from('financial_entries')
    .select('entry_date, receita, despesa')
    .eq('unit_id', unit.id)
    .order('entry_date', { ascending: true })

  if (error) {
    console.error('Error fetching monthly financials:', error)
    return []
  }

  return data.map(d => ({ ...d, month: new Date(d.entry_date).toLocaleString('default', { month: 'short' }) }))
}

export const getCostCenterDistribution = async (unitSlug: string, period: any) => {
  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('id')
    .eq('slug', unitSlug)
    .single()

  if (unitError) {
    console.error('Error fetching unit:', unitError)
    return []
  }

  const { data, error } = await supabase
    .from('cost_center_entries')
    .select('category_name, value, color')
    .eq('unit_id', unit.id)
    // a real implementation would filter by date

  if (error) {
    console.error('Error fetching cost center distribution:', error)
    return []
  }

  return data.map(d => ({ ...d, name: d.category_name }))
}

export const getKPIs = async (unitSlug: string, period: any, kpiNames: string[]) => {
  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('id')
    .eq('slug', unitSlug)
    .single()

  if (unitError) {
    console.error('Error fetching unit:', unitError)
    return []
  }

  const { data, error } = await supabase
    .from('kpis_data')
    .select('kpi_name, value')
    .eq('unit_id', unit.id)
    .in('kpi_name', kpiNames)
    // a real implementation would filter by date

  if (error) {
    console.error('Error fetching KPIs:', error)
    return []
  }

  return data
}
