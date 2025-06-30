
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Download } from 'lucide-react';

interface ChartOfAccountsHeaderProps {
  onAddAccount: () => void;
  onExportExcel: () => void;
}

export const ChartOfAccountsHeader = ({ onAddAccount, onExportExcel }: ChartOfAccountsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plano de Contas</h1>
          <p className="text-gray-600">Gerencie a estrutura contábil da LA Music</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button onClick={onAddAccount} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta
        </Button>
      </div>
    </div>
  );
};
