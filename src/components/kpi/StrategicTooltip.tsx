import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StrategicTooltipProps {
  type: 'ltv-cac' | 'crc-churn';
  data?: any;
}

export const StrategicTooltip: React.FC<StrategicTooltipProps> = ({ type, data }) => {
  const getLtvCacAnalysis = () => {
    // Get the latest data point for analysis
    const latestData = data?.[data.length - 1];
    if (!latestData) return null;

    const ratio = latestData.ltv / latestData.cac;
    
    let analysis = '';
    let recommendation = '';
    let color = '';
    
    if (ratio >= 10) {
      analysis = 'Excelente relação LTV/CAC! Sua empresa está gerando valor substancial.';
      recommendation = 'Continue investindo em aquisição e considere expandir para novos mercados.';
      color = 'text-green-600';
    } else if (ratio >= 5) {
      analysis = 'Boa relação LTV/CAC, mas há espaço para otimização.';
      recommendation = 'Foque em aumentar a retenção de clientes para melhorar o LTV.';
      color = 'text-yellow-600';
    } else if (ratio >= 3) {
      analysis = 'Relação LTV/CAC aceitável, mas requer atenção.';
      recommendation = 'Revise estratégias de aquisição e melhore a experiência do cliente.';
      color = 'text-orange-600';
    } else {
      analysis = 'Relação LTV/CAC crítica! Ação imediata necessária.';
      recommendation = 'Reduza custos de aquisição e implemente programas de retenção urgentemente.';
      color = 'text-red-600';
    }

    return { analysis, recommendation, color, ratio };
  };

  const getCrcChurnAnalysis = () => {
    const latestData = data?.[data.length - 1];
    if (!latestData) return null;

    const { crc, churnRate } = latestData;
    
    let analysis = '';
    let recommendation = '';
    let color = '';
    
    if (churnRate > 5 && crc > 90) {
      analysis = 'Alto custo de retenção com churn elevado indica ineficiência.';
      recommendation = 'Revise estratégias de retenção e identifique causas do churn.';
      color = 'text-red-600';
    } else if (churnRate > 5) {
      analysis = 'Taxa de churn elevada compromete o crescimento sustentável.';
      recommendation = 'Implemente pesquisas de satisfação e melhore a experiência.';
      color = 'text-orange-600';
    } else if (crc > 90) {
      analysis = 'Custo de retenção alto, mas churn controlado.';
      recommendation = 'Otimize processos de retenção para reduzir custos.';
      color = 'text-yellow-600';
    } else {
      analysis = 'Boa gestão de retenção com custos controlados.';
      recommendation = 'Mantenha as estratégias atuais e monitore tendências.';
      color = 'text-green-600';
    }

    return { analysis, recommendation, color };
  };

  const getTooltipContent = () => {
    if (type === 'ltv-cac') {
      const analysis = getLtvCacAnalysis();
      if (!analysis) return null;

      return (
        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <h4 className="font-semibold text-gray-900">Análise Estratégica</h4>
            <p className="text-sm text-gray-600">Relação LTV/CAC: {analysis.ratio.toFixed(1)}x</p>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Situação Atual:</p>
              <p className={`text-sm ${analysis.color}`}>{analysis.analysis}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Recomendação:</p>
              <p className="text-sm text-gray-600">{analysis.recommendation}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500">
              Benchmarks: Excelente (≥10x), Bom (5-10x), Aceitável (3-5x), Crítico (&lt;3x)
            </p>
          </div>
        </div>
      );
    } else {
      const analysis = getCrcChurnAnalysis();
      if (!analysis) return null;

      return (
        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <h4 className="font-semibold text-gray-900">Análise de Retenção</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Situação Atual:</p>
              <p className={`text-sm ${analysis.color}`}>{analysis.analysis}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Recomendação:</p>
              <p className="text-sm text-gray-600">{analysis.recommendation}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500">
              Meta: Churn &lt;5% | CRC &lt;R$80
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="group relative p-2 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 border border-yellow-200 hover:border-yellow-300"
            aria-label={`Ver análise estratégica ${type === 'ltv-cac' ? 'da relação LTV/CAC' : 'de retenção'}`}
            title={`Clique para ver insights estratégicos ${type === 'ltv-cac' ? 'da relação LTV/CAC' : 'de retenção'}`}
          >
            <Lightbulb className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700 transition-colors duration-200 animate-pulse-glow" />
            <div className="absolute inset-0 rounded-full ring-2 ring-yellow-300 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
