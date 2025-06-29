
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getKPIDetails } from '@/utils/kpiData';
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiId: string | null;
  unitId: string;
}

export const KPIDetailModal = ({ isOpen, onClose, kpiId, unitId }: KPIDetailModalProps) => {
  if (!kpiId) return null;
  
  const kpiData = getKPIDetails(kpiId, unitId);
  
  if (!kpiData) return null;
  
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'crescendo':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrescendo':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };
  
  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'crescendo':
        return 'text-green-600';
      case 'decrescendo':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: kpiData.color }}
            />
            {kpiData.title} - {kpiData.unit}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Valor Atual</div>
              <div className="text-2xl font-bold" style={{ color: kpiData.color }}>
                {kpiData.details.currentValue}
              </div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Meta</div>
              <div className="text-2xl font-bold text-gray-900">
                {kpiData.details.target}
              </div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Tendência</div>
              <div className={`text-lg font-semibold flex items-center justify-center gap-2 ${getTrendColor(kpiData.details.trend)}`}>
                {getTrendIcon(kpiData.details.trend)}
                {kpiData.details.trend}
              </div>
            </Card>
          </div>
          
          {/* Description */}
          <Card className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Sobre este KPI
            </h4>
            <p className="text-gray-700">{kpiData.description}</p>
          </Card>
          
          {/* Factors and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Principais Fatores</h4>
              <ul className="space-y-2">
                {kpiData.details.factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Recomendações</h4>
              <ul className="space-y-2">
                {kpiData.details.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          
          {/* Change Indicator */}
          {kpiData.change !== 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2">
                {kpiData.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600">
                  Variação vs mês anterior: 
                  <span className={`font-semibold ml-1 ${kpiData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpiData.change > 0 ? '+' : ''}{kpiData.change.toFixed(1)}%
                  </span>
                </span>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
