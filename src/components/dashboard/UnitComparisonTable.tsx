
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { getUnitComparison } from '@/utils/strategicKPIs';

export const UnitComparisonTable = () => {
  const unitComparison = getUnitComparison();

  const getMargemColor = (margem: number) => {
    if (margem >= 25) return 'text-success-600 bg-success-50';
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
        <h3 className="text-lg font-semibold text-gray-900">Comparativo Estratégico por Unidade</h3>
        <Badge variant="outline" className="text-primary-600">
          Análise Consolidada
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Receita</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Margem Líquida</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Custo/Aluno</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Ocupação</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Alunos</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Ticket Médio</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Performance</th>
            </tr>
          </thead>
          <tbody>
            {unitComparison.map((unit, index) => (
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
                <td className="text-right py-4 px-4">
                  <Badge variant="outline" className={getMargemColor(unit.margemLiquida)}>
                    {unit.margemLiquida.toFixed(1)}%
                  </Badge>
                </td>
                <td className="text-right py-4 px-4">
                  R$ {unit.custoAluno}
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
                <td className="text-center py-4 px-4">
                  <div className="flex justify-center">
                    {unit.margemLiquida >= 20 && unit.ocupacao >= 40 ? (
                      <TrendingUp className="w-5 h-5 text-success-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-warning-600" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Consolidated Row */}
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                  <span>CONSOLIDADO</span>
                </div>
              </td>
              <td className="text-right py-4 px-4">
                R$ {unitComparison.reduce((sum, unit) => sum + unit.receita, 0).toLocaleString()}
              </td>
              <td className="text-right py-4 px-4">
                <Badge variant="outline" className="text-primary-600 bg-primary-50">
                  {(unitComparison.reduce((sum, unit) => sum + unit.margemLiquida, 0) / unitComparison.length).toFixed(1)}%
                </Badge>
              </td>
              <td className="text-right py-4 px-4">
                R$ {Math.round(unitComparison.reduce((sum, unit) => sum + unit.custoAluno, 0) / unitComparison.length)}
              </td>
              <td className="text-right py-4 px-4 text-primary-600">
                {Math.round(unitComparison.reduce((sum, unit) => sum + unit.ocupacao, 0) / unitComparison.length)}%
              </td>
              <td className="text-right py-4 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{unitComparison.reduce((sum, unit) => sum + unit.alunos, 0)}</span>
                </div>
              </td>
              <td className="text-right py-4 px-4">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>R$ 399</span>
                </div>
              </td>
              <td className="text-center py-4 px-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>* Dados baseados no período selecionado</span>
        <span>Performance: Verde = Excelente, Amarelo = Atenção</span>
      </div>
    </Card>
  );
};
