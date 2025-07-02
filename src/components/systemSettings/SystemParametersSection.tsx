import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { SystemParameter } from '@/types/systemSettings';
import { SystemParameterModal } from './SystemParameterModal';
import { Search, Filter, Plus, Edit, Trash2, Lock, Eye, EyeOff, Save, X } from 'lucide-react';

interface SystemParametersSectionProps {
  parameters: SystemParameter[];
}

export const SystemParametersSection = ({ parameters }: SystemParametersSectionProps) => {
  const { toast } = useToast();
  const { updateSystemParameter } = useSystemSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedParameter, setSelectedParameter] = useState<SystemParameter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [visibleSensitive, setVisibleSensitive] = useState<Set<string>>(new Set());

  console.log('🏗️ [SystemParametersSection] Rendering with parameters:', parameters.length);

  const filteredParameters = parameters.filter(param => {
    const matchesSearch = param.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         param.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || param.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(parameters.map(param => param.category)));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'bg-blue-100 text-blue-800';
      case 'number':
        return 'bg-green-100 text-green-800';
      case 'boolean':
        return 'bg-purple-100 text-purple-800';
      case 'json':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'string':
        return 'Texto';
      case 'number':
        return 'Número';
      case 'boolean':
        return 'Booleano';
      case 'json':
        return 'JSON';
      default:
        return type;
    }
  };

  const formatValue = (value: string, type: string, sensitive: boolean, parameterId: string) => {
    if (sensitive && !visibleSensitive.has(parameterId)) {
      return '••••••••';
    }

    switch (type) {
      case 'boolean':
        return value === 'true' ? 'Verdadeiro' : 'Falso';
      case 'json':
        try {
          return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
          return value;
        }
      default:
        return value;
    }
  };

  const handleNewParameter = () => {
    console.log('➕ [SystemParametersSection] New parameter clicked');
    setSelectedParameter(null);
    setIsModalOpen(true);
  };

  const handleEditParameter = (parameter: SystemParameter) => {
    console.log('✏️ [SystemParametersSection] Edit parameter clicked:', parameter.key);
    setSelectedParameter(parameter);
    setIsModalOpen(true);
  };

  const handleDeleteParameter = async (parameter: SystemParameter) => {
    console.log('🗑️ [SystemParametersSection] Delete parameter:', parameter.key);
    // In a real implementation, this would call a delete API
    toast({
      title: "Parâmetro Removido",
      description: `${parameter.key} foi removido com sucesso`,
    });
  };

  const handleSaveParameter = async (parameter: SystemParameter) => {
    console.log('💾 [SystemParametersSection] Save parameter:', parameter.key);
    await updateSystemParameter(parameter);
    setIsModalOpen(false);
  };

  const startInlineEdit = (parameter: SystemParameter) => {
    console.log('✏️ [SystemParametersSection] Start inline edit for:', parameter.key);
    setEditingParameter(parameter.id);
    setEditValue(parameter.value);
  };

  const cancelInlineEdit = () => {
    console.log('❌ [SystemParametersSection] Cancel inline edit');
    setEditingParameter(null);
    setEditValue('');
  };

  const saveInlineEdit = async (parameter: SystemParameter) => {
    console.log('💾 [SystemParametersSection] Save inline edit for:', parameter.key, 'New value:', editValue);
    const updatedParameter = { ...parameter, value: editValue, lastModified: new Date().toISOString() };
    
    try {
      await updateSystemParameter(updatedParameter);
      setEditingParameter(null);
      setEditValue('');
      
      toast({
        title: "Parâmetro Atualizado",
        description: `${parameter.key} foi atualizado com sucesso`,
      });
    } catch (error) {
      console.error('❌ [SystemParametersSection] Error saving parameter:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar parâmetro",
        variant: "destructive",
      });
    }
  };

  const toggleSensitiveVisibility = (parameterId: string) => {
    console.log('👁️ [SystemParametersSection] Toggle sensitive visibility for:', parameterId);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Parâmetros do Sistema</h2>
          <p className="text-gray-600">
            Configure parâmetros globais que controlam o comportamento do sistema.
          </p>
        </div>
        <Button onClick={handleNewParameter}>
          <Plus className="h-4 w-4" />
          Novo Parâmetro
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar parâmetros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parâmetros Configurados</CardTitle>
          <CardDescription>
            Mostrando {filteredParameters.length} de {parameters.length} parâmetros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Modificado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParameters.map((parameter) => (
                <TableRow key={parameter.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {parameter.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {parameter.key}
                      </code>
                      {parameter.sensitive && (
                        <Lock className="h-4 w-4 text-amber-500" aria-label="Parâmetro sensível" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getTypeColor(parameter.type)}`}>
                      {getTypeText(parameter.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {editingParameter === parameter.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log('💾 [Button] Save inline edit clicked for:', parameter.key);
                            saveInlineEdit(parameter);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('❌ [Button] Cancel inline edit clicked');
                            cancelInlineEdit();
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-50 px-2 py-1 rounded truncate">
                          {formatValue(parameter.value, parameter.type, parameter.sensitive, parameter.id)}
                        </code>
                        {parameter.sensitive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              console.log('👁️ [Button] Toggle visibility clicked for:', parameter.key);
                              toggleSensitiveVisibility(parameter.id);
                            }}
                          >
                            {visibleSensitive.has(parameter.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={parameter.description}>
                    {parameter.description}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    <div>
                      {formatDate(parameter.lastModified)}
                    </div>
                    <div className="text-gray-400">
                      por {parameter.modifiedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {parameter.editable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('✏️ [Button] Inline edit button clicked for:', parameter.key);
                            startInlineEdit(parameter);
                          }}
                          disabled={editingParameter === parameter.id}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          console.log('✏️ [Button] Edit modal button clicked for:', parameter.key);
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditParameter(parameter);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o parâmetro "{parameter.key}"? 
                              Esta ação pode afetar o funcionamento do sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteParameter(parameter)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SystemParameterModal
        parameter={selectedParameter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveParameter}
      />
    </div>
  );
};
