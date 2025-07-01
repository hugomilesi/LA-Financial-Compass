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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Settings, Play, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { DRETemplate, DREConfiguration, DREData } from '@/types/dre';
import { DREUnitFilter } from './DREUnitFilter';
import { DREUnitConfiguration } from './DREUnitConfiguration';
import { useDREState } from '@/hooks/useDREState';
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
  const { state, actions, validateConfiguration } = useDREState();
  const [unitConfigs, setUnitConfigs] = useState<Record<string, any>>({});
  const [showUnitSpecificTemplates, setShowUnitSpecificTemplates] = useState(false);
  
  // Initialize templates in state
  useState(() => {
    actions.updateTemplates(templates);
  });

  const handleGenerate = async () => {
    const validation = validateConfiguration();
    if (!validation.isValid) {
      // Show validation errors
      return;
    }

    actions.setIsGenerating(true);
    try {
      const config: DREConfiguration = {
        templateId: state.selectedTemplate,
        period: {
          startDate: state.filters.dateRange!.from,
          endDate: state.filters.dateRange!.to,
          comparisonPeriod: state.filters.comparisonRange ? {
            startDate: state.filters.comparisonRange.from,
            endDate: state.filters.comparisonRange.to
          } : undefined
        },
        units: state.filters.units,
        costCenters: [],
        filters: {
          includeInactive: state.filters.includeInactive,
          minimumAmount: state.filters.minimumAmount,
          excludeZeroValues: state.filters.excludeZeroValues
        },
        displayOptions: state.displayOptions
      };

      const data = await onGenerate(config);
      actions.setGeneratedData(data);
    } catch (error) {
      console.error('Error generating DRE:', error);
    } finally {
      actions.setIsGenerating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: state.displayOptions.decimalPlaces,
      maximumFractionDigits: state.displayOptions.decimalPlaces
    }).format(value);
  };

  const selectedTemplateData = templates.find(t => t.id === state.selectedTemplate);
  const validation = validateConfiguration();

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Configuração Básica</TabsTrigger>
          <TabsTrigger value="units">Filtros por Unidade</TabsTrigger>
          <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuração Básica do DRE
              </CardTitle>
              <CardDescription>
                Configure os parâmetros principais para geração do DRE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label htmlFor="template-select">Template DRE</Label>
                <Select 
                  value={state.selectedTemplate} 
                  onValueChange={actions.setSelectedTemplate}
                >
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
                    date={state.filters.dateRange}
                    onDateChange={(range) => actions.updateFilters({ dateRange: range })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Período de Comparação (Opcional)</Label>
                  <DatePickerWithRange
                    date={state.filters.comparisonRange}
                    onDateChange={(range) => actions.updateFilters({ comparisonRange: range })}
                    className="w-full"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="show-comparison"
                      checked={state.displayOptions.showComparison}
                      onCheckedChange={(checked) => 
                        actions.updateDisplayOptions({ showComparison: !!checked })
                      }
                    />
                    <Label htmlFor="show-comparison">Mostrar comparação</Label>
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <Label>Opções de Exibição</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-percentages"
                      checked={state.displayOptions.showPercentages}
                      onCheckedChange={(checked) => 
                        actions.updateDisplayOptions({ showPercentages: !!checked })
                      }
                    />
                    <Label htmlFor="show-percentages">Mostrar percentuais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-variance"
                      checked={state.displayOptions.showVariance}
                      onCheckedChange={(checked) => 
                        actions.updateDisplayOptions({ showVariance: !!checked })
                      }
                    />
                    <Label htmlFor="show-variance">Mostrar variações</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-zero"
                      checked={state.filters.excludeZeroValues}
                      onCheckedChange={(checked) => 
                        actions.updateFilters({ excludeZeroValues: !!checked })
                      }
                    />
                    <Label htmlFor="exclude-zero">Excluir valores zero</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-6">
          <DREUnitFilter
            selectedUnits={state.filters.units}
            onUnitsChange={(units) => actions.updateFilters({ units })}
            showUnitSpecificTemplates={showUnitSpecificTemplates}
            onToggleUnitTemplates={setShowUnitSpecificTemplates}
          />

          {state.filters.units.some(id => id !== 'all') && (
            <DREUnitConfiguration
              selectedUnits={state.filters.units}
              unitConfigs={unitConfigs}
              onConfigChange={(unitId, config) => 
                setUnitConfigs(prev => ({ ...prev, [unitId]: config }))
              }
              onConfigReset={(unitId) => {
                const { [unitId]: removed, ...rest } = unitConfigs;
                setUnitConfigs(rest);
              }}
              availableTemplates={templates.map(t => ({ id: t.id, name: t.name }))}
            />
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Filtros e configurações adicionais para o DRE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Valor Mínimo para Inclusão</Label>
                <Input
                  type="number"
                  value={state.filters.minimumAmount}
                  onChange={(e) => 
                    actions.updateFilters({ minimumAmount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-inactive"
                  checked={state.filters.includeInactive}
                  onCheckedChange={(checked) => 
                    actions.updateFilters({ includeInactive: !!checked })
                  }
                />
                <Label htmlFor="include-inactive">Incluir contas inativas</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Errors */}
      {!validation.isValid && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Erros de Validação</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleGenerate}
          disabled={!validation.isValid || state.isGenerating}
          size="lg"
        >
          {state.isGenerating ? (
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

      {/* Generated DRE */}
      {state.generatedData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>DRE Gerencial</CardTitle>
                <CardDescription>
                  Gerado em {state.generatedData.metadata.generatedAt.toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onExport(state.generatedData!, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onExport(state.generatedData!, 'excel')}
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
                  {formatCurrency(state.generatedData.totals.totalRevenue)}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Despesas Totais</div>
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(state.generatedData.totals.totalExpenses)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Lucro Bruto</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(state.generatedData.totals.grossProfit)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Lucro Líquido</div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(state.generatedData.totals.netProfit)}
                </div>
              </div>
            </div>

            {/* DRE Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  {state.displayOptions.showPercentages && (
                    <TableHead className="text-right">% Receita</TableHead>
                  )}
                  {state.displayOptions.showVariance && (
                    <TableHead className="text-right">Variação</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.generatedData.lineItems.map((item) => (
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
                    {state.displayOptions.showPercentages && (
                      <TableCell className="text-right">
                        {item.percentageOfRevenue?.toFixed(1)}%
                      </TableCell>
                    )}
                    {state.displayOptions.showVariance && (
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
