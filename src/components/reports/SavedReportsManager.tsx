
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Copy, Play, Search, Filter } from 'lucide-react';

interface SavedReport {
  id: string;
  name: string;
  description: string;
  type: 'dre' | 'custos' | 'rentabilidade' | 'fluxo-caixa';
  createdAt: Date;
  lastUsed: Date | null;
  usageCount: number;
  isTemplate: boolean;
}

interface SavedReportsManagerProps {
  reports: SavedReport[];
  onEdit: (report: SavedReport) => void;
  onDelete: (reportId: string) => void;
  onDuplicate: (report: SavedReport) => void;
  onGenerate: (report: SavedReport) => void;
}

export const SavedReportsManager = ({ 
  reports, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onGenerate 
}: SavedReportsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      'dre': 'bg-blue-100 text-blue-800',
      'custos': 'bg-green-100 text-green-800',
      'rentabilidade': 'bg-purple-100 text-purple-800',
      'fluxo-caixa': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeName = (type: string) => {
    const names = {
      'dre': 'DRE',
      'custos': 'Custos',
      'rentabilidade': 'Rentabilidade',
      'fluxo-caixa': 'Fluxo de Caixa'
    };
    return names[type as keyof typeof names] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Salvos</CardTitle>
        <CardDescription>
          Gerencie seus templates e relatórios personalizados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtrar Relatórios</DialogTitle>
                <DialogDescription>
                  Escolha os critérios para filtrar seus relatórios
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Relatório</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['all', 'dre', 'custos', 'rentabilidade', 'fluxo-caixa'].map(type => (
                      <Button
                        key={type}
                        variant={filterType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType(type)}
                      >
                        {type === 'all' ? 'Todos' : getTypeName(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último uso</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                    {report.isTemplate && (
                      <Badge variant="secondary" className="mt-1">Template</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(report.type)}>
                    {getTypeName(report.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {report.createdAt.toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {report.lastUsed ? report.lastUsed.toLocaleDateString('pt-BR') : 'Nunca'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{report.usageCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGenerate(report)}
                      title="Gerar relatório"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(report)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(report)}
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Relatório</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o relatório "{report.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(report.id)}>
                            Excluir
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

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum relatório encontrado</p>
            <p className="text-sm">Crie seu primeiro relatório personalizado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
