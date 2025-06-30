
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    name?: string;
    value?: any;
    payload?: any;
  }>;
  label?: string;
  type: 'ltv-cac' | 'crc-churn';
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, type }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const renderLtvCacTooltip = () => {
    const cacValue = payload.find(p => p.dataKey === 'cac')?.value || 0;
    const ltvValue = payload.find(p => p.dataKey === 'ltv')?.value || 0;
    const ratio = ltvValue / cacValue;
    
    let interpretation = '';
    let interpretationColor = '';
    
    if (ratio >= 10) {
      interpretation = 'Ótimo';
      interpretationColor = 'text-green-600';
    } else if (ratio >= 5) {
      interpretation = 'Ok';
      interpretationColor = 'text-yellow-600';
    } else {
      interpretation = 'Atenção';
      interpretationColor = 'text-red-600';
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.name}: {entry.dataKey === 'ltv' ? 
                `R$ ${entry.value.toLocaleString()}` : 
                `R$ ${entry.value.toFixed(2)}`
              }
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-700">Relação LTV/CAC: </span>
            <span className="font-medium">{ratio.toFixed(1)}x</span>
          </div>
          <div className="text-sm mt-1">
            <span className="text-gray-700">Análise: </span>
            <span className={`font-medium ${interpretationColor}`}>{interpretation}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCrcChurnTooltip = () => {
    const crcValue = payload.find(p => p.dataKey === 'crc')?.value || 0;
    const churnValue = payload.find(p => p.dataKey === 'churnRate')?.value || 0;
    
    let riskAnalysis = '';
    let riskColor = '';
    
    if (churnValue > 5) {
      riskAnalysis = 'Alto risco';
      riskColor = 'text-red-600';
    } else if (crcValue > 90 && churnValue >= 4) {
      riskAnalysis = 'Possível esforço excessivo de retenção';
      riskColor = 'text-yellow-600';
    } else {
      riskAnalysis = 'Situação controlada';
      riskColor = 'text-green-600';
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.name}: {entry.dataKey === 'churnRate' ? 
                `${entry.value.toFixed(1)}%` : 
                `R$ ${entry.value.toFixed(2)}`
              }
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-700">Análise de Risco: </span>
            <span className={`font-medium ${riskColor}`}>{riskAnalysis}</span>
          </div>
        </div>
      </div>
    );
  };

  return type === 'ltv-cac' ? renderLtvCacTooltip() : renderCrcChurnTooltip();
};
