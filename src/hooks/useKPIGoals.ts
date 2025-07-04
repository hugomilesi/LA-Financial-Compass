import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KPIGoal {
  id: string;
  user_id: string;
  kpi_name: string;
  goal_value: number;
  unit_id: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_GOALS = {
  'Receita Total': 800000,
  'Despesa Total': 600000,
  'Geração de Caixa': 200000,
  'Margem Líquida': 25,
  'Ticket Médio': 850,
  'Custo por Aluno': 380,
  'Alunos Ativos': 500,
  'Inadimplência (%)': 3.0
};

export const useKPIGoals = (unitId: string = 'all') => {
  const [goals, setGoals] = useState<Record<string, number>>(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('goals').select('*');
      if (unitId !== 'all') {
        query = query.eq('unit_id', unitId);
      }
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching KPI goals:', error);
        toast.error('Erro ao carregar metas dos KPIs');
        return;
      }

      // Merge custom goals with defaults
      const customGoals = data?.reduce((acc, goal) => {
        acc[goal.kpi_name] = goal.goal_value; // Changed from goal.name to goal.kpi_name and goal.target_value to goal.goal_value
        return acc;
      }, {} as Record<string, number>) || {};

      setGoals({ ...DEFAULT_GOALS, ...customGoals });
    } catch (error) {
      console.error('Error in fetchGoals:', error);
      toast.error('Erro ao carregar metas dos KPIs');
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (kpiName: string, goalValue: number) => {
    if (!user) {
      toast.error('Você precisa estar logado para alterar metas');
      return false;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('goals')
        .upsert({
          kpi_name: kpiName, // Changed from name to kpi_name
          goal_value: goalValue, // Changed from target_value to goal_value
          unit_id: unitId === 'all' ? null : unitId, // Handle 'all' case
          user_id: user.id // Added user_id
        }, {
          onConflict: 'kpi_name,unit_id' // Changed from name,unit_id to kpi_name,unit_id
        });

      if (error) {
        console.error('Error updating KPI goal:', error);
        toast.error('Erro ao salvar meta do KPI');
        return false;
      }

      // Update local state
      setGoals(prev => ({
        ...prev,
        [kpiName]: goalValue
      }));

      toast.success('Meta atualizada com sucesso!');
      return true;
    } catch (error) {
      console.error('Error in updateGoal:', error);
      toast.error('Erro ao salvar meta do KPI');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const getGoal = (kpiName: string): number => {
    return goals[kpiName] || DEFAULT_GOALS[kpiName] || 0;
  };

  const resetToDefault = async (kpiName: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para resetar metas');
      return false;
    }

    setUpdating(true);
    try {
      let query = supabase.from('goals').delete().eq('kpi_name', kpiName); // Changed from name to kpi_name
      if (unitId !== 'all') {
        query = query.eq('unit_id', unitId);
      }
      const { error } = await query;

      if (error) {
        console.error('Error deleting KPI goal:', error);
        toast.error('Erro ao resetar meta do KPI');
        return false;
      }

      // Reset to default value
      setGoals(prev => ({
        ...prev,
        [kpiName]: DEFAULT_GOALS[kpiName] || 0
      }));

      toast.success('Meta resetada para o valor padrão!');
      return true;
    } catch (error) {
      console.error('Error in resetToDefault:', error);
      toast.error('Erro ao resetar meta do KPI');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user, unitId]);

  return {
    goals,
    loading,
    updating,
    updateGoal,
    getGoal,
    resetToDefault,
    fetchGoals
  };
};