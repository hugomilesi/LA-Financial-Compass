
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Filter, RotateCcw } from 'lucide-react';
import { UNITS, useUnit } from '@/contexts/UnitContext';

interface DREUnitFilterProps {
  selectedUnits: string[];
  onUnitsChange: (units: string[]) => void;
  showUnitSpecificTemplates?: boolean;
  onToggleUnitTemplates?: (show: boolean) => void;
}

export const DREUnitFilter = ({
  selectedUnits,
  onUnitsChange,
  showUnitSpecificTemplates = false,
  onToggleUnitTemplates
}: DREUnitFilterProps) => {
  const { selectedUnit: contextUnit, getUnitDisplayName } = useUnit();

  const handleUnitToggle = (unitId: string, checked: boolean) => {
    if (checked) {
      // If selecting "all", deselect other units
      if (unitId === 'all') {
        onUnitsChange(['all']);
      } else {
        // Remove "all" if selecting specific units
        const newUnits = selectedUnits.filter(id => id !== 'all');
        onUnitsChange([...newUnits, unitId]);
      }
    } else {
      const newUnits = selectedUnits.filter(id => id !== unitId);
      // If no units selected, default to "all"
      if (newUnits.length === 0) {
        onUnitsChange(['all']);
      } else {
        onUnitsChange(newUnits);
      }
    }
  };

  const handleSelectAll = () => {
    onUnitsChange(['all']);
  };

  const handleSelectCurrent = () => {
    if (contextUnit && contextUnit !== 'all') {
      onUnitsChange([contextUnit]);
    }
  };

  const isAllSelected = selectedUnits.includes('all');
  const selectedCount = isAllSelected ? UNITS.length - 1 : selectedUnits.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Filtros por Unidade
        </CardTitle>
        <CardDescription>
          Selecione as unidades para incluir no DRE
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unit Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Unidades Selecionadas</Label>
            <Badge variant="outline">
              {selectedCount} de {UNITS.length - 1}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UNITS.map(unit => (
              <div key={unit.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`unit-${unit.id}`}
                  checked={selectedUnits.includes(unit.id)}
                  onCheckedChange={(checked) => 
                    handleUnitToggle(unit.id, !!checked)
                  }
                  disabled={unit.id === 'all' && selectedUnits.length > 1}
                />
                <Label 
                  htmlFor={`unit-${unit.id}`}
                  className={`flex-1 text-sm ${
                    unit.id === contextUnit ? 'font-medium text-blue-600' : ''
                  }`}
                >
                  {unit.displayName}
                  {unit.id === contextUnit && (
                    <span className="ml-2 text-xs text-blue-500">(Atual)</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={isAllSelected}
          >
            <Filter className="w-3 h-3 mr-1" />
            Todas
          </Button>
          
          {contextUnit !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectCurrent}
              disabled={selectedUnits.length === 1 && selectedUnits[0] === contextUnit}
            >
              <Building className="w-3 h-3 mr-1" />
              Apenas Atual
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onUnitsChange(['all'])}
            disabled={isAllSelected}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        </div>

        {/* Unit-specific Templates Toggle */}
        {onToggleUnitTemplates && (
          <div className="pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-unit-templates"
                checked={showUnitSpecificTemplates}
                onCheckedChange={(checked) => onToggleUnitTemplates(!!checked)}
              />
              <Label htmlFor="show-unit-templates" className="text-sm">
                Mostrar apenas templates específicos das unidades selecionadas
              </Label>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedUnits.length > 0 && !isAllSelected && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">
              Unidades Selecionadas:
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedUnits.map(unitId => (
                <Badge key={unitId} variant="secondary" className="text-xs">
                  {getUnitDisplayName(unitId)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
