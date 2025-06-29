
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Percent, Target } from 'lucide-react';
import { getUnitPerformanceData } from '@/utils/strategicKPIs';

export const UnitComparisonTable = () => {
  const unitPerformanceData = getUnitPerformanceData();

  const getMargemColor = (margem: number) => {
    if (margem >= 30) return 'text-success-600 bg-success-50';
    if (margem >= 20) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  const getOcupacaoColor = (ocupacao: number) => {
    if (ocupacao >= 70) return 'text-success-600';
    if (ocupacao >= 50) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance por Unidade</h3>
        <Badge variant="outline" className="text-primary-600">
          Análise Detalhada
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Receita</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Lucro</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">CAC</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">LTV</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Ocupação</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Alunos</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Ticket Médio</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Margem Líquida</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Custo/Aluno</th>
            </tr>
          </thead>
          <tbody>
            {unitPerformanceData.map((unit, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      unit.unidade === 'Campo Grande' ? 'bg-blue-500' :
                      unit.unidade === 'Recreio' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="font-medium">{unit.unidade}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 font-semibold">
                  R$ {unit.receita.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 font-semibold text-success-600">
                  R$ {unit.lucro.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>R$ {unit.cac}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>R$ {unit.ltv.toLocaleString()}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <span className={`font-medium ${getOcupacaoColor(unit.ocupacao)}`}>
                    {unit.ocupacao}%
                  </span>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{unit.alunos}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>R$ {unit.ticketMedio}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <Badge variant="outline" className={getMargemColor(unit.margemLiquida)}>
                    {unit.margemLiquida.toFixed(1)}%
                  </Badge>
                </td>
                <td className="text-right py-4 px-4">
                  R$ {unit.custoAluno}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span>* Dados baseados no período selecionado</span>
      </div>
    </Card>
  );
};
