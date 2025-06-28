import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { downloadReportFile } from '@/utils/fileDownload';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'dre' | 'fluxo-caixa' | 'rentabilidade' | 'custos' | 'benchmark' | 'inadimplencia' | 'alunos' | 'kpi';
  period: string;
  status: 'available' | 'generating' | 'error';
  fileSize?: string;
  lastUpdated: Date;
  data?: any;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'DRE Detalhado por Unidade',
    description: 'Demonstrativo completo com breakdown por centro de custo e unidade operacional',
    type: 'dre',
    period: 'Junho 2024',
    status: 'available',
    fileSize: '2.1 MB',
    lastUpdated: new Date('2024-06-30'),
    data: {
      totalReceita: 245780,
      totalDespesa: 192000,
      lucroLiquido: 53780,
      unidades: [
        { nome: 'Campo Grande', receita: 98500, despesa: 76800, lucro: 21700 },
        { nome: 'Recreio', receita: 87200, despesa: 68500, lucro: 18700 },
        { nome: 'Barra', receita: 60080, despesa: 46700, lucro: 13380 }
      ]
    }
  },
  {
    id: '2',
    title: 'Análise de Custos Variáveis',
    description: 'Detalhamento dos custos que variam com a operação e sugestões de otimização',
    type: 'custos',
    period: 'Junho 2024',
    status: 'available',
    fileSize: '1.8 MB',
    lastUpdated: new Date('2024-06-29'),
    data: {
      custosVariaveis: 45600,
      percentualReceita: 18.5,
      principais: [
        { categoria: 'Material Didático', valor: 18200, percentual: 39.9 },
        { categoria: 'Comissões', valor: 12800, percentual: 28.1 },
        { categoria: 'Uniformes', valor: 8900, percentual: 19.5 },
        { categoria: 'Outros', valor: 5700, percentual: 12.5 }
      ]
    }
  },
  {
    id: '3',
    title: 'Relatório de Performance Individual',
    description: 'Avaliação de desempenho por colaborador e centro de resultado',
    type: 'kpi',
    period: 'Junho 2024',
    status: 'available',
    fileSize: '950 KB',
    lastUpdated: new Date('2024-06-28'),
    data: {
      totalColaboradores: 45,
      performanceMedia: 87.3,
      topPerformers: [
        { nome: 'Maria Silva', unidade: 'Campo Grande', score: 96.2 },
        { nome: 'João Santos', unidade: 'Recreio', score: 94.8 },
        { nome: 'Ana Costa', unidade: 'Barra', score: 93.1 }
      ]
    }
  },
  {
    id: '4',
    title: 'Análise de Capacidade por Unidade',
    description: 'Estudo da ocupação atual e potencial de crescimento de cada unidade',
    type: 'rentabilidade',
    period: 'Junho 2024',
    status: 'available',
    fileSize: '1.2 MB',
    lastUpdated: new Date('2024-06-27'),
    data: {
      capacidadeTotal: 1800,
      ocupacaoAtual: 1247,
      percentualOcupacao: 69.3,
      unidades: [
        { nome: 'Campo Grande', capacidade: 650, ocupacao: 498, percentual: 76.6 },
        { nome: 'Recreio', capacidade: 600, ocupacao: 441, percentual: 73.5 },
        { nome: 'Barra', capacidade: 550, ocupacao: 308, percentual: 56.0 }
      ]
    }
  },
  {
    id: '5',
    title: 'Benchmark Setorial',
    description: 'Comparação com indicadores do setor educacional e posicionamento competitivo',
    type: 'benchmark',
    period: 'Junho 2024',
    status: 'available',
    fileSize: '3.4 MB',
    lastUpdated: new Date('2024-06-26'),
    data: {
      posicaoMercado: 'Acima da Média',
      indicadores: [
        { metrica: 'Ticket Médio', empresa: 197, setor: 185, posicao: 'superior' },
        { metrica: 'Margem Líquida', empresa: 21.9, setor: 18.5, posicao: 'superior' },
        { metrica: 'Inadimplência', empresa: 3.4, setor: 4.2, posicao: 'superior' }
      ]
    }
  },
  {
    id: '6',
    title: 'Projeção de Fluxo de Caixa',
    description: 'Análise prospectiva dos próximos 90 dias com cenários otimista e pessimista',
    type: 'fluxo-caixa',
    period: '3º Trimestre 2024',
    status: 'generating',
    lastUpdated: new Date('2024-06-25')
  }
];

export const useReports = () => {
  const { toast } = useToast();
  const [reports] = useState<Report[]>(mockReports);
  const [isLoading, setIsLoading] = useState(false);

  const getReportsByType = (type: Report['type']) => {
    return reports.filter(report => report.type === type);
  };

  const getRelatedReports = (context: string) => {
    const contextMap: Record<string, Report['type'][]> = {
      'margem-liquida': ['dre', 'custos', 'benchmark'],
      'receita-total': ['dre', 'rentabilidade', 'benchmark'],
      'despesa-total': ['custos', 'dre', 'kpi'],
      'geracao-caixa': ['fluxo-caixa', 'dre', 'rentabilidade'],
      'ticket-medio': ['alunos', 'benchmark', 'rentabilidade'],
      'revenue-chart': ['dre', 'rentabilidade', 'benchmark'],
      'cost-center-chart': ['custos', 'dre', 'kpi']
    };

    const types = contextMap[context] || ['dre', 'custos', 'kpi'];
    return reports.filter(report => types.includes(report.type)).slice(0, 3);
  };

  const downloadReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      toast({
        title: "Erro",
        description: "Relatório não encontrado",
        variant: "destructive"
      });
      return;
    }

    if (report.status === 'generating') {
      toast({
        title: "Aguarde",
        description: "Este relatório ainda está sendo gerado",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Download the actual report file
      await downloadReportFile(report);
      
      toast({
        title: "Download concluído",
        description: `${report.title} foi baixado com sucesso`,
      });
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (type: Report['type'], period: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso",
      });
      
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reports,
    isLoading,
    getReportsByType,
    getRelatedReports,
    downloadReport,
    generateReport
  };
};
