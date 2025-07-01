
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Play } from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  required: boolean;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'dre' | 'custos' | 'rentabilidade' | 'fluxo-caixa';
  fields: ReportField[];
  filters: ReportFilter[];
  groupBy?: string;
  sortBy?: string;
}

interface ReportBuilderProps {
  onSave: (template: ReportTemplate) => void;
  onPreview: (template: ReportTemplate) => void;
  initialTemplate?: ReportTemplate;
}

export const ReportBuilder = ({ onSave, onPreview, initialTemplate }: ReportBuilderProps) => {
  const [template, setTemplate] = useState<ReportTemplate>(
    initialTemplate || {
      id: '',
      name: '',
      description: '',
      type: 'dre',
      fields: [],
      filters: []
    }
  );

  const availableFields: ReportField[] = [
    { id: 'receita_total', name: 'Receita Total', type: 'currency', required: false },
    { id: 'despesa_total', name: 'Despesa Total', type: 'currency', required: false },
    { id: 'lucro_liquido', name: 'Lucro Líquido', type: 'currency', required: false },
    { id: 'margem_liquida', name: 'Margem Líquida', type: 'percentage', required: false },
    { id: 'periodo', name: 'Período', type: 'date', required: true },
    { id: 'unidade', name: 'Unidade', type: 'text', required: false },
    { id: 'centro_custo', name: 'Centro de Custo', type: 'text', required: false }
  ];

  const addField = (field: ReportField) => {
    if (!template.fields.find(f => f.id === field.id)) {
      setTemplate(prev => ({
        ...prev,
        fields: [...prev.fields, field]
      }));
    }
  };

  const removeField = (fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setTemplate(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setTemplate(prev => ({
      ...prev,
      filters: prev.filters.map(f => 
        f.id === filterId ? { ...f, ...updates } : f
      )
    }));
  };

  const removeFilter = (filterId: string) => {
    setTemplate(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Construtor de Relatórios</CardTitle>
        <CardDescription>
          Crie relatórios personalizados selecionando campos e aplicando filtros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template-name">Nome do Relatório</Label>
            <Input
              id="template-name"
              value={template.name}
              onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do relatório"
            />
          </div>
          <div>
            <Label htmlFor="template-type">Tipo</Label>
            <Select
              value={template.type}
              onValueChange={(value: any) => setTemplate(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dre">DRE</SelectItem>
                <SelectItem value="custos">Custos</SelectItem>
                <SelectItem value="rentabilidade">Rentabilidade</SelectItem>
                <SelectItem value="fluxo-caixa">Fluxo de Caixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="template-description">Descrição</Label>
          <Input
            id="template-description"
            value={template.description}
            onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o objetivo do relatório"
          />
        </div>

        <Tabs defaultValue="fields" className="w-full">
          <TabsList>
            <TabsTrigger value="fields">Campos</TabsTrigger>
            <TabsTrigger value="filters">Filtros</TabsTrigger>
            <TabsTrigger value="options">Opções</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-4">
            <div>
              <Label>Campos Disponíveis</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableFields.map(field => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => addField(field)}
                  >
                    <span className="text-sm">{field.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Campos Selecionados</Label>
              <div className="space-y-2 mt-2">
                {template.fields.map(field => (
                  <div key={field.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{field.name}</span>
                      {field.required && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Filtros</Label>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Filtro
              </Button>
            </div>

            <div className="space-y-3">
              {template.filters.map(filter => (
                <div key={filter.id} className="grid grid-cols-4 gap-2 p-3 border rounded">
                  <Select
                    value={filter.field}
                    onValueChange={(value) => updateFilter(filter.id, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map(field => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.operator}
                    onValueChange={(value: any) => updateFilter(filter.id, { operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Igual a</SelectItem>
                      <SelectItem value="contains">Contém</SelectItem>
                      <SelectItem value="greater_than">Maior que</SelectItem>
                      <SelectItem value="less_than">Menor que</SelectItem>
                      <SelectItem value="between">Entre</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    placeholder="Valor"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="group-by">Agrupar por</Label>
                <Select
                  value={template.groupBy || ''}
                  onValueChange={(value) => setTemplate(prev => ({ ...prev, groupBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um campo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="centro_custo">Centro de Custo</SelectItem>
                    <SelectItem value="periodo">Período</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-by">Ordenar por</Label>
                <Select
                  value={template.sortBy || ''}
                  onValueChange={(value) => setTemplate(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um campo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Padrão</SelectItem>
                    <SelectItem value="receita_total">Receita Total</SelectItem>
                    <SelectItem value="lucro_liquido">Lucro Líquido</SelectItem>
                    <SelectItem value="margem_liquida">Margem Líquida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onPreview(template)}>
            <Play className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={() => onSave(template)}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
