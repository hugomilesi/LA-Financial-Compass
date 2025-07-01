
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Edit, Trash2, Copy, Star, Search, Filter, Download, Upload } from 'lucide-react';
import { DRETemplate } from '@/types/dre';

interface DRETemplateManagerProps {
  templates: DRETemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: DRETemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (template: DRETemplate) => void;
  onSetDefault: (templateId: string) => void;
  onImportTemplate: (file: File) => void;
  onExportTemplate: (template: DRETemplate) => void;
}

export const DRETemplateManager = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onSetDefault,
  onImportTemplate,
  onExportTemplate
}: DRETemplateManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'default' | 'custom'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DRETemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'default' && template.isDefault) ||
                         (filterType === 'custom' && !template.isDefault);
    return matchesSearch && matchesFilter;
  });

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportTemplate(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Gerenciar Templates DRE
            </CardTitle>
            <CardDescription>
              Crie, edite e organize seus templates de estrutura DRE
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                id="template-import"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('template-import')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
            <Button onClick={onCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: 'all' | 'default' | 'custom') => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="custom">Personalizados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Templates Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {template.isDefault && <Star className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium">{template.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {template.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {template.structure.length} itens
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {template.isDefault && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Padrão
                      </Badge>
                    )}
                    {template.isPublic && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Público
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {template.createdAt.toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                      title="Visualizar"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExportTemplate(template)}
                      title="Exportar"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateTemplate(template)}
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTemplate(template)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!template.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetDefault(template.id)}
                        title="Definir como padrão"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTemplate(template.id)}
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum template encontrado</p>
            <p>Crie seu primeiro template ou ajuste os filtros de busca.</p>
          </div>
        )}

        {/* Template Preview Modal */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedTemplate?.name}</DialogTitle>
              <DialogDescription>
                {selectedTemplate?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Criado em:</span> {selectedTemplate?.createdAt.toLocaleDateString('pt-BR')}
                </div>
                <div>
                  <span className="font-medium">Itens:</span> {selectedTemplate?.structure.length}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Estrutura:</h4>
                <div className="space-y-1">
                  {selectedTemplate?.structure.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-2 text-sm"
                      style={{ paddingLeft: `${item.level * 16}px` }}
                    >
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.code}
                      </span>
                      <span>{item.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
