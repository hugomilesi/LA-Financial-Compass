
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { CostCenterCategory } from '@/types/costCenter';
import * as LucideIcons from 'lucide-react';

interface CostCenterCategoryCardProps {
  category: CostCenterCategory;
  onEdit: (category: CostCenterCategory) => void;
  onDelete: (categoryId: string) => void;
  onViewDetails: (category: CostCenterCategory) => void;
}

export const CostCenterCategoryCard = ({
  category,
  onEdit,
  onDelete,
  onViewDetails
}: CostCenterCategoryCardProps) => {
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Circle;

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      onDelete(category.categoryId);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent 
                className="h-5 w-5" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
              <Badge variant={category.isActive ? "default" : "secondary"} className="mt-1">
                {category.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(category)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {category.description}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Valor Total</span>
            <span className="text-lg font-bold text-gray-900">
              {category.totalAmount.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Percentual</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold" style={{ color: category.color }}>
                {category.percentage.toFixed(1)}%
              </span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(category.percentage, 100)}%`,
                backgroundColor: category.color 
              }}
            />
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Contas Vinculadas</span>
            <Badge variant="outline">
              {category.accounts.length} conta{category.accounts.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
