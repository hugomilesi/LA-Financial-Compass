
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SystemParameter } from '@/types/systemSettings';
import { Edit, Save, X, Eye, EyeOff, Settings } from 'lucide-react';

interface SystemParametersSectionProps {
  parameters: SystemParameter[];
}

export const SystemParametersSection = ({ parameters }: SystemParametersSectionProps) => {
  const { toast } = useToast();
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [visibleSensitive, setVisibleSensitive] = useState<Set<string>>(new Set());

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'integration':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'sync':
        return 'bg-green-100 text-green-800';
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'bg-gray-100 text-gray-800';
      case 'number':
        return 'bg-blue-100 text-blue-800';
      case 'boolean':
        return 'bg-green-100 text-green-800';
      case 'json':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditParameter = (parameter: SystemParameter) => {
    setEditingParameter(parameter.id);
    setEditValue(parameter.value);
  };

  const handleSaveParameter = async (parameter: SystemParameter) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Parâmetro Atualizado",
        description: `${parameter.key} foi atualizado com sucesso`,
      });
      
      setEditingParameter(null);
      setEditValue('');
    } catch (error) {
      toast({
        title: "Erro ao Atualizar",
        description: `Falha ao atualizar parâmetro ${parameter.key}`,
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingParameter(null);
    setEditValue('');
  };

  const toggleSensitiveVisibility = (parameterId: string) => {
    const newVisible = new Set(visibleSensitive);
    if (newVisible.has(parameterId)) {
      newVisible.delete(parameterId);
    } else {
      newVisible.add(parameterId);
    }
    setVisibleSensitive(newVisible);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const renderParameterValue = (parameter: SystemParameter) => {
    if (parameter.sensitive && !visibleSensitive.has(parameter.id)) {
      return '***OCULTO***';
    }

    if (editingParameter === parameter.id) {
      if (parameter.type === 'boolean') {
        return (
          <Switch
            checked={editValue === 'true'}
            onCheckedChange={(checked) => setEditValue(checked ? 'true' : 'false')}
          />
        );
      }
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full"
          type={parameter.type === 'number' ? 'number' : 'text'}
        />
      );
    }

    if (parameter.type === 'boolean') {
      return (
        <Badge className={parameter.value === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {parameter.value === 'true' ? 'Ativo' : 'Inativo'}
        </Badge>
      );
    }

    return parameter.value;
  };

  const groupedParameters = parameters.reduce((groups, parameter) => {
    const category = parameter.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(parameter);
    return groups;
  }, {} as Record<string, SystemParameter[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Parâmetros do Sistema</h2>
        <p className="text-gray-600">
          Configure parâmetros globais que controlam o comportamento do sistema.
        </p>
      </div>

      {Object.entries(groupedParameters).map(([category, categoryParameters]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {category}
            </CardTitle>
            <CardDescription>
              Parâmetros da categoria {category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chave</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Modificado por</TableHead>
                  <TableHead>Última Modificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryParameters.map((parameter) => (
                  <TableRow key={parameter.id}>
                    <TableCell className="font-mono text-sm">{parameter.key}</TableCell>
                    <TableCell className="min-w-32">
                      {renderParameterValue(parameter)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getTypeColor(parameter.type)}`}>
                        {parameter.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{parameter.description}</span>
                        {parameter.sensitive && (
                          <Badge variant="outline" className="text-xs">
                            Sensível
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{parameter.modifiedBy}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(parameter.lastModified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {parameter.sensitive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSensitiveVisibility(parameter.id)}
                          >
                            {visibleSensitive.has(parameter.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        {parameter.editable && (
                          <>
                            {editingParameter === parameter.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSaveParameter(parameter)}
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditParameter(parameter)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
