
import { Card } from '@/components/ui/card';
import { DollarSign, Target, TrendingUp, Users } from 'lucide-react';

export const QuickActions = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Ações Rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors">
          <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
          <p className="text-sm font-medium text-primary-700">Exportar DRE</p>
        </button>
        <button className="p-4 bg-success-50 border border-success-200 rounded-lg hover:bg-success-100 transition-colors">
          <Target className="w-6 h-6 text-success-600 mb-2" />
          <p className="text-sm font-medium text-success-700">Definir Metas</p>
        </button>
        <button className="p-4 bg-warning-50 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors">
          <TrendingUp className="w-6 h-6 text-warning-600 mb-2" />
          <p className="text-sm font-medium text-warning-700">Ver Relatórios</p>
        </button>
        <button className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <Users className="w-6 h-6 text-gray-600 mb-2" />
          <p className="text-sm font-medium text-gray-700">Análise Unidades</p>
        </button>
      </div>
    </Card>
  );
};
