
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="text-gray-600 mt-1">Visão estratégica consolidada - Junho 2024</p>
      </div>
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
        <Calendar className="w-4 h-4 text-gray-500" />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] border-none shadow-none">
            <SelectValue placeholder="Selecionar unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Unidades</SelectItem>
            <SelectItem value="campo-grande">Campo Grande</SelectItem>
            <SelectItem value="recreio">Recreio</SelectItem>
            <SelectItem value="barra">Barra</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
