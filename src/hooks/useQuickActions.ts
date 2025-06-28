
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  meta: string;
  atual: number;
  objetivo: number;
  progresso: number;
  tipo: 'receita' | 'despesa' | 'alunos' | 'ticket' | 'margem';
}

export interface ExportConfig {
  period: 'current' | 'previous' | 'semester';
  format: 'pdf' | 'excel' | 'csv';
  units: string[];
}

export const useQuickActions = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize goals from localStorage or default data
  useEffect(() => {
    const savedGoals = localStorage.getItem('dashboard-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      const defaultGoals: Goal[] = [
        { id: '1', meta: 'Receita Total', atual: 245780, objetivo: 260000, progresso: 94.5, tipo: 'receita' },
        { id: '2', meta: 'Alunos Ativos', atual: 1247, objetivo: 1300, progresso: 95.9, tipo: 'alunos' },
        { id: '3', meta: 'Ticket Médio', atual: 197, objetivo: 200, progresso: 98.5, tipo: 'ticket' },
        { id: '4', meta: 'Margem Líquida', atual: 21.8, objetivo: 25.0, progresso: 87.2, tipo: 'margem' }
      ];
      setGoals(defaultGoals);
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('dashboard-goals', JSON.stringify(goals));
    }
  }, [goals]);

  const exportDRE = async (config: ExportConfig) => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Exportação concluída",
        description: `DRE exportado em formato ${config.format.toUpperCase()}`,
      });
      
      // In a real app, this would trigger the actual file download
      console.log('Exporting DRE with config:', config);
      
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o DRE. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates, progresso: updates.objetivo ? (goal.atual / updates.objetivo) * 100 : goal.progresso }
        : goal
    ));
    
    toast({
      title: "Meta atualizada",
      description: "A meta foi atualizada com sucesso.",
    });
  };

  const addGoal = (newGoal: Omit<Goal, 'id' | 'progresso'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString(),
      progresso: (newGoal.atual / newGoal.objetivo) * 100
    };
    
    setGoals(prev => [...prev, goal]);
    
    toast({
      title: "Meta adicionada",
      description: "Nova meta foi criada com sucesso.",
    });
  };

  const generateReport = async (reportType: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Relatório gerado",
        description: `${reportType} foi gerado com sucesso.`,
      });
      
      // In a real app, this would trigger the actual file download
      console.log('Generating report:', reportType);
      
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    goals,
    isLoading,
    exportDRE,
    updateGoal,
    addGoal,
    generateReport
  };
};
