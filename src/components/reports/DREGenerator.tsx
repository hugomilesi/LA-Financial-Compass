
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Settings, Play, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { DRETemplate, DREConfiguration, DREData } from '@/types/dre';
import { UNITS } from '@/contexts/UnitContext';
import { DateRange } from 'react-day-picker';

interface DREGeneratorProps {
  templates: DRETemplate[];
  onGenerate: (config: DREConfiguration) => Promise<DREData>;
  onExport: (data: DREData, format: 'pdf' | 'excel' | 'csv') => void;
}

export const DREGenerator = ({
  templates,
  onGenerate,
  onExport
}: DREGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [comparisonRange, setComparisonRange] = useState<DateRange | undefined>();
  const [selectedUnits, setSelectedUnits] = useState<string[]>(['all']);
  const [displayOptions, setDisplayOptions] = useState({
    showPercentages: true,
    showVariance: true,
    showComparison: false,
    currency: 'BRL',
    decimalPlaces: 2
  });
  const [filters, setFilters] = useState({
    includeInactive: false,
    minimumAmount: 0,
    excludeZeroValues: true
  });
  const [generatedData, setGeneratedData] = useState<DREData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate || !dateRange?.from || !dateRange?.to) return;

    setIsGenerating(true);
    try {
      const config: DREConfiguration = {
        templateId: selectedTemplate,
        period: {
          startDate: dateRange.from,
          endDate: dateRange.to,
          comparisonPeriod: comparisonRange?.from && comparisonRange?.to ? {
            startDate: comparisonRange.from,
            endDate: comparisonRange.to
          } : undefined
        },
        units: selectedUnits,
        costCenters: [],
        filters,
        displayOptions
      };

      const data = await onGenerate(config);
      setGeneratedData(data);
    } catch (error) {
      console.error('Error generating DRE:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: displayOptions.decimalPlaces,
      maximumFractionDigits: displayOptions.decimalPlaces
    }).format(value);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração do DRE
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para geração do DRE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label htmlFor="template-select">Template DRE</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      {template.name}
                      {template.isDefault && <Badge variant="outline">Padrão</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateData && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedTemplateData.description} • {selectedTemplateData.structure.length} itens
              </p>
            )}
          </div>

          {/* Date Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Período Principal</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
            <div>
              <Label>Período de Comparação (Opcional)</Label>
              <DatePickerWithRange
                date={comparisonRange}
                onDateChange={setComparisonRange}
                className="w-full"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="show-comparison"
                  checked={displayOptions.showComparison}
                  onCheckedChange={(checked) => 
                    setDisplayOptions(prev => ({ ...prev, showComparison: !!checked }))
                  }
                />
                <Label htmlFor="show-comparison">Mostrar comparação</Label>
              </div>
            </div>
          </div>

          {/* Unit Selection */}
          <div>
            <Label>Unidades</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {UNITS.map(unit => (
                <div key={unit.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`unit-${unit.id}`}
                    checked={selectedUnits.includes(unit.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUnits([...selectedUnits, unit.id]);
                      } else {
                        setSelectedUnits(selectedUnits.filter(id => id !== unit.id));
                      }
                    }}
                  />
                  <Label htmlFor={`unit-${unit.id}`}>{unit.displayName}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <Label>Opções de Exibição</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-percentages"
                  checked={displayOptions.showPercentages}
                  onCheckedChange={(checked) => 
                    setDisplayOptions(prev => ({ ...prev, showPercentages: !!checked }))
                  }
                />
                <Label htmlFor="show-percentages">Mostrar percentuais</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-variance"
                  checked={displayOptions.showVariance}
                  onCheckedChange={(checked) => 
                    setDisplayOptions(prev => ({ ...prev, showVariance: !!checked }))
                  }
                />
                <Label htmlFor="show-variance">Mostrar variações</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclude-zero"
                  checked={filters.excludeZeroValues}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, excludeZeroValues: !!checked }))
                  }
                />
                <Label htmlFor="exclude-zero">Excluir valores zero</Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerate}
              disabled={!selectedTemplate || !dateRange?.from || !dateRange?.to || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Gerando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Gerar DRE
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated DRE */}
      {generatedData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>DRE Gerencial</CardTitle>
                <CardDescription>
                  Gerado em {generatedData.metadata.generatedAt.toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onExport(generatedData, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onExport(generatedData, 'excel')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Receita Total</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(generatedData.totals.totalRevenue)}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Despesas Totais</div>
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(generatedData.totals.totalExpenses)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Lucro Bruto</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(generatedData.totals.grossProfit)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Lucro Líquido</div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(generatedData.totals.netProfit)}
                </div>
              </div>
            </div>

            {/* DRE Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  {displayOptions.showPercentages && (
                    <TableHead className="text-right">% Receita</TableHead>
                  )}
                  {displayOptions.showVariance && (
                    <TableHead className="text-right">Variação</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedData.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div 
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${item.level * 16}px` }}
                      >
                        <span className="font-mono text-xs text-gray-500">
                          {item.code}
                        </span>
                        <span className={item.type === 'total' ? 'font-bold' : ''}>
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right ${
                      item.type === 'total' ? 'font-bold' : ''
                    } ${
                      (item.value || 0) < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(item.value || 0)}
                    </TableCell>
                    {displayOptions.showPercentages && (
                      <TableCell className="text-right">
                        {item.percentageOfRevenue?.toFixed(1)}%
                      </TableCell>
                    )}
                    {displayOptions.showVariance && (
                      <TableCell className="text-right">
                        {item.variance && (
                          <div className={`flex items-center justify-end gap-1 ${
                            item.variance > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {item.variancePercentage?.toFixed(1)}%
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
