
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

interface ChartsSectionProps {
  onChartClick: (chartType: 'revenue' | 'cost-center') => void;
  historicalData: any[];
  costCenterCategories: any[];
}

export const ChartsSection = ({ onChartClick, historicalData, costCenterCategories }: ChartsSectionProps) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  if (!historicalData || historicalData.length === 0 || !costCenterCategories || costCenterCategories.length === 0) {
    return null; // Or a placeholder/message indicating no data
  }

  const handleMouseEnter = (data: any, index: number) => {
    setHoveredSlice(index);
  };

  const handleMouseLeave = () => {
    setHoveredSlice(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Evolution */}
      <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onChartClick('revenue')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução Receita vs Despesa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, '']} />
            <Bar dataKey="receita" fill="#10B981" name="Receita" />
            <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2 text-center">Clique para ver análise detalhada</p>
      </Card>

      {/* Cost Center Distribution */}
      <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onChartClick('cost-center')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribuição Centro de Custos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={costCenterCategories}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="percentage"
              label={({ name, value }) => `${name}: ${value}%`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {costCenterCategories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={hoveredSlice === index ? "#ffffff" : "none"}
                  strokeWidth={hoveredSlice === index ? 3 : 0}
                  style={{
                    filter: hoveredSlice === index ? "brightness(1.1)" : "none",
                    transform: hoveredSlice === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.2s ease-in-out"
                  }}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2 text-center">Clique para ver análise detalhada</p>
      </Card>
    </div>
  );
};
