import { supabase } from '@/integrations/supabase/client';

export interface UnitFinancialData {
  receita: number;
  despesa: number;
  alunos: number;
  matriculas: number;
  ticketMedio: number;
  capacidade: number;
  ocupacao: number;
}

export const getDataByUnit = async (unitId: string): Promise<UnitFinancialData | null> => {
    if (unitId === 'all') {
        const { data, error } = await supabase.from('units').select('receita, despesa, alunos, matriculas, ticket_medio, capacidade, ocupacao');
        if (error) {
            
            return null;
        }

        const consolidatedData = data.reduce((acc, unit) => {
            acc.receita += unit.receita || 0;
            acc.despesa += unit.despesa || 0;
            acc.alunos += unit.alunos || 0;
            acc.matriculas += unit.matriculas || 0;
            acc.capacidade += unit.capacidade || 0;
            return acc;
        }, { receita: 0, despesa: 0, alunos: 0, matriculas: 0, ticketMedio: 0, capacidade: 0, ocupacao: 0 });

        consolidatedData.ticketMedio = consolidatedData.alunos > 0 ? consolidatedData.receita / consolidatedData.alunos : 0;
        consolidatedData.ocupacao = consolidatedData.capacidade > 0 ? (consolidatedData.alunos / consolidatedData.capacidade) * 100 : 0;

        return consolidatedData;
    } else {
        const { data, error } = await supabase.from('units').select('*').eq('id', unitId).single();
        if (error) {
            
            return null;
        }
        return data;
    }
};
