
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { monthlyData, costCenterData } from '@/utils/dashboardData';

interface ChartDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'revenue' | 'cost-center' | null;
}

const revenueDetailData = [
  { month: 'Jan', receita: 220000, despesa: 180000, lucro: 40000 },
  { month: 'Fev', receita: 235000, despesa: 185000, lucro: 50000 },
  { month: 'Mar', receita: 245000, despesa: 190000, lucro: 55000 },
  { month: 'Abr', receita: 238000, despesa: 188000, lucro: 50000 },
  { month: 'Mai', receita: 260000, despesa: 195000, lucro: 65000 },
  { month: 'Jun', receita: 245780, despesa: 192000, lucro: 53780 }
];

const costCenterDetailData = [
  { categoria: 'Salários', valor: 112000, percentual: 58.3 },
  { categoria: 'Aluguel', valor: 35000, percentual: 18.2 },
  { categoria: 'Marketing', valor: 24000, percentual: 12.5 },
  { categoria: 'Operacional', valor: 16700, percentual: 8.7 },
  { categoria: 'Outros', valor: 4300, percentual: 2.3 }
];

export const ChartDetailModal = ({ isOpen, onClose, chartType }: ChartDetailModalProps) => {
  if (!chartType) return null;

  const getModalContent = () => {
    switch (chartType) {
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">R$ 245.780</div>
                <div className="text-sm text-gray-600">Receita Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">R$ 192.000</div>
                <div className="text-sm text-gray-600">Despesa Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">R$ 53.780</div>
                <div className="text-sm text-gray-600">Lucro Líquido</div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Evolução Mensal Detalhada</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueDetailData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
                  <Line dataKey="receita" stroke="#10B981" name="Receita" strokeWidth={2} />
                  <Line dataKey="despesa" stroke="#EF4444" name="Despesa" strokeWidth={2} />
                  <Line dataKey="lucro" stroke="#3B82F6" name="Lucro" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Principais Receitas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mensalidades</span>
                    <span>R$ 195.624 (79.6%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matrículas</span>
                    <span>R$ 32.456 (13.2%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uniformes/Material</span>
                    <span>R$ 17.700 (7.2%)</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Principais Despesas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Folha de Pagamento</span>
                    <span>R$ 112.000 (58.3%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aluguel</span>
                    <span>R$ 35.000 (18.2%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing</span>
                    <span>R$ 24.000 (12.5%)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'cost-center':
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="text-lg font-semibold mb-4">Distribuição Detalhada por Centro de Custos</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costCenterData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {costCenterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {costCenterDetailData.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.categoria}</h4>
                      <p className="text-sm text-gray-600">{item.percentual}% do total</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">R$ {item.valor.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Junho 2024</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-4">Análise Comparativa</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Vs. Mês Anterior</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Pessoal:</span>
                      <span className="text-red-600">+2,4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aluguel:</span>
                      <span className="text-gray-600">0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className="text-green-600">-1,2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Vs. Meta</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Pessoal:</span>
                      <span className="text-red-600">+3,3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aluguel:</span>
                      <span className="text-green-600">-0,8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className="text-green-600">-2,5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (chartType) {
      case 'revenue':
        return 'Análise Detalhada - Receita vs Despesa';
      case 'cost-center':
        return 'Análise Detalhada - Centro de Custos';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {getModalContent()}
      </DialogContent>
    </Dialog>
  );
};
