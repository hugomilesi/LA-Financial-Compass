
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostCenterCategory } from '@/types/costCenter';
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import * as LucideIcons from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CostCenterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CostCenterCategory | null;
}

export const CostCenterDetailsModal = ({
  isOpen,
  onClose,
  category
}: CostCenterDetailsModalProps) => {
  const { accounts } = useChartOfAccounts();

  if (!category) return null;

  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Circle;
  
  const linkedAccounts = accounts.filter(acc => category.accounts.includes(acc.id));

  const unitChartData = category.unitBreakdown.map(unit => ({
    name: unit.unitName,
    value: unit.amount,
    percentage: unit.percentage
  }));

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent 
                className="h-6 w-6" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{category.name}</DialogTitle>
              <Badge variant={category.isActive ? "default" : "secondary"} className="mt-1">
                {category.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{category.description}</p>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: category.color }}>
                    {formatCurrency(category.totalAmount)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Valor Total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: category.color }}>
                    {category.percentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">do Total de Despesas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {category.accounts.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Contas Vinculadas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Unidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={unitChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} fontSize={12} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                      labelFormatter={(label) => `Unidade: ${label}`}
                    />
                    <Bar dataKey="value" fill={category.color} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Percentage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Percentual por Unidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={unitChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {unitChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={category.color} opacity={0.8 + (index * 0.1)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name, props) => [
                        formatCurrency(value), 
                        `${props.payload.percentage.toFixed(1)}%`
                      ]}
                    />
                    <Legend 
                      formatter={(value, entry) => entry.payload.name}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Linked Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Contas do Plano de Contas Vinculadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {linkedAccounts.length > 0 ? (
                  linkedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{account.code}</span>
                        <span className="ml-2 text-gray-700">{account.name}</span>
                      </div>
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma conta vinculada a esta categoria
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Unit Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Unidade</th>
                      <th className="text-right py-3 px-2">Valor</th>
                      <th className="text-right py-3 px-2">Percentual</th>
                      <th className="text-right py-3 px-2">% do Total da Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.unitBreakdown.map((unit) => (
                      <tr key={unit.unitId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{unit.unitName}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(unit.amount)}</td>
                        <td className="py-3 px-2 text-right">{unit.percentage.toFixed(1)}%</td>
                        <td className="py-3 px-2 text-right">
                          {((unit.amount / category.totalAmount) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
